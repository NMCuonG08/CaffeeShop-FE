import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
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
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.group(`🚨 GraphQL Error in ${operation.operationName || 'Unknown Operation'}`);
      console.error('Message:', message);
      console.error('Path:', path);
      console.error('Locations:', locations);
        
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
    
    // ✅ Safe property access
    if (definition.kind === 'OperationDefinition') {
      console.log('🔀 Operation type:', definition.operation, 'Using WebSocket:', isSubscription);
    } else {
      console.log('🔀 Fragment definition detected');
    }
    
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

