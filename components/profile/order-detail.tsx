"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOrder, useOrders } from "@/hooks/use-orders";
import { WithSkeleton } from "@/components/with-skeleton";
import { OrderDetailSkeleton } from "@/components/skeleton/profile-skeleton";
import { ReturnDialog } from "./return-dialog";

interface OrderDetailProps {
  orderId: string;
}

export function OrderDetail({ orderId }: OrderDetailProps) {
  const { order, isLoading, mutate } = useOrder(orderId);
  const { cancelOrder } = useOrders();
  const [isCanceling, setIsCanceling] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setIsCanceling(true);
    try {
      await cancelOrder(orderId);
    } catch (error) {
      console.error("Failed to cancel order:", error);
    } finally {
      setIsCanceling(false);
    }
  };

  const canCancel =
    order?.fulfillment_status === "not_fulfilled" &&
    order?.status !== "canceled";

  const canReturn =
    order?.fulfillment_status === "delivered" &&
    order?.status !== "canceled" &&
    order?.items?.length > 0;

  return (
    <WithSkeleton isLoading={isLoading} skeleton={<OrderDetailSkeleton />}>
      {order && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/profile/orders">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">
                  Order #{order.display_id}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Placed on{" "}
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {canReturn && (
                <Button
                  variant="outline"
                  onClick={() => setIsReturnDialogOpen(true)}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Request Return
                </Button>
              )}
              {canCancel && (
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={isCanceling}
                >
                  {isCanceling && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Cancel Order
                </Button>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex gap-2">
            <Badge variant="outline">{order.status}</Badge>
            <Badge variant="outline">{order.payment_status}</Badge>
            <Badge variant="outline">
              {order.fulfillment_status.replace("_", " ")}
            </Badge>
          </div>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    {item.thumbnail && (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 justify-between">
                    <div>
                      <p className="font-medium">{item.product_title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.title} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.total} EGP</p>
                      {item.discount_total > 0 && (
                        <p className="text-sm text-green-600">
                          -{item.discount_total} EGP
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{order.subtotal} EGP</span>
              </div>
              {order.discount_total && order.discount_total > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{order.discount_total} EGP</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{order.shipping_total} EGP</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{order.total} EGP</span>
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <div className="grid gap-6 md:grid-cols-2">
            {order.shipping_address && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="font-medium">
                    {order.shipping_address.first_name}{" "}
                    {order.shipping_address.last_name}
                  </p>
                  <p>{order.shipping_address.address_1}</p>
                  {order.shipping_address.address_2 && (
                    <p>{order.shipping_address.address_2}</p>
                  )}
                  <p>
                    {order.shipping_address.city},{" "}
                    {order.shipping_address.country_code?.toUpperCase()}
                  </p>
                  {order.shipping_address.phone && (
                    <p className="mt-2">{order.shipping_address.phone}</p>
                  )}
                </CardContent>
              </Card>
            )}
            {order.billing_address && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="font-medium">
                    {order.billing_address.first_name}{" "}
                    {order.billing_address.last_name}
                  </p>
                  <p>{order.billing_address.address_1}</p>
                  {order.billing_address.address_2 && (
                    <p>{order.billing_address.address_2}</p>
                  )}
                  <p>
                    {order.billing_address.city},{" "}
                    {order.billing_address.country_code?.toUpperCase()}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Return Dialog */}
          {order && (
            <ReturnDialog
              order={order}
              open={isReturnDialogOpen}
              onOpenChange={setIsReturnDialogOpen}
              onSuccess={() => mutate()}
            />
          )}
        </div>
      )}
    </WithSkeleton>
  );
}
