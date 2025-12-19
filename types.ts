
export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string; // Fallback content or loaded content
  contentPath?: string; // Path to fetch external markdown (e.g., "/articles/my-post.md")
  externalUrl?: string; // If present, clicking opens this link instead of internal reader
  isPremium?: boolean; // Visual indicator for paid/substack content
  author: string;
  date: string; // ISO format YYYY-MM-DD
  imageUrl: string;
  tags: string[];
}

export type ViewState = 'HOME' | 'LATEST' | 'LIST' | 'ABOUT' | 'ARTICLE_READ';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}
