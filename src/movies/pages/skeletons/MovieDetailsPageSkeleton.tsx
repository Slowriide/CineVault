import { Skeleton } from "@/components/ui/skeleton";

export const MovieDetailsPageSkeleton = () => {
  return (
    <div className="relative min-h-full bg-gradient-hero">
      {/* Backdrop */}
      <div className="absolute top-0 left-0 right-0 h-[60vh] bg-card" />
      {/* Content */}
      <div className="relative z-10 max-w-[1600px] mx-auto container py-20 space-y-12 px-4">
        {/* Movie Header */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Poster */}
          <div className="md:col-span-1 ">
            <Skeleton className="md:col-span-1 w-full aspect-[2/3] rounded-lg shadow-elegant" />
            <div className="grid grid-cols-2  gap-4 mt-4">
              <Skeleton className="w-full h-10 rounded" /> {/* Button */}
              <Skeleton className="w-full h-10 rounded" /> {/* Button */}
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="w-3/4 h-10 rounded" /> {/* Title */}
            <Skeleton className="w-2/4 h-6 rounded" /> {/* Data */}
            <Skeleton className="w-1/4 h-6 rounded" /> {/* Rating */}
            <Skeleton className="w-full h-20 rounded" /> {/* Description */}
            <div className="flex gap-4">
              <Skeleton className="w-32 h-10 rounded" /> {/* Button */}
              <Skeleton className="w-32 h-10 rounded" /> {/* Button */}
              <Skeleton className="w-32 h-10 rounded" /> {/* Button */}
            </div>
            {/* Reviews */}
            <div className="flex flex-col gap-4 pt-4 lg:pt-10">
              <Skeleton className="w-32 h-4 rounded" />
              <Skeleton className="w-full h-32 rounded" />
              <Skeleton className="w-full h-32 rounded" />
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="space-y-4">
          <Skeleton className="w-30 h-8 rounded" />
          <Skeleton className="w-8 h-8 rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
