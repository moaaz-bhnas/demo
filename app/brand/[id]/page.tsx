"use client";

import { use } from "react";
import Image from "next/image";
import { Container } from "@/components/container";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductGridSkeleton } from "@/components/skeleton/product-card-skeleton";
import { WithSkeleton } from "@/components/with-skeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useBrand } from "@/hooks/use-brands";

interface BrandPageProps {
  params: Promise<{ id: string }>;
}

export default function BrandPage({ params }: BrandPageProps) {
  const { id } = use(params);
  const { brand, isLoading } = useBrand(id);

  return (
    <Container>
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="text-muted-foreground">{brand?.name ?? "Brand"}</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <WithSkeleton
        isLoading={isLoading}
        skeleton={
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-md bg-muted" />
              <div className="space-y-2">
                <div className="h-8 w-48 rounded bg-muted" />
                <div className="h-4 w-64 rounded bg-muted" />
              </div>
            </div>
            <ProductGridSkeleton count={8} />
          </div>
        }
      >
        {brand && (
          <>
            {/* Brand Header */}
            <div className="mb-8 flex items-center gap-6">
              {brand.image && (
                <div className="relative h-24 w-24 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">{brand.name}</h1>
                {brand.description && (
                  <p className="mt-2 text-muted-foreground">
                    {brand.description}
                  </p>
                )}
              </div>
            </div>

            {/* Products */}
            <div>
              <h2 className="mb-6 text-lg font-semibold">
                Products {brand.products && `(${brand.products.length})`}
              </h2>

              {brand.products && brand.products.length > 0 ? (
                <ProductGrid products={brand.products} />
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No products found for this brand
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </WithSkeleton>
    </Container>
  );
}

