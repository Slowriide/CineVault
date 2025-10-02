import { getBackdropUrl } from "@/mocks/tmdb";

interface MovieBackdropProps {
  backdropPath: string;
}

export const MovieBackdrop = ({ backdropPath }: MovieBackdropProps) => {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-[60vh] bg-cover bg-center opacity-20 "
      style={{
        backgroundImage: `url(${getBackdropUrl(backdropPath, "original")})`,
      }}
    />
  );
};
