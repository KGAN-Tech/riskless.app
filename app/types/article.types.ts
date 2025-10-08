export interface ArticleAuthor {
  avatar: string;
  name: string;
  avatarUrl?: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  image: string;
  images?: string[];
  date: string;
  author: ArticleAuthor;
  content?: string;
  tags?: string[];
  category?: string;
} 