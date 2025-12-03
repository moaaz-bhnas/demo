import { Skeleton } from "@/components/ui/skeleton";

export function CarouselSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="aspect-[21/9] w-full rounded-md" />
    </div>
  );
}

export function TagsCarouselSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-shrink-0">
          <Skeleton className="h-24 w-24 rounded-md" />
          <Skeleton className="mt-2 h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

