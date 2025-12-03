"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import type { ProductVariant } from "@/lib/types";

interface AddToCartButtonProps {
  variant: ProductVariant | null;
}

export function AddToCartButton({ variant }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    if (!variant) return;

    setIsLoading(true);
    try {
      await addItem(variant.id, quantity);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isOutOfStock =
    variant?.manage_inventory &&
    !variant.allow_backorder &&
    (variant.inventory_quantity ?? 0) <= 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Quantity:</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
            disabled={
              variant?.manage_inventory
                ? quantity >= (variant.inventory_quantity ?? 0)
                : false
            }
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        size="lg"
        className="w-full gap-2"
        onClick={handleAddToCart}
        disabled={!variant || isOutOfStock || isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ShoppingCart className="h-5 w-5" />
        )}
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </Button>

      {/* Stock Info */}
      {variant?.manage_inventory && variant.inventory_quantity !== undefined && (
        <p className="text-sm text-muted-foreground">
          {variant.inventory_quantity > 0
            ? `${variant.inventory_quantity} in stock`
            : "Out of stock"}
        </p>
      )}
    </div>
  );
}

