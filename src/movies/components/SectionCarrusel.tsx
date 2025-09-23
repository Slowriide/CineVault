import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import { Carousel } from "./Carousel";

type SectionProps = {
  title: string;
  items: (MovieMovieDB | TvShowMovieDB)[];
  loading?: boolean | undefined;
  error?: unknown;
  mediaType: "movie" | "tv";
  header?: React.ReactNode;
};

export const SectionCarrusel = ({
  title,
  items,
  loading,
  error,
  mediaType,
  header,
}: SectionProps) => {
  if (error) return <p className="text-red-500">Error loading {title}</p>;

  return (
    <Carousel
      title={title}
      items={items ?? []}
      mediaType={mediaType}
      loading={loading}
      header={header}
    />
  );
};
