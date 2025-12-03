"use client";

import { use } from "react";
import Image from "next/image";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Container } from "@/components/container";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductGridSkeleton } from "@/components/skeleton/product-card-skeleton";
import { WithSkeleton } from "@/components/with-skeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCategories, useCategory } from "@/hooks/use-categories";
import { useProducts } from "@/hooks/use-products";
import Link from "next/link";

interface CategoryPageProps {
  params: Promise<{ handle: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { handle } = use(params);
  const { categories } = useCategories();
  
  // Find category by handle
  const categoryFromList = categories.find((c) => c.handle === handle);
  const { category, isLoading: categoryLoading } = useCategory(categoryFromList?.id ?? "");
  
  const { products, isLoading: productsLoading } = useProducts({
    categoryId: categoryFromList?.id,
  });

  const sliderImages = category?.metadata?.category_slider_images ?? [];
  const subcategories = category?.category_children ?? [];

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <Container>
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {category?.parent_category && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/category/${category.parent_category.handle}`}>
                  {category.parent_category.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <span className="text-muted-foreground">{category?.name ?? handle}</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">{category?.name}</h1>
        {category?.description && (
          <p className="mt-2 text-muted-foreground">{category.description}</p>
        )}
      </div>

      {/* Category Slider */}
      {sliderImages.length > 0 && (
        <div className="mb-8">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {sliderImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-[21/9] w-full overflow-hidden rounded-md">
                    <Image
                      src={image.url}
                      alt={`Category slide ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {sliderImages.length > 1 && (
              <>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </>
            )}
          </Carousel>
        </div>
      )}

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Subcategories</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/category/${sub.handle}`}
                className="group flex flex-col items-center gap-2"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                  {sub.metadata?.thumbnail && (
                    <Image
                      src={sub.metadata.thumbnail}
                      alt={sub.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                  )}
                </div>
                <span className="text-center text-sm">{sub.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Products {products.length > 0 && `(${products.length})`}
          </h2>
        </div>

        <WithSkeleton
          isLoading={categoryLoading || productsLoading}
          skeleton={<ProductGridSkeleton count={12} />}
        >
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No products found in this category</p>
            </div>
          )}
        </WithSkeleton>
      </div>
    </Container>
  );
}

