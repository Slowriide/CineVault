export function deslugify(slug: string): string {
  const name = slug.split("-")[0];
  const lastName = slug.split("-")[1];

  const completeName = `${name} ${lastName}`;

  const capitalizedName = completeName
    .toLowerCase()
    .split(" ")
    .map((word) =>
      word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word
    )
    .join(" ");

  return capitalizedName;
}
