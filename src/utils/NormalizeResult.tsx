import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import type {
  NormalizedSearchResult,
  PersonSearch,
  SearchResult,
} from "@/interfaces/SearchResponse";

export function normalizeSearchResults(
  item: SearchResult
): NormalizedSearchResult | null {
  switch (item.media_type) {
    case "movie":
      return {
        id: item.id,
        title: item.title ?? "Untitled",
        release_date: item.release_date ?? "",
        overview: item.overview ?? "",
        poster_path: item.poster_path ?? "",
        backdrop_path: item.backdrop_path ?? "",
        vote_average: item.vote_average ?? 0,
        vote_count: item.vote_count ?? 0,
        popularity: item.popularity ?? 0,
        genre_ids: item.genre_ids ?? [],
        adult: item.adult ?? false,
        original_language: item.original_language ?? "",
        original_title: item.original_title ?? "",
        video: item.video ?? false,
        media_type: "movie",
      } as MovieMovieDB;

    case "tv":
      return {
        adult: item.adult ?? false,
        backdrop_path: item.backdrop_path ?? "",
        genre_ids: item.genre_ids ?? [],
        id: item.id,
        origin_country: item.origin_country ?? [],
        original_language: item.original_language ?? "",
        original_name: item.original_name ?? "",
        overview: item.overview ?? "",
        popularity: item.popularity ?? 0,
        poster_path: item.poster_path ?? "",
        first_air_date: item.first_air_date ?? Date,
        name: item.name ?? "",
        vote_average: item.vote_average ?? 0,
        vote_count: item.vote_count ?? 0,
        media_type: "tv",
      } as TvShowMovieDB;

    case "person":
      return {
        adult: item.adult ?? false,
        id: item.id ?? 0,
        name: item.name ?? "",
        original_name: item.original_name ?? "",
        popularity: item.popularity ?? 0,
        gender: item.gender ?? 0,
        known_for_department: item.known_for_department ?? "",
        profile_path: item.profile_path ?? "",
        media_type: "person",
      } as PersonSearch;

    default:
      return null;
  }
}
