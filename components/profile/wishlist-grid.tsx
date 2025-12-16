"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { WithSkeleton } from "@/components/with-skeleton";
import { WishlistSkeleton } from "@/components/skeleton/profile-skeleton";
import type { WishlistItem } from "@/lib/types";

function WishlistItemCard({ item }: { item: WishlistItem }) {
  const { removeItem } = useWishlist();
  const { addItem } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const variant = item.product_variant;
  const price = variant.prices?.[0]?.amount ?? 0;
  const thumbnail =
    variant.metadata?.thumbnail ||
    variant.product?.thumbnail ||
    null;
  const productTitle = variant.product?.title || variant.title;
  const productId = variant.product_id;

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeItem(item.id);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addItem(variant.id);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <Link href={`/product/${productId}`}>
        <div className="relative aspect-square bg-muted">
          {thumbnail && (
            <Image
              src={thumbnail}
              alt={productTitle}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${productId}`}>
          <h3 className="line-clamp-2 font-medium hover:underline">
            {productTitle}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">{variant.title}</p>
        <p className="mt-2 font-semibold">{price} EGP</p>
        <div className="mt-4 flex gap-2">
          <Button
            className="flex-1 gap-2"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 text-destructive" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function WishlistGrid() {
  const { items, isLoading } = useWishlist();

  return (
    <WithSkeleton isLoading={isLoading} skeleton={<WishlistSkeleton />}>
      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Your wishlist is empty</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Save items you love to your wishlist.
            </p>
            <Link href="/">
              <Button className="mt-4">Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <WishlistItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </WithSkeleton>
  );
}

