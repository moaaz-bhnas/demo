import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 py-4">
      <Skeleton className="h-24 w-24 rounded-md" />
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Skeleton className="mb-2 h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Skeleton className="mb-4 h-8 w-32" />
        <CartItemSkeleton />
        <Separator />
        <CartItemSkeleton />
        <Separator />
        <CartItemSkeleton />
      </div>
      <div>
        <Skeleton className="h-64 w-full rounded-md" />
      </div>
    </div>
  );
}

