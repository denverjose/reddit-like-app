export type Protocol = {
  id: number;
  title: string;
  content: string;
  tags?: string[];
  author: string;
  average_rating?: number;
  review_count?: number;
};