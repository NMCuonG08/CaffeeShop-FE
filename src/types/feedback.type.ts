export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  picture?: string;
}

export interface Feedback {
  id?: number;
  rating: number;
  content: string;
  createdAt?: string;
  user?: User;
  type?: 'REVIEW' | 'COMMENT';
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export  interface  FeedbackCardProps {
  feedback: Feedback;
  index?: number;
}