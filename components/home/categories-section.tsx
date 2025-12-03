"use client";

import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/hooks/use-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { WithSkeleton } from "@/components/with-skeleton";

function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/3] w-full rounded-md" />
      ))}
    </div>
  );
}

export function CategoriesSection() {
  const { categories, isLoading } = useCategories();

  const topCategories = categories.filter((c) => !c.parent_category_id);

  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold sm:text-2xl">
        Shop by Category
      </h2>

      <WithSkeleton isLoading={isLoading} skeleton={<CategoriesSkeleton />}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {topCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.handle}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-md bg-muted"
            >
              {category.metadata?.thumbnail && (
                <Image
                  src={category.metadata.thumbnail}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="text-lg font-semibold text-white">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </WithSkeleton>
    </section>
  );
}

