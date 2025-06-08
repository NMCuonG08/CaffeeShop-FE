import { gql } from '@apollo/client';



export const GET_FEEDBACKS = gql`
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

export const GET_FEEDBACKS_BY_PRODUCT = gql`
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

export const CREATE_FEEDBACK = gql`
  mutation($createFeedbackInput: CreateFeedbackInput!) {
  createFeedback(createFeedbackInput: $createFeedbackInput) {
    content,
    rating,
    type,
    productId
  }
}
`;

export const UPDATE_FEEDBACK = gql`
  mutation UpdateFeedback($id: Float!, $updateFeedbackInput: UpdateFeedbackInput!) {
    updateFeedback(id: $id, updateFeedbackInput: $updateFeedbackInput) {
      rating
      content
    }
  }
`;

export const DELETE_FEEDBACK = gql`
  mutation RemoveFeedback($id: Float!) {
    removeFeedback(id: $id) {
      id
    }
  }
`;

// Subscriptions
export const FEEDBACK_CREATED_SUBSCRIPTION = gql`
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
export const FEEDBACK_UPDATED_SUBSCRIPTION = gql`
  subscription FeedbackUpdated($productId: Float) {
    feedbackUpdated(productId: $productId) {
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

export const FEEDBACK_DELETED_SUBSCRIPTION = gql`
  subscription FeedbackDeleted($productId: Float) {
    feedbackDeleted(productId: $productId) {
      id
      productId
      userId
    }
  }
`;

export const FEEDBACK_STATUS_CHANGED_SUBSCRIPTION = gql`
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