import React from 'react';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import {type FeedbackCardProps,type User } from '@/types';

interface ExtendedFeedbackCardProps extends FeedbackCardProps {
  isCurrentUser?: boolean;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, index = 0, isCurrentUser = false  }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number, size = 'w-5 h-5') => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => {
          const isFilled = index < rating;
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

  const getInitials = (user?: User): string => {
    if (!user) return 'A';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const email = user.email || '';
    
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) return firstName.charAt(0).toUpperCase();
    if (lastName) return lastName.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    
    return 'A';
  };

  const getDisplayName = (user?: User): string => {
    if (!user) return 'Anonymous User';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const email = user.email || '';
    
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (lastName) return lastName;
    if (email) return email.split('@')[0];
    
    return 'Anonymous User';
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
    
    // Show fallback avatar
    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
    if (fallback) {
      fallback.style.display = 'flex';
    }
  };

  return (
    <div 
      className={`group rounded-2xl p-6 transition-all duration-200 border hover:shadow-md ${
        isCurrentUser 
          ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 ring-2 ring-blue-200' 
          : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300'
      }`}
    >
      {isCurrentUser && (
        <div className="mb-3 flex items-center gap-2">
          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Your Review
          </span>
        </div>
      )}
      
      {/* Rest of the existing FeedbackCard code... */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          {/* Avatar Container */}
          <div className="relative w-12 h-12">
            {/* User Picture */}
            {feedback?.user?.picture && (
              <img
                src={feedback.user.picture}
                alt={getDisplayName(feedback.user)}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                onError={handleImageError}
              />
            )}
            
            {/* Fallback Avatar */}
            <div 
              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-white shadow-md"
              style={{ display: feedback?.user?.picture ? 'none' : 'flex' }}
            >
              <span className="text-white font-bold text-sm">
                {getInitials(feedback?.user)}
              </span>
            </div>
          </div>
          
          {/* User Info */}
          <div>
            <h4 className="font-bold text-gray-900 text-lg">
              {getDisplayName(feedback?.user)}
            </h4>
            <div className="space-y-1">
              {feedback?.user?.email && (
                <p className="text-gray-400 text-xs">
                  {feedback.user.email}
                </p>
              )}
              <p className="text-gray-500 text-sm">
                {feedback?.createdAt ? formatDate(feedback.createdAt) : 'Recently'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm">
          {renderStars(feedback?.rating || 0)}
        </div>
      </div>
      
      {/* Review Content */}
      <div className="ml-16">
        <p className="text-gray-700 leading-relaxed text-base">
          {feedback?.content || 'No review content provided.'}
        </p>
      </div>
    </div>
  );
};

export default FeedbackCard;