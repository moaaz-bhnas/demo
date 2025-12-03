"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductGridSkeleton } from "@/components/skeleton/product-card-skeleton";
import { WithSkeleton } from "@/components/with-skeleton";
import { useProducts } from "@/hooks/use-products";

interface ProductSectionProps {
  title: string;
  tagId?: string;
  categoryId?: string;
  viewAllLink?: string;
  limit?: number;
}

export function ProductSection({
  title,
  tagId,
  categoryId,
  viewAllLink,
  limit = 8,
}: ProductSectionProps) {
  const { products, isLoading } = useProducts({ tagId, categoryId, limit });

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink}>
            <Button variant="ghost" className="gap-1">
              View All
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      <WithSkeleton isLoading={isLoading} skeleton={<ProductGridSkeleton count={limit} />}>
        <ProductGrid products={products} />
      </WithSkeleton>
    </section>
  );
}

