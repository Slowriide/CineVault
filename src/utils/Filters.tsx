// Sorting options for movies or TV shows, typically used in dropdowns
export const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" }, // Sort by popularity, descending
  { value: "release_date.desc", label: "Latest Releases" }, // Sort by release date, newest first
  { value: "vote_average.desc", label: "Highest Rated" }, // Sort by average rating, descending
  { value: "revenue.desc", label: "Highest Grossing" }, // Sort by revenue, descending
  { value: "title.asc", label: "A-Z" }, // Sort alphabetically by title
];

// Supported languages for filtering or displaying content
export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
];

// Filter types for content, e.g., to select between movies and TV shows
export const FILTERTYPES = [
  { value: "movie", label: "Movie" },
  { value: "tv", label: "Tv" },
];
