export interface ReviewsResponse {
  id: number;
  page: number;
  results: Reviews[];
  total_pages: number;
  total_results: number;
}

export interface Reviews {
  author: string;
  author_details: AuthorDetails;
  content: string;
  created_at: Date;
  id: string;
  updated_at: Date;
  url: string;
}

export interface AuthorDetails {
  name: string;
  username: string;
  avatar_path: null | string;
  rating: number;
}

export interface supabaseReview {
  id?: string | null;
  user_id?: string | null;
  movie_id?: string | null;
  media_type?: string | null;
  rating?: number | null;
  content?: string | null;
  created_at?: string | null;
}
