"use client";

import { use, useState, useEffect, useMemo } from "react";
import { Heart, Star } from "lucide-react";
import { Container } from "@/components/container";
import { ProductGallery } from "@/components/product/product-gallery";
import { VariantSelector } from "@/components/product/variant-selector";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductReviews } from "@/components/product/product-reviews";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductDetailSkeleton } from "@/components/skeleton/product-detail-skeleton";
import { WithSkeleton } from "@/components/with-skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useProduct, useBoughtTogether } from "@/hooks/use-product";
import { useWishlist } from "@/hooks/use-wishlist";
import type { ProductVariant } from "@/lib/types";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const { product, isLoading } = useProduct(id);
  const { products: boughtTogether } = useBoughtTogether(product?.id ?? "");

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const { isInWishlist, addItem, getWishlistItemId, removeItem } = useWishlist();

  // Set default variant when product loads
  useEffect(() => {
    if (product?.variants?.length && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);

  // Get images for the current variant
  const images = useMemo(() => {
    if (!selectedVariant?.metadata?.thumbnail && !selectedVariant?.metadata?.images) {
      // Fallback to product images
      return product?.images?.map((img) => ({ url: img.url })) ?? [];
    }

    const variantImages: { url: string }[] = [];

    if (selectedVariant.metadata?.thumbnail) {
      variantImages.push({ url: selectedVariant.metadata.thumbnail });
    }

    if (selectedVariant.metadata?.images) {
      variantImages.push(...selectedVariant.metadata.images);
    }

    return variantImages.length > 0
      ? variantImages
      : product?.images?.map((img) => ({ url: img.url })) ?? [];
  }, [selectedVariant, product?.images]);

  // Calculate price info
  const price = selectedVariant?.calculated_price;
  const isSale = price?.calculated_price?.price_list_type === "sale";
  const currentPrice = price?.calculated_amount ?? 0;
  const originalPrice = price?.original_amount ?? 0;
  const discount = isSale
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (!product?.reviews?.length) return 0;
    return (
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length
    );
  }, [product?.reviews]);

  const category = product?.categories?.[0];

  const inWishlist = selectedVariant ? isInWishlist(selectedVariant.id) : false;

  const handleToggleWishlist = async () => {
    if (!selectedVariant) return;

    try {
      if (inWishlist) {
        const itemId = getWishlistItemId(selectedVariant.id);
        if (itemId) {
          await removeItem(itemId);
        }
      } else {
        await addItem(selectedVariant.id);
      }
    } catch {
      // Ignore errors (e.g. unauthenticated); UI elsewhere handles auth flows
    }
  };

  return (
    <>
      <Container>
        <WithSkeleton isLoading={isLoading} skeleton={<ProductDetailSkeleton />}>
          {product && (
            <>
              {/* Breadcrumb */}
              <Breadcrumb className="mb-6">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  {category && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href={`/category/${category.handle}`}>
                          {category.name}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
                  )}
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <span className="text-muted-foreground">{product.title}</span>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Product Layout */}
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Gallery */}
                <ProductGallery images={images} title={product.title} />

                {/* Product Info */}
                <div className="space-y-6">
                  {/* Title & Rating */}
                  <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">
                      {product.title}
                    </h1>
                    {product.subtitle && (
                      <p className="mt-1 text-muted-foreground">
                        {product.subtitle}
                      </p>
                    )}

                    {averageRating > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {averageRating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-muted-foreground">
                          ({product.reviews?.length} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold">
                      {currentPrice} {price?.currency_code?.toUpperCase()}
                    </span>
                    {isSale && (
                      <>
                        <span className="text-xl text-muted-foreground line-through">
                          {originalPrice}
                        </span>
                        <Badge className="bg-red-500 hover:bg-red-600">
                          -{discount}%
                        </Badge>
                      </>
                    )}
                  </div>

                  {/* Brand */}
                  {product.brand && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Brand:</span>
                      <span className="font-medium">{product.brand.name}</span>
                    </div>
                  )}

                  <Separator />

                  {/* Variant Selector */}
                  <VariantSelector
                    options={product.options}
                    variants={product.variants}
                    selectedVariant={selectedVariant}
                    onVariantChange={setSelectedVariant}
                  />

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <AddToCartButton variant={selectedVariant} />
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleWishlist}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          inWishlist
                            ? "fill-red-500 text-red-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  </div>

                  {/* SKU */}
                  {selectedVariant?.sku && (
                    <p className="text-sm text-muted-foreground">
                      SKU: {selectedVariant.sku}
                    </p>
                  )}
                </div>
              </div>

              {/* Product Details Tabs */}
              <Tabs defaultValue="description" className="mt-12">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  {product.metadata?.how_to_use && (
                    <TabsTrigger value="how-to-use">How to Use</TabsTrigger>
                  )}
                  <TabsTrigger value="reviews">
                    Reviews ({product.reviews?.length ?? 0})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6">
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line">{product.description}</p>
                  </div>
                </TabsContent>

                {product.metadata?.how_to_use && (
                  <TabsContent value="how-to-use" className="mt-6">
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line">
                        {product.metadata.how_to_use}
                      </p>
                    </div>
                  </TabsContent>
                )}

                <TabsContent value="reviews" className="mt-6">
                  <ProductReviews reviews={product.reviews ?? []} />
                </TabsContent>
              </Tabs>
            </>
          )}
        </WithSkeleton>
      </Container>

      {/* Bought Together */}
      {boughtTogether.length > 0 && (
        <Container>
          <h2 className="mb-6 text-xl font-semibold">Frequently Bought Together</h2>
          <ProductGrid products={boughtTogether.slice(0, 4)} />
        </Container>
      )}
    </>
  );
}

