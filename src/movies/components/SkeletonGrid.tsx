export const SkeletonGrid = ({ count = 20 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="aspect-[2/3] bg-muted animate-pulse rounded-lg" />
    ))}
  </div>
);
