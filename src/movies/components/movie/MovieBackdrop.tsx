import { getBackdropUrl } from "@/utils/tmdb";
import { getOptimalBackdropSize } from "@/utils/getOptimalBackdropSize";
import { Helmet } from "react-helmet";

interface MovieBackdropProps {
  backdropPath: string;
}

/**
 * Renders a semi-transparent backdrop image for a movie.
 * Preloads the image for performance and selects an optimal size based on screen width.
 */
export const MovieBackdrop = ({ backdropPath }: MovieBackdropProps) => {
  // Determine the optimal image size for the current viewport
  const backdropSize = getOptimalBackdropSize();

  return (
    <>
      {/* Preload backdrop for faster rendering */}
      <Helmet>
        <link rel="preload" as="image" href={backdropPath} />
      </Helmet>

      {/* Semi-transparent background div */}
      <div
        className="absolute top-0 left-0 right-0 h-[60vh] bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url(${getBackdropUrl(backdropPath, backdropSize)})`,
        }}
      />
    </>
  );
};
