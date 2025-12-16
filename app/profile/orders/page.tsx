"use client";

import { OrdersList } from "@/components/profile/orders-list";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">
          View and track your order history
        </p>
      </div>

      <OrdersList />
    </div>
  );
}

