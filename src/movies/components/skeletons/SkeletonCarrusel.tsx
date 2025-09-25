interface Props {
  elements: number;
}

export const SkeletonCarrusel = ({ elements }: Props) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-7 w-32 bg-muted animate-pulse rounded" />
      </div>
      <div className="flex space-x-4 overflow-hidden">
        {[...Array(elements)].map((_, i) => (
          <div key={i} className="w-40 flex-shrink-0">
            <div className="aspect-[2/3] bg-muted animate-pulse rounded-lg mb-3" />
            <div className="h-4 bg-muted animate-pulse rounded mb-2" />
            <div className="h-3 w-16 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};
