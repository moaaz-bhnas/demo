"use client";

import { Truck } from "lucide-react";
import { useFreeShipping } from "@/hooks/use-free-shipping";

export function FreeShippingBar() {
  const { threshold, isLoading } = useFreeShipping();

  if (isLoading || threshold === null) {
    return null;
  }

  return (
    <div className="bg-primary py-2 text-center text-sm text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4">
        <Truck className="h-4 w-4" />
        <span>
          Free shipping on orders over {threshold} EGP
        </span>
      </div>
    </div>
  );
}

