
export type Sentiment = 'Positive' | 'Neutral' | 'Negative';
export type UserRole = 'admin' | 'user';

export interface User {
  email: string;
  role: UserRole;
  name?: string;
}

export interface Feedback {
  id: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  category: 'Feature Request' | 'Bug Report' | 'UI/UX' | 'Performance' | 'General';
  sentiment?: Sentiment;
  aiSummary?: string;
  response?: string;
  createdAt: string;
}

export interface AnalyticsSummary {
  totalFeedback: number;
  averageRating: number;
  sentimentDistribution: Record<Sentiment, number>;
  topThemes: string[];
  recommendations: string[];
}

export type ViewType = 'dashboard' | 'feedback-list' | 'add-feedback' | 'my-submissions' | 'ai-insights' | 'docs' | 'auth';
