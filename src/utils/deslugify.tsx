/**
 * Converts a slug (e.g., "john-doe") back into a readable name (e.g., "John Doe")
 * @param slug - The slug string to deslugify
 * @returns The capitalized name
 */
export function deslugify(slug: string): string {
  // Split the slug by "-" to get parts of the name
  const name = slug.split("-")[0]; // First part
  const lastName = slug.split("-")[1]; // Second part (assumes slug has exactly two parts)

  // Combine the first and last name with a space
  const completeName = `${name} ${lastName}`;

  // Capitalize each word in the name
  const capitalizedName = completeName
    .toLowerCase() // Ensure all letters are lowercase first
    .split(" ") // Split into words
    .map((word) =>
      // Capitalize first letter of each word
      word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word
    )
    .join(" "); // Join words back with spaces

  return capitalizedName;
}
