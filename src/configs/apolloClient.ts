import { ApolloClient, InMemoryCache, createHttpLink, split, ApolloError } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';

// Helper function để lấy token từ persist store
const getTokenFromPersist = () => {
  try {
    const persistKey = 'persist:auth'; 
    const persistData = localStorage.getItem(persistKey);
    
    if (persistData) {
      const parsedData = JSON.parse(persistData);
      
      if (parsedData.token) {
        const token = JSON.parse(parsedData.token);
        return token;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting token from persist:', error);
    return null;
  }
};

// HTTP Link cho queries và mutations
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_GRAPQL_URL,
});

const wsLink = new GraphQLWsLink(createClient({
  url: import.meta.env.VITE_API_WS_GRAPQL_URL,
  connectionParams: () => {
    const token = getTokenFromPersist();
    console.log('🔑 WebSocket connecting with token:', token ? 'Present' : 'Missing');
    return {
      Authorization: token ? `Bearer ${token}` : "",
    };
  },
  // ✅ Debug WebSocket connection
  on: {
    opened: () => {
      console.log('🔗 WebSocket connected successfully');
    },
    closed: (event) => {
      console.log('❌ WebSocket disconnected:', event);
    },
    error: (error) => {
      console.error('💥 WebSocket error:', error);
    },
    connecting: () => {
      console.log('🔄 WebSocket connecting...');
    }
  },
  // ✅ Retry connection
  retryAttempts: 5,
  shouldRetry: () => true,
}));

// Auth Link để thêm token vào headers
const authLink = setContext((_, { headers }) => {
  const token = getTokenFromPersist();
    
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// Error Link để handle authentication errors
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.group(`🚨 GraphQL Error in ${operation.operationName || 'Unknown Operation'}`);
      console.error('Message:', message);
      console.error('Path:', path);
      console.error('Locations:', locations);
        // Log additional error details if available
      if (extensions) {
        console.error('Extensions:', extensions);
        
        // Check for validation errors
        if (extensions.code === 'BAD_USER_INPUT' || extensions.exception) {
          console.error('Validation/Input Error Details:', extensions.exception || extensions);
        }
        
        // Log original error details if available
        if (extensions.originalError) {
          console.error('Original Error:', extensions.originalError);
          
          // Check for nested error details
          if (extensions.originalError.message) {
            console.error('Original Error Message:', extensions.originalError.message);
          }
          
          // Check for validation error details in original error
          if (extensions.originalError.error) {
            console.error('Nested Error Details:', extensions.originalError.error);
          }
          
          // Check for response details
          if (extensions.originalError.response) {
            console.error('Error Response:', extensions.originalError.response);
          }
        }
        
        // Log stacktrace if available (first few lines only)
        if (extensions.stacktrace && Array.isArray(extensions.stacktrace)) {
          console.error('Stacktrace (first 3 lines):', extensions.stacktrace.slice(0, 3));
        }
      }
      
      // Log operation variables for debugging
      console.error('Operation Variables:', operation.variables);
      console.groupEnd();
    });
  }

  if (networkError) {
    console.group(`🌐 Network Error in ${operation.operationName || 'Unknown Operation'}`);
    console.error('Network error:', networkError);
    
    // Log more details about the network error
    if ('result' in networkError && networkError.result) {
      console.error('Error result:', networkError.result);
    }
    
    if ('response' in networkError && networkError.response) {
      console.error('Response status:', networkError.response.status);
      console.error('Response statusText:', networkError.response.statusText);
    }
    
    console.groupEnd();
    
    // Handle 401 unauthorized error
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      try {
        localStorage.removeItem('persist:auth');
        window.location.href = '/login';
      } catch (e) {
        console.error('Error clearing persist data:', e);
      }
    }
  }
});

// Split link: WebSocket cho subscriptions, HTTP cho queries/mutations  
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    const isSubscription = (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
    
    // ✅ Log để debug
    console.log('🔀 Operation type:', definition.operation, 'Using WebSocket:', isSubscription);
    
    return isSubscription;
  },
  wsLink,
  errorLink.concat(authLink).concat(httpLink),
);

// Tạo Apollo Client
export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Feedback: {
        fields: {
          // Merge policy cho pagination nếu có
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

// Helper function để update token dynamically
export const updateApolloClientToken = () => {
  apolloClient.resetStore();
};

// Helper function to extract meaningful error messages
export const getGraphQLErrorMessage = (error: ApolloError | Error | unknown): string => {
  // Check for GraphQL errors first
  if (error?.graphQLErrors?.length > 0) {
    const graphQLError = error.graphQLErrors[0];
    
    // Check for validation errors in extensions
    if (graphQLError.extensions?.exception?.response?.message) {
      const messages = graphQLError.extensions.exception.response.message;
      if (Array.isArray(messages)) {
        return messages.join(', ');
      }
      return messages;
    }
    
    // Check for custom error codes
    if (graphQLError.extensions?.code) {
      switch (graphQLError.extensions.code) {
        case 'BAD_USER_INPUT':
          return 'Invalid input data provided';
        case 'UNAUTHENTICATED':
          return 'Authentication required';
        case 'FORBIDDEN':
          return 'Access denied';
        default:
          return graphQLError.message || 'GraphQL error occurred';
      }
    }
    
    return graphQLError.message || 'GraphQL error occurred';
  }
  
  // Check for network errors
  if (error?.networkError) {
    if (error.networkError.statusCode === 400) {
      return 'Bad request - please check your input data';
    }
    if (error.networkError.statusCode === 401) {
      return 'Authentication required';
    }
    if (error.networkError.statusCode === 403) {
      return 'Access denied';
    }
    if (error.networkError.statusCode >= 500) {
      return 'Server error - please try again later';
    }
    return error.networkError.message || 'Network error occurred';
  }
  
  // Fallback to generic message
  return error?.message || 'An unexpected error occurred';
};