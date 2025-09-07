import { Card } from "@/components/ui/card";
import type { PersonDetails } from "@/interfaces/Credits";
import { getImageUrl } from "@/mocks/tmdb";
import { slugify } from "@/utils/slugify";
import { Link } from "react-router";

export const ActorCard = (actor: PersonDetails) => {
  return (
    <Card
      key={actor.id}
      className="overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 transition-colors duration-300"
    >
      <Link key={actor.id} to={`/person/${slugify(actor.name, actor.id)}`}>
        <div className="aspect-[2/3] relative">
          <img
            src={getImageUrl(actor.profile_path ?? "", "w342")}
            alt={actor.name}
            className="w-full h-full object-cover"
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
};
