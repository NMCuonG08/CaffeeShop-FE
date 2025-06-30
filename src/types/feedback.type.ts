
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
    picture: string;
  };
}

export  interface  FeedbackCardProps {
  feedback: Feedback;
  isCurrentUser : boolean;
  index?: number;
  
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
