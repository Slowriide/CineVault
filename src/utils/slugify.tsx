/**
 * slugify
 *
 * Converts a string (like a movie or TV show title) into a URL-friendly slug
 * and appends the item ID at the end.
 *
 * Example:
 *   slugify("Spider-Man: No Way Home", 123)
 *   => "spider-man-no-way-home-123"
 */
export function slugify(title: string, id: number): string {
  return (
    title
      .toLowerCase() // Convert all letters to lowercase
      .normalize("NFD") // Normalize accented characters (e.g., é -> e + ´)
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritic marks left from normalization
      .replace(/[^a-z0-9]+/g, "-") // Replace any non-alphanumeric character with a dash
      .replace(/^-+|-+$/g, "") + // Remove leading/trailing dashes
    "-" +
    id // Append the unique numeric ID to ensure the slug is unique
  );
}
