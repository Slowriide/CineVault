import { getBackdropUrl } from "@/mocks/tmdb";
import { getOptimalBackdropSize } from "@/utils/getOptimalBackdropSize";
import { Helmet } from "react-helmet";

interface MovieBackdropProps {
  backdropPath: string;
}

export const MovieBackdrop = ({ backdropPath }: MovieBackdropProps) => {
  const backdropSize = getOptimalBackdropSize();

  return (
    <>
      <Helmet>
        <link rel="preload" as="image" href={backdropPath} />
      </Helmet>
      <div
        className="absolute top-0 left-0 right-0 h-[60vh] bg-cover bg-center opacity-20 "
        style={{
          backgroundImage: `url(${getBackdropUrl(backdropPath, backdropSize)})`,
        }}
      />
    </>
  );
};
