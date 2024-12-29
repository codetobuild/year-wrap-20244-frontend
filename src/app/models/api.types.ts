export interface ApiResponse<T> {
  success: boolean;
  data?: T;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  isAdult: boolean;
  isActive: boolean;
}

export interface Submission {
  _id: string;
  sessionId: string;
  selectedEvents: Array<{ eventId: string }>;
  customEvents: Array<{ id: string; title: string; points: number }>;
  shareCode: string;
  totalPoints: number;
  status: 'draft' | 'completed';
  temporaryUsername?: string;
}

export interface TrendingEvent {
  _id: string;
  title: string;
}

export interface IEvent {
  _id: string;
  categoryId: Category;
  title: string;
  description: string;
  points: number;
  icon: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
