import { Card } from "@/components/ui/card";
import type { PersonDetails } from "@/interfaces/Credits";
import { getImageUrl } from "@/mocks/tmdb";
import { slugify } from "@/utils/slugify";
import { memo, useMemo } from "react";
import { Link } from "react-router";

export const ActorCard = memo((actor: PersonDetails) => {
  const actorSlug = useMemo(
    () => slugify(actor.name, actor.id),
    [actor.name, actor.id]
  );
  const imageUrl = useMemo(
    () => getImageUrl(actor.profile_path ?? "", "w342"),
    [actor.profile_path]
  );
  return (
    <Card
      key={actor.id}
      className="overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 transition-colors duration-300"
    >
      <Link key={actor.id} to={`/person/${actorSlug}`}>
        <div className="aspect-[2/3] relative">
          <img
            src={imageUrl}
            alt={actor.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm text-foreground line-clamp-1">
            {actor.name}
          </h3>
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
