import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonMyReview = ({ count = 4 }) => {
  return (
    <div className="flex flex-col items-center justify-items-center overflow-hidden gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div className="flex flex-col w-full">
          <div key={i} className="w-full flex gap-x-4">
            <Skeleton className="w-28 h-40 rounded-md" />

            <div className="flex flex-col items-start overflow-hidden gap-2 w-full mt-2">
              {/* Header (Review by + name + stars) */}
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <Separator className="mt-6" />
        </div>
      ))}
    </div>
  );
};
