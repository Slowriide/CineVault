import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import { Carousel } from "./Carousel";
import { CustomError } from "@/components/custom/CustomError";

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
  if (error)
    return (
      <CustomError
        title={"Error loading carrousel"}
        message={"Please try again"}
        height={40}
      />
    );

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
