"use client";

import { WishlistGrid } from "@/components/profile/wishlist-grid";

export default function WishlistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Wishlist</h1>
        <p className="text-muted-foreground">
          Items you&apos;ve saved for later
        </p>
      </div>

      <WishlistGrid />
    </div>
  );
}

