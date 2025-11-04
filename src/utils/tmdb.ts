const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

// Utility function to generate full image URLs for TMDB poster or profile images.
// - `path`: partial image path returned by TMDB API
// - `size`: optional size parameter (default: "w500")
// Returns a full valid image URL or a placeholder if missing.
export const getImageUrl = (path: string, size: string = "w500") => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

// Utility function for movie backdrop images (wider backgrounds).
// Similar to getImageUrl, but defaults to a larger size ("w1280").
export const getBackdropUrl = (path: string, size: string = "w1280") => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};
