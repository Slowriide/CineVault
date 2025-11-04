import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

/**
 * Fallback hero section for the homepage or when no featured content is available.
 * Displays a background image, heading, description, and a call-to-action button.
 */

export const FallbackHero = () => {
  return (
    <div
      className="relative h-[70vh] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(https://www.pexels.com/search/wide/)` }}
    >
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 mx-auto bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      {/* Text and CTA button */}
      <div className="relative z-10 mx-auto text-center max-w-2xl px-6">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-accent bg-clip-text text-transparent">
          Discover Cinema
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Explore thousands of movies and TV shows. Rate, review, and build your
          personal collection.
        </p>

        {/* CTA button to start exploring */}
        <Button
          size="lg"
          className="bg-primary hover:bg-primary-glow text-primary-foreground"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Exploring
        </Button>
      </div>
    </div>
  );
};
