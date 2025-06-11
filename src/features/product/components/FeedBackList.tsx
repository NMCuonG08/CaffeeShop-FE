import React, { useState, useEffect } from 'react';
import { useFeedback } from '@/features/product/hooks/useFeedback';
import {
  StarIcon,
  PlusIcon,
  XMarkIcon,
  ChatBubbleLeftEllipsisIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { showConfirm, showError, showInfo, showSuccess } from '@/components';
import FeedbackCard from './FeedbackCard';
import { type Feedback, type User } from '@/types';
import { Trash } from 'lucide-react';

interface FeedBackListProps {
  productId: number;
  feedbacks: Feedback[];
  isAuthenticated: boolean;
  currentUser: User;
}

const FeedBackList: React.FC<FeedBackListProps> = ({
  productId,
  feedbacks: fallbackFeedbacks,
  isAuthenticated,
  currentUser
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newComment, setNewComment] = useState({
    rating: 5,
    content: '',
    title: '' // Add title field
  });

  const {
    feedbacks: liveFeedbacks,
    loading: feedbackLoading,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    creating,
    updating
  } = useFeedback({
    productId,
    status: 'APPROVED',
    enableRealtime: true
  });

  // Use live feedbacks or fallback
  const displayFeedbacks = liveFeedbacks.length > 0 ? liveFeedbacks : fallbackFeedbacks;

  // Check if current user has already reviewed this product
  const userExistingFeedback = displayFeedbacks?.find(feedback =>
    feedback?.user?.id === currentUser?.id ||
    feedback?.user?.email === currentUser?.email
  );

  // Set form data when editing existing feedback
  useEffect(() => {
    if (isUpdating && userExistingFeedback) {
      setNewComment({
        rating: userExistingFeedback.rating || 5,
        content: userExistingFeedback.content || '',
        title: userExistingFeedback.title || ''
      });
    } else if (!isUpdating) {
      setNewComment({
        rating: 5,
        content: '',
        title: ''
      });
    }
  }, [isUpdating, userExistingFeedback]);

  console.log('📊 FeedBackList render:', {
    productId,
    liveFeedbacksCount: liveFeedbacks.length,
    fallbackCount: fallbackFeedbacks.length,
    displayCount: displayFeedbacks.length,
    userHasReview: !!userExistingFeedback,
    currentUserId: currentUser?.id
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showError('You must be logged in to add a review');
      return;
    }

    if (!newComment.content.trim()) {
      showError('Review content cannot be empty');
      return;
    }

    if (!newComment.title.trim()) {
      showError('Review title cannot be empty');
      return;
    }

    try {
      if (isUpdating && userExistingFeedback?.id) {
        console.log('🔄 Updating feedback with data:', {
          feedbackId: userExistingFeedback.id,
          rating: newComment.rating,
          content: newComment.content,
          title: newComment.title
        });

        await updateFeedback(userExistingFeedback.id, {
          rating: newComment.rating,
          content: newComment.content,
          title: newComment.title
        });

        showSuccess('Review updated successfully!');
        console.log('✅ Feedback updated successfully');
      } else {
        console.log('🚀 Creating feedback with data:', {
          productId,
          type: 'REVIEW',
          rating: newComment.rating,
          content: newComment.content,
          title: newComment.title
        });

        await createFeedback({
          productId,
          type: 'REVIEW',
          rating: newComment.rating,
          content: newComment.content,
          title: newComment.title
        });

        showSuccess('Review added successfully!');
        console.log('✅ Feedback created successfully');
      }

      // Reset form
      setNewComment({ rating: 5, content: '', title: '' });
      setShowAddForm(false);
      setIsUpdating(false);

    } catch (error: any) {
      console.error('❌ Error submitting comment:', error);
      const action = isUpdating ? 'update' : 'add';
      showError(`Failed to ${action} review: ` + (error?.message || 'Unknown error'));
    }
  };

  const handleDeleteFeedback = async (feedbackId: number) => {
    if (!isAuthenticated) {
      showError('You must be logged in to delete a review');
      return;
    }
    
    const userConfirmation = await showConfirm({
      title: 'Delete Review',
      text: 'Are you sure you want to delete this review? This action cannot be undone.',
      icon: 'question',
    });

    if (userConfirmation.isConfirmed) {
      try {
        console.log('🗑️ Deleting feedback with ID:', feedbackId);
        await deleteFeedback(feedbackId);
        showSuccess('Review deleted successfully!');
        console.log('✅ Feedback deleted successfully');
      } catch (error: any) {
        console.error('❌ Error deleting feedback:', error);
        showError('Failed to delete review: ' + (error?.message || 'Unknown error'));
      }
    } else {
      showInfo('Review deletion cancelled');
    }
  };

  const handleEditClick = () => {
    setIsUpdating(true);
    setShowAddForm(true);
  };

  const handleAddClick = () => {
    setIsUpdating(false);
    setShowAddForm(true);
  };

  const handleCancelClick = () => {
    setShowAddForm(false);
    setIsUpdating(false);
    setNewComment({ rating: 5, content: '', title: '' });
  };

  const renderStars = (rating: number, interactive = false, size = 'w-5 h-5') => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => {
          const isFilled = index < rating;

          if (interactive) {
            return (
              <button
                key={index}
                type="button"
                onClick={() => setNewComment(prev => ({ ...prev, rating: index + 1 }))}
                className="hover:scale-110 transition-transform duration-200 focus:outline-none"
              >
                {isFilled ? (
                  <StarSolidIcon className={`${size} text-yellow-400`} />
                ) : (
                  <StarIcon className={`${size} text-gray-300 hover:text-yellow-200`} />
                )}
              </button>
            );
          }

          return (
            <div key={index}>
              {isFilled ? (
                <StarSolidIcon className={`${size} text-yellow-400`} />
              ) : (
                <StarIcon className={`${size} text-gray-300`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <ChatBubbleLeftEllipsisIcon className="w-8 h-8" />
              Customer Reviews
              {feedbackLoading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              )}
            </h3>
            <p className="text-blue-100 mt-1">
              {displayFeedbacks?.length || 0} reviews • Real-time updates
            </p>
          </div>

          {isAuthenticated ? (
            <div className="flex gap-3">
              {userExistingFeedback ? (
                <button
                  onClick={() => showAddForm ? handleCancelClick() : handleEditClick()}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium px-6 py-3 rounded-full transition-all duration-200 flex items-center gap-2 border border-white/30"
                >
                  {showAddForm ? (
                    <>
                      <XMarkIcon className="w-5 h-5" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <PencilIcon className="w-5 h-5" />
                      Edit Review
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => showAddForm ? handleCancelClick() : handleAddClick()}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium px-6 py-3 rounded-full transition-all duration-200 flex items-center gap-2 border border-white/30"
                >
                  {showAddForm ? (
                    <>
                      <XMarkIcon className="w-5 h-5" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-5 h-5" />
                      Add Review
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="text-center bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
              <p className="text-white text-sm">Please login to add a review</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Add/Edit Comment Form */}
        {showAddForm && isAuthenticated && (
          <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <h4 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StarSolidIcon className="w-6 h-6 text-yellow-400" />
                {isUpdating ? 'Edit Your Review' : 'Write Your Review'}
              </div>

              {isUpdating && userExistingFeedback?.id && (
                <button 
                  onClick={() => handleDeleteFeedback(userExistingFeedback.id)} 
                  className="bg-red-500 backdrop-blur-sm hover:bg-red-300 text-white font-medium px-6 py-3 rounded-full transition-all duration-200 flex items-center gap-2 border border-white/30"
                >
                  <Trash className="w-5 h-5" />
                  Delete
                </button>
              )}
            </h4>

            {isUpdating && userExistingFeedback && (
              <div className="mb-4 p-3 bg-blue-100 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm font-medium">
                  ✏️ You're editing your existing review from {new Date(userExistingFeedback.createdAt || '').toLocaleDateString()}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmitComment} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {renderStars(newComment.rating, true, 'w-8 h-8')}
                  </div>
                  <span className="ml-3 text-lg font-medium text-gray-700">
                    {newComment.rating}/5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Review Title
                </label>
                <input
                  type="text"
                  value={newComment.title}
                  onChange={(e) => setNewComment(prev => ({
                    ...prev,
                    title: e.target.value
                  }))}
                  placeholder="Give your review a title..."
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Review
                </label>
                <textarea
                  value={newComment.content}
                  onChange={(e) => setNewComment(prev => ({
                    ...prev,
                    content: e.target.value
                  }))}
                  placeholder="Share your experience with this product. What did you like or dislike?"
                  rows={4}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={creating || updating}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
                >
                  {(creating || updating) ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {isUpdating ? 'Updating...' : 'Posting...'}
                    </span>
                  ) : (
                    isUpdating ? 'Update Review' : 'Post Review'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {displayFeedbacks && displayFeedbacks.length > 0 ? (
            displayFeedbacks.map((feedback, index) => (
              <FeedbackCard
                key={feedback?.id || index}
                feedback={feedback}
                index={index}
                isCurrentUser={feedback?.user?.id === currentUser?.id || feedback?.user?.email === currentUser?.email}
              />
            ))
          ) : (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChatBubbleLeftEllipsisIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No reviews yet</h3>
              <p className="text-gray-500 text-lg mb-6">Be the first to share your experience with this product!</p>
              {isAuthenticated && (
                <button
                  onClick={handleAddClick}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-full transition-all duration-200 transform hover:scale-105"
                >
                  Write First Review
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedBackList;