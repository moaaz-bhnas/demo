"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import type { Cart } from "@/lib/types";

interface CartSummaryProps {
  cart: Cart;
  onCheckout?: () => void;
}

export function CartSummary({ cart, onCheckout }: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { applyPromoCode } = useCart();

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    setIsApplying(true);
    setError(null);
    try {
      await applyPromoCode(promoCode.trim());
      setPromoCode("");
    } catch (err) {
      setError("Invalid promo code");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="rounded-md border p-6">
      <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

      {/* Promo Code */}
      <form onSubmit={handleApplyPromo} className="mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="Promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <Button type="submit" variant="outline" disabled={isApplying}>
            {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
          </Button>
        </div>
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      </form>

      {/* Applied Promotions */}
      {cart.promotions.length > 0 && (
        <div className="mb-4">
          {cart.promotions.map((promo) => (
            <div
              key={promo.id}
              className="flex items-center justify-between text-sm text-green-600"
            >
              <span>Promo: {promo.code}</span>
              <span>
                -{promo.application_method.type === "percentage"
                  ? `${promo.application_method.value}%`
                  : `${promo.application_method.value} EGP`}
              </span>
            </div>
          ))}
        </div>
      )}

      <Separator className="my-4" />

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{cart.subtotal} EGP</span>
        </div>

        {cart.discount_total && cart.discount_total > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-{cart.discount_total} EGP</span>
          </div>
        )}

        {cart.shipping_total !== undefined && cart.shipping_total > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>{cart.shipping_total} EGP</span>
          </div>
        )}

        <Separator className="my-2" />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{cart.total} EGP</span>
        </div>
      </div>

      {/* Checkout Button */}
      {onCheckout && (
        <Button className="mt-6 w-full" size="lg" onClick={onCheckout}>
          Proceed to Checkout
        </Button>
      )}
    </div>
  );
}

