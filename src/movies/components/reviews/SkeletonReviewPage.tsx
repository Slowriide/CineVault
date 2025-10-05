// components/skeletons/MovieReviewsSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const MovieReviewsSkeleton = () => {
  return (
    <div className="bg-gradient-hero">
      <div className="max-w-[1600px] mx-auto py-auto pb-8 sm:py-8 px-4">
        {/* Header */}
        <Skeleton className="h-9 w-1/3 mb-2" />
        <Skeleton className="h-5 w-32 mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-3 mb-8 md:space-x-4">
          {/* Poster Skeleton */}
          <div className="col-span-1">
            <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-elegant">
              <Skeleton className="w-full aspect-[2/3]" />
            </Card>
          </div>

          {/* Reviews Skeleton */}
          <div className="col-span-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index}>
                <div className="flex items-start mt-5">
                  {/* Avatar */}
                  <Skeleton className="w-12 h-12 rounded-full mr-3 flex-shrink-0" />

                  {/* Review Content */}
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Header (Review by + name + stars) */}
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>

                    {/* Review text */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>

                    {/* Likes */}
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Separator className="mt-5" />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
};
