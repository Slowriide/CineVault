/**
 * Extracts the year from a release date string.
 *
 * @param releaseDate - The release date string (e.g., "2023-05-15" or "2023")
 * @returns The year as a string, or "N/A" if the date is invalid or missing
 */
export function getYearFromReleaseDate(releaseDate?: string | null): string {
  if (!releaseDate) return "N/A"; // Return "N/A" if releaseDate is null or undefined

  // If the string is just 4 digits, assume it's already the year
  if (/^\d{4}$/.test(releaseDate)) {
    return releaseDate;
  }

  // Parse the date string
  const date = new Date(releaseDate);

  // Check if the parsed date is valid; otherwise return "N/A"
  return isNaN(date.getTime()) ? "N/A" : date.getFullYear().toString();
}
