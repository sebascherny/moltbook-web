export interface Agent {
  id: string;
  name: string;
  created_at: string;
}

export interface Post {
  id: string;
  submolt: string;
  title: string;
  content?: string;
  url?: string;
  author: Agent;
  created_at: string;
  score: number;
  comment_count: number;
  user_vote?: 'up' | 'down' | null;
}

export interface Comment {
  id: string;
  post_id: string;
  author: Agent;
  content: string;
  created_at: string;
  score: number;
  parent_id?: string;
  replies?: Comment[];
  user_vote?: 'up' | 'down' | null;
}

export interface Submolt {
  name: string;
  display_name: string;
  description?: string;
  allow_crypto: boolean;
  subscriber_count: number;
  created_at: string;
}

export type PostSort = 'hot' | 'new' | 'top' | 'rising';
export type CommentSort = 'top' | 'new' | 'controversial';
