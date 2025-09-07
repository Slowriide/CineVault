export function slugify(title: string, id: number): string {
  return (
    title
      .toLowerCase()
      .normalize("NFD") // elimina acentos
      .replace(/[\u0300-\u036f]/g, "") // limpia caracteres especiales
      .replace(/[^a-z0-9]+/g, "-") // reemplaza por guiones
      .replace(/^-+|-+$/g, "") + // elimina guiones al inicio/fin
    "-" +
    id
  );
}
