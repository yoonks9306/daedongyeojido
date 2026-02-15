export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      wiki_articles: {
        Row: {
          id: number;
          slug: string;
          title: string;
          category: 'Transport' | 'Apps' | 'Food' | 'Culture' | 'Places' | 'Practical';
          summary: string;
          infobox: Json | null;
          content: string;
          related_articles: string[];
          tags: string[];
          last_updated: string;
          created_at: string;
          updated_at: string;
          author_id: string | null;
        };
        Insert: Omit<Database['public']['Tables']['wiki_articles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['wiki_articles']['Insert']>;
      };
      community_posts: {
        Row: {
          id: number;
          title: string;
          content: string;
          author_id: string | null;
          author_name: string;
          category: 'review' | 'question' | 'free' | 'tip';
          upvotes: number;
          views: number;
          comment_count: number;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['community_posts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['community_posts']['Insert']>;
      };
      votes: {
        Row: {
          id: number;
          user_id: string;
          post_id: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['votes']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['votes']['Insert']>;
      };
      user_identities: {
        Row: {
          nextauth_subject: string;
          email: string;
          supabase_user_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_identities']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['user_identities']['Insert']>;
      };
      local_auth_users: {
        Row: {
          id: string;
          email: string;
          username: string;
          password_hash: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['local_auth_users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['local_auth_users']['Insert']>;
      };
      comments: {
        Row: {
          id: number;
          post_id: number;
          author_id: string | null;
          author_name: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['comments']['Insert']>;
      };
    };
  };
}
