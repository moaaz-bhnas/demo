"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Container } from "@/components/container";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { CartSkeleton } from "@/components/skeleton/cart-skeleton";
import { WithSkeleton } from "@/components/with-skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
  const router = useRouter();
  const { cart, isLoading, itemCount } = useCart();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <Container>
      <h1 className="mb-8 text-2xl font-bold sm:text-3xl">Shopping Cart</h1>

      <WithSkeleton isLoading={isLoading} skeleton={<CartSkeleton />}>
        {!cart || itemCount === 0 ? (
          <div className="py-12 text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-medium">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">
              Add some products to your cart to continue shopping
            </p>
            <Link href="/">
              <Button className="mt-6">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="rounded-md border p-4">
                <h2 className="mb-4 font-semibold">
                  Cart Items ({itemCount})
                </h2>
                <div className="divide-y">
                  {cart.items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <CartSummary cart={cart} onCheckout={handleCheckout} />
            </div>
          </div>
        )}
      </WithSkeleton>
    </Container>
  );
}

