// hooks/useFeedback.ts
import { useState, useEffect } from 'react';
import { 
  useQuery, 
  useMutation, 
  useSubscription,
type  QueryHookOptions,
 type MutationHookOptions 
} from '@apollo/client';
import { gql } from '@apollo/client';

// Types
export interface Feedback {
  id: number;
  productId: number;
  userId: number;
  type: 'REVIEW' | 'COMPLAINT' | 'SUGGESTION';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rating?: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateFeedbackInput {
  productId: number;
  type: 'REVIEW' | 'COMPLAINT' | 'SUGGESTION';
  rating?: number;
  title: string;
  content: string;
}

export interface UpdateFeedbackInput {
  type?: 'REVIEW' | 'COMPLAINT' | 'SUGGESTION';
  rating?: number;
  title?: string;
  content?: string;
}

// GraphQL Queries & Mutations
const GET_FEEDBACKS = gql`
  query GetFeedbacks(
    $productId: Float
    $userId: Float
    $type: String
    $status: String
    $minRating: Float
    $maxRating: Float
  ) {
    feedbacks(
      productId: $productId
      userId: $userId
      type: $type
      status: $status
      minRating: $minRating
      maxRating: $maxRating
    ) {
      id
      productId
      userId
      type
      status
      rating
      content
      content
      createdAt
      updatedAt
      user {
        id
        lastName
        email
        firstName
        picture
      }
    }
  }
`;

const GET_FEEDBACKS_BY_PRODUCT = gql`
  query GetFeedbacksByProduct($productId: Float!) {
    feedbacksByProduct(productId: $productId) {
      id
      productId
      userId
      type
      status
      rating
      title
      content
      createdAt
      updatedAt
      user {
        id
        name
        email
      }
    }
  }
`;

const CREATE_FEEDBACK = gql`
  mutation($createFeedbackInput: CreateFeedbackInput!) {
  createFeedback(createFeedbackInput: $createFeedbackInput) {
    content,
    rating,
    type,
    productId
  }
}
`;

const UPDATE_FEEDBACK = gql`
  mutation UpdateFeedback($id: Float!, $updateFeedbackInput: UpdateFeedbackInput!) {
    updateFeedback(id: $id, updateFeedbackInput: $updateFeedbackInput) {
      id
      productId
      userId
      type
      status
      rating
      title
      content
      createdAt
      updatedAt
    }
  }
`;

const DELETE_FEEDBACK = gql`
  mutation RemoveFeedback($id: Float!) {
    removeFeedback(id: $id) {
      id
    }
  }
`;

// Subscriptions
const FEEDBACK_CREATED_SUBSCRIPTION = gql`
  subscription FeedbackCreated($productId: Float!) {
    feedbackCreated(productId: $productId) {
      id
      productId
      userId
      type
      status
      rating
      content
      createdAt
      updatedAt
      user {
        id
        firstName
        lastName
        email
        picture
      }
    }
  }
`;
const FEEDBACK_UPDATED_SUBSCRIPTION = gql`
  subscription FeedbackUpdated($productId: Float) {
    feedbackUpdated(productId: $productId) {
      id
      productId
      userId
      type
      status
      rating
      title
      content
      createdAt
      updatedAt
      user {
        id
        name
        email
      }
    }
  }
`;

const FEEDBACK_DELETED_SUBSCRIPTION = gql`
  subscription FeedbackDeleted($productId: Float) {
    feedbackDeleted(productId: $productId) {
      id
      productId
      userId
    }
  }
`;

const FEEDBACK_STATUS_CHANGED_SUBSCRIPTION = gql`
  subscription FeedbackStatusChanged($productId: Float) {
    feedbackStatusChanged(productId: $productId) {
      id
      productId
      userId
      type
      status
      rating
      title
      content
      createdAt
      updatedAt
      user {
        id
        name
        email
      }
    }
  }
`;

// Custom Hook for Feedback with Real-time Updates
export function useFeedback(options?: {
  productId?: number;
  userId?: number;
  type?: string;
  status?: string;
  minRating?: number;
  maxRating?: number;
  enableRealtime?: boolean;
}) {
  const {
    productId,
    userId,
    type,
    status,
    minRating,
    maxRating,
    enableRealtime = true
  } = options || {};

  // State to manage feedbacks
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  // Query to get initial feedbacks
  const { data, loading, error, refetch } = useQuery(GET_FEEDBACKS, {
    variables: {
      productId,
      userId,
      type,
      status,
      minRating,
      maxRating
    },
    onCompleted: (data) => {
      setFeedbacks(data.feedbacks || []);
    }
  });

  // Mutations
  const [createFeedbackMutation, { loading: creating }] = useMutation(CREATE_FEEDBACK);
  const [updateFeedbackMutation, { loading: updating }] = useMutation(UPDATE_FEEDBACK);
  const [deleteFeedbackMutation, { loading: deleting }] = useMutation(DELETE_FEEDBACK);

  // Subscriptions for real-time updates
  useSubscription(FEEDBACK_CREATED_SUBSCRIPTION, {
  variables: { productId },
  skip: !enableRealtime,
  onData: ({ data }) => {
    console.log('🔥 Subscription received:', data); // Debug này
    if (data.data?.feedbackCreated) {
      const newFeedback = data.data.feedbackCreated;
      console.log('📝 New feedback:', newFeedback); // Debug này
      setFeedbacks(prev => {
        console.log('📋 Current feedbacks:', prev.length); // Debug này
        const exists = prev.some(f => f.id === newFeedback.id);
        if (!exists) {
          const updated = [newFeedback, ...prev];
          console.log('✅ Updated feedbacks:', updated.length); // Debug này
          return updated;
        }
        return prev;
      });
    }
  },
  onError: (error) => {
    console.error('❌ Subscription error:', error); // Debug lỗi
  }
});

  useSubscription(FEEDBACK_UPDATED_SUBSCRIPTION, {
    variables: { productId },
    skip: !enableRealtime,
    onData: ({ data }) => {
      if (data.data?.feedbackUpdated) {
        const updatedFeedback = data.data.feedbackUpdated;
        setFeedbacks(prev => 
          prev.map(f => f.id === updatedFeedback.id ? updatedFeedback : f)
        );
      }
    }
  });

  useSubscription(FEEDBACK_DELETED_SUBSCRIPTION, {
    variables: { productId },
    skip: !enableRealtime,
    onData: ({ data }) => {
      if (data.data?.feedbackDeleted) {
        const deletedFeedback = data.data.feedbackDeleted;
        setFeedbacks(prev => 
          prev.filter(f => f.id !== deletedFeedback.id)
        );
      }
    }
  });

  useSubscription(FEEDBACK_STATUS_CHANGED_SUBSCRIPTION, {
    variables: { productId },
    skip: !enableRealtime,
    onData: ({ data }) => {
      if (data.data?.feedbackStatusChanged) {
        const changedFeedback = data.data.feedbackStatusChanged;
        setFeedbacks(prev => 
          prev.map(f => f.id === changedFeedback.id ? changedFeedback : f)
        );
      }
    }
  });

  // Helper functions
  const createFeedback = async (input: CreateFeedbackInput) => {
    try {
      const result = await createFeedbackMutation({
        variables: { createFeedbackInput: input }
      });
      return result.data?.createFeedback;
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw error;
    }
  };

  const updateFeedback = async (id: number, input: UpdateFeedbackInput) => {
    try {
      const result = await updateFeedbackMutation({
        variables: { id, updateFeedbackInput: input }
      });
      return result.data?.updateFeedback;
    } catch (error) {
      console.error('Error updating feedback:', error);
      throw error;
    }
  };

  const deleteFeedback = async (id: number) => {
    try {
      const result = await deleteFeedbackMutation({
        variables: { id }
      });
      return result.data?.removeFeedback;
    } catch (error) {
      console.error('Error deleting feedback:', error);
      throw error;
    }
  };

  return {
    feedbacks,
    loading,
    error,
    creating,
    updating,
    deleting,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    refetch
  };
}

// Hook for specific product feedbacks
export function useProductFeedbacks(productId: number, enableRealtime = true) {
  return useFeedback({ 
    productId, 
    status: 'APPROVED', 
    enableRealtime 
  });
}