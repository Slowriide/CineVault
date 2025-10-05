import { Skeleton } from "@/components/ui/skeleton";

export const HeroSkeleton = () => {
  return (
    <div className="relative h-[70vh] flex items-center bg-black/70 -mt-16">
      <div className="absolute mx-auto inset-0 bg-card " />

      <div className="relative z-10 max-w-[1600px] mx-auto container py-20 px-4">
        <div className="max-w-2xl space-y-6">
          {/* Poster + info */}
          <div className="flex items-start space-x-6">
            {/* Poster */}
            <Skeleton className="w-24 h-36 rounded-lg shadow-elegant" />

            <div className="space-y-4 flex-1">
              {/* Badge + rating */}
              <div className="flex items-center space-x-3">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-5 w-10 rounded-md" />
              </div>

              {/* Title */}
              <Skeleton className="h-10 w-3/4 rounded-md" />

              {/* Year + media type */}
              <div className="flex items-center space-x-4">
                <Skeleton className="h-5 w-12 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-md" />
              </div>

              {/* Overview */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-full rounded-md" />
                <Skeleton className="h-5 w-5/6 rounded-md" />
                <Skeleton className="h-5 w-4/6 rounded-md" />
              </div>

              {/* Buttons */}
              <div className="flex items-center space-x-4 pt-4">
                <Skeleton className="h-10 w-32 rounded-md" />
                <Skeleton className="h-10 w-32 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
