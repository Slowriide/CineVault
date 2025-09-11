export interface SearchResponse {
  page: number;
  results: PersonSearch[];
  total_pages: number;
  total_results: number;
}

export interface PersonSearch {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: null | string;
  known_for: KnownForInPersonSearch[];
}

export interface KnownForInPersonSearch {
  adult: boolean;
  backdrop_path: null | string;
  id: number;
  title?: string;
  original_title?: string;
  overview: string;
  poster_path: null | string;
  media_type: string;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date?: string;
  video?: boolean;
  vote_average: number;
  vote_count: number;
  name?: string;
  original_name?: string;
  first_air_date?: Date;
  origin_country?: string[];
}
