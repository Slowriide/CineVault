export interface TrailerResponse {
  id: number;
  results: Trailer[];
}

export interface Trailer {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: TrailerType;
  official: boolean;
  published_at: Date;
  id: string;
}

export type TrailerType = "Clip" | "Featurette" | "Trailer";
