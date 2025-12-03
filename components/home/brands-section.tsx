"use client";

import Image from "next/image";
import Link from "next/link";
import { useBrands } from "@/hooks/use-brands";
import { Skeleton } from "@/components/ui/skeleton";
import { WithSkeleton } from "@/components/with-skeleton";

function BrandsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square w-full rounded-md" />
      ))}
    </div>
  );
}

export function BrandsSection() {
  const { brands, isLoading } = useBrands();

  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold sm:text-2xl">Shop by Brand</h2>

      <WithSkeleton isLoading={isLoading} skeleton={<BrandsSkeleton />}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brand/${brand.id}`}
              className="group flex flex-col items-center gap-2"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                {brand.image && (
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                )}
              </div>
              <span className="text-center text-sm font-medium">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </WithSkeleton>
    </section>
  );
}

