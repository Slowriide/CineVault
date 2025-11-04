/**
 * Determines the optimal backdrop image size based on the current window width.
 * This helps to load appropriately sized images for different screen sizes,
 * balancing performance and quality.
 *
 * @returns {string} The TMDB image size string
 */
export const getOptimalBackdropSize = () => {
  if (window.innerWidth < 768) return "w780"; // Mobile devices
  if (window.innerWidth < 1536) return "w1280"; // Medium screens (tablets/laptops)
  return "original"; // Large screens (desktop, 4K) for full quality
};
