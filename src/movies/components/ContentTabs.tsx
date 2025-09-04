import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Type } from "@/interfaces/MovieCategory";
import { getImageUrl } from "@/mocks/tmdb";
import { Link } from "react-router";
import { SectionCarrusel } from "./SectionCarrusel";
import type { Credits } from "@/interfaces/Credits";
import type { PaginatedResponse } from "../api/get-similar.action";

interface ContentTabsProps {
  credits?: Credits;
  similarMovies?: PaginatedResponse;
  isErrorCredits?: Error | null;
  isLoadingSimilar?: boolean;
  isErrorSimilar?: Error | null;
  type: Type;
}

export const ContentTabs: React.FC<ContentTabsProps> = ({
  credits,
  similarMovies,
  isErrorCredits,
  isLoadingSimilar,
  isErrorSimilar,
  type,
}) => {
  return (
    <Tabs defaultValue="cast" className="space-y-6">
      <TabsList className="bg-muted/50">
        <TabsTrigger value="cast">Cast</TabsTrigger>
        <TabsTrigger value="similar">Similar Movies</TabsTrigger>
      </TabsList>

      <TabsContent value="cast" className="space-y-4">
        <h2 className="text-xl font-semibold">Cast</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {isErrorCredits ? (
            <p className="text-red-500">Error loading movies</p>
          ) : (
            credits?.cast.map((actor) => (
              <Card
                key={actor.id}
                className="overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 transition-colors duration-300"
              >
                <Link key={actor.id} to={`/person/${actor.id}`}>
                  <div className="aspect-[2/3] relative">
                    <img
                      src={
                        getImageUrl(actor.profile_path ?? "", "w342") ??
                        "/placeholder.svg"
                      }
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-foreground line-clamp-1">
                      {actor.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {actor.character}
                    </p>
                  </div>
                </Link>
              </Card>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="similar">
        <SectionCarrusel
          title={"Similar Movies"}
          items={similarMovies?.results ?? []}
          loading={isLoadingSimilar}
          mediaType={(type ?? "movie") as Type}
          error={isErrorSimilar}
        />
      </TabsContent>
    </Tabs>
  );
};
