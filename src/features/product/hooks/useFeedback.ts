// hooks/useFeedback.ts
import { useState, useEffect } from 'react';
import { 
  useQuery, 
  useMutation, 
  useSubscription,
type  QueryHookOptions,
 type MutationHookOptions 
} from '@apollo/client';

import {
type  Feedback,
 type CreateFeedbackInput,
 type UpdateFeedbackInput
} from '@/types';


import {
   GET_FEEDBACKS,
  CREATE_FEEDBACK,
  UPDATE_FEEDBACK,
   DELETE_FEEDBACK,
  FEEDBACK_CREATED_SUBSCRIPTION,
  FEEDBACK_UPDATED_SUBSCRIPTION,
  FEEDBACK_DELETED_SUBSCRIPTION,
  FEEDBACK_STATUS_CHANGED_SUBSCRIPTION
} from '@/queries';





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