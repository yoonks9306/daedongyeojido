export interface WikiArticle {
  slug: string;
  title: string;
  category: 'Transport' | 'Apps' | 'Food' | 'Culture' | 'Places' | 'Practical';
  summary: string;
  infobox?: Record<string, string>;
  content: string;
  relatedArticles: string[];
  tags: string[];
  lastUpdated: string;
}

export interface GuideItem {
  title: string;
  content: string;
  icon?: string;
}

export interface GuideSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  items: GuideItem[];
}

export interface CommunityPost {
  id: number;
  title: string;
  content: string;
  author: string;
  category: 'review' | 'question' | 'free' | 'tip';
  upvotes: number;
  views: number;
  comments: number;
  createdAt: string;
  tags: string[];
}
