import { Button } from "@/components/ui/button";
import type { Trailer } from "@/interfaces/Trailers";
import { cn } from "@/lib/utils";
import { Play, X } from "lucide-react";

import { useMemo, useState } from "react";
import YouTube from "react-youtube";

interface TrailerPlayerProps {
  trailers: Trailer[];
  className?: string;
}

export const TrailerPlayer = ({ trailers, className }: TrailerPlayerProps) => {
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);

  const youtubeOpts = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      playerVars: { autoplay: 1 },
    }),
    []
  );

  return (
    <>
      {/* Buttons */}

      <div
        className={cn(
          className ? className : "flex flex-wrap items-center space-x-4"
        )}
      >
        {trailers.map((trailer) => (
          <Button
            size="lg"
            key={`${trailer.id}-${trailer.name}`}
            onClick={() => setSelectedTrailer(trailer)}
          >
            <Play className="w-5 h-5 mr-2 hidden lg:flex" />
            <span className="hidden sm:flex line-clamp-1">{trailer.name}</span>
            <span className="flex sm:hidden">
              {trailer.name.length > 12
                ? `${trailer.name.substring(0, 12)}...`
                : trailer.name}
            </span>
          </Button>
        ))}
      </div>
      {/* Modal */}
      {selectedTrailer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedTrailer(null)}
        >
          <div
            className="relative w-full max-w-3xl mx-4 aspect-video bg-black rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 z-10"
              onClick={() => setSelectedTrailer(null)}
            >
              <X className="w-6 h-6 text-white" />
            </Button>
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <YouTube
                className="absolute top-0 left-0 w-full h-full"
                videoId={selectedTrailer.key}
                opts={youtubeOpts}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default TrailerPlayer;
