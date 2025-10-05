import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonGrid } from "@/movies/components/skeletons/SkeletonGrid";

export const ActorPageSkeleton = () => {
  return (
    <div className="relative min-h-full bg-gradient-hero">
      <div className="max-w-[1600px] container mx-auto px-4 py-8 space-y-8">
        {/* Actor Header */}
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* Profile Image */}
              <Skeleton className="md:col-span-1 w-full aspect-[2/3] rounded-lg shadow-elegant" />

              {/* Actor Info */}
              <div className="md:col-span-2 space-y-6 h-full">
                <Skeleton className="w-1/4 h-12 rounded" /> {/* Name */}
                <Skeleton className="w-2/6 h-10 rounded" /> {/* Top Movie */}
                <Skeleton className="w-2/4 h-10 rounded" /> {/* Worst Movie */}
                <Skeleton className="w-3/4 h-10 rounded" /> {/* Dates */}
                <Skeleton className="w-1/6 h-10 rounded" /> {/* Page */}
                <div>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div className="flex flex-col w-full mt-1" key={i}>
                      <Skeleton className="w-full h-4 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 pt-4">
          <Skeleton className="w-50  h-8 rounded" />
          <SkeletonGrid count={18} />
        </div>
      </div>
    </div>
  );
};
