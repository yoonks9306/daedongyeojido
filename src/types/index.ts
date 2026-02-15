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

export interface GuideEntry {
  id: string;
  title: string;
  content: string;
}

export interface GuideGroup {
  id: string;
  title: string;
  description: string;
  entries: GuideEntry[];
}

export interface GuideTab {
  id: string;
  title: string;
  subtitle: string;
  intro: string;
  groups: GuideGroup[];
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

export interface CommunityComment {
  id: number;
  postId: number;
  author: string;
  content: string;
  createdAt: string;
}
