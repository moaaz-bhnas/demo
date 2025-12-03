"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const variant = product.variants?.[0];
  const price = variant?.calculated_price;
  const isSale = price?.calculated_price?.price_list_type === "sale";
  const currentPrice = price?.calculated_amount ?? 0;
  const originalPrice = price?.original_amount ?? 0;

  const averageRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.reviews.length
      : 0;

  const discount = isSale
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.thumbnail && (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
          {isSale && discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              -{discount}%
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="mb-2 line-clamp-2 text-sm font-medium">
            {product.title}
          </h3>

          {averageRating > 0 && (
            <div className="mb-2 flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews?.length})
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-base font-semibold">
              {currentPrice} {price?.currency_code?.toUpperCase()}
            </span>
            {isSale && (
              <span className="text-sm text-muted-foreground line-through">
                {originalPrice}
              </span>
            )}
          </div>

          {product.sales && product.sales.sales > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              {product.sales.sales} sold
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

