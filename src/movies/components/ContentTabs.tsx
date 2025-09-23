import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Type } from "@/interfaces/MovieCategory";
import { SectionCarrusel } from "./SectionCarrusel";
import type { Credits } from "@/interfaces/Credits";
import type { PaginatedResponse } from "../api/get-similar.action";
import { ActorCard } from "./ActorCard";

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
              <ActorCard key={actor.id} {...actor} />
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
