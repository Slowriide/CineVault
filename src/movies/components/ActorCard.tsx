import { Card } from "@/components/ui/card";
import type { PersonDetails } from "@/interfaces/Credits";
import { getImageUrl } from "@/utils/tmdb";
import { slugify } from "@/utils/slugify";
import { memo, useMemo } from "react";
import { Link } from "react-router";

/**
 * Component Purpose:
 * Displays an individual actor's card including profile image, name,
 * and optional character information. Clicking the card navigates to
 * the actor's detail page.
 */
export const ActorCard = memo((actor: PersonDetails) => {
  // Generate a URL-friendly slug for the actor to use in links
  const actorSlug = useMemo(
    () => slugify(actor.name, actor.id),
    [actor.name, actor.id]
  );

  // Generate the full image URL with the desired size
  const imageUrl = useMemo(
    () => getImageUrl(actor.profile_path ?? "", "w342"),
    [actor.profile_path]
  );

  return (
    <Card
      key={actor.id} // unique key for rendering
      className="overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 transition-colors duration-300"
    >
      {/* Link to actor's detail page */}
      <Link to={`/person/${actorSlug}`}>
        {/* Actor Image */}
        <div className="aspect-[2/3] relative">
          <img
            src={imageUrl}
            alt={actor.name}
            className="w-full h-full object-cover"
            loading="lazy" // lazy loading for performance
          />
        </div>

        {/* Actor Info */}
        <div className="p-3">
          {/* Actor name */}
          <h3 className="font-medium text-sm text-foreground line-clamp-1">
            {actor.name}
          </h3>
          {/* Character name (optional) */}
          {actor.character && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {actor.character}
            </p>
          )}
        </div>
      </Link>
    </Card>
  );
});
