export function getYearFromReleaseDate(releaseDate?: string | null): string {
  if (!releaseDate) return "N/A";

  // Si solo tiene 4 dígitos, asumir que es solo un año
  if (/^\d{4}$/.test(releaseDate)) {
    return releaseDate;
  }

  const date = new Date(releaseDate);
  return isNaN(date.getTime()) ? "N/A" : date.getFullYear().toString();
}
