"use client";

import Link from "next/link";
import Image from "next/image";
import { Package, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/use-orders";
import { WithSkeleton } from "@/components/with-skeleton";
import { OrdersListSkeleton } from "@/components/skeleton/profile-skeleton";
import type { CustomerOrder } from "@/lib/types";

function getFulfillmentColor(status: string) {
  switch (status.toLowerCase()) {
    case "not_fulfilled":
      return "bg-gray-500/10 text-gray-600";
    case "partially_fulfilled":
    case "partially_shipped":
    case "partially_delivered":
      return "bg-blue-500/10 text-blue-600";
    case "fulfilled":
    case "shipped":
    case "delivered":
      return "bg-green-500/10 text-green-600";
    case "canceled":
      return "bg-red-500/10 text-red-600";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function OrderCard({ order }: { order: CustomerOrder }) {
  const firstItem = order.items[0];
  const additionalItems = order.items.length - 1;

  return (
    <Link href={`/profile/orders/${order.id}`} className="block">
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Thumbnail */}
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
              {firstItem?.thumbnail && (
                <Image src={firstItem.thumbnail} alt={firstItem.title} fill className="object-cover" sizes="64px" />
              )}
            </div>

            {/* Details */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">Order #{order.display_id}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getFulfillmentColor(order.fulfillment_status)}>
                    {order.fulfillment_status.replace("_", " ")}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {firstItem?.title}
                  {additionalItems > 0 && ` +${additionalItems} more`}
                </span>
                <span className="font-medium">{order.total} EGP</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function OrdersList() {
  const { orders, isLoading } = useOrders();

  return (
    <WithSkeleton isLoading={isLoading} skeleton={<OrdersListSkeleton />}>
      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">When you place an order, it will appear here.</p>
            <Link href="/">
              <Button className="mt-4">Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </WithSkeleton>
  );
}
