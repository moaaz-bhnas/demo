"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <div className="mx-auto max-w-2xl py-12 text-center">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />

      <h1 className="mt-6 text-3xl font-bold">Order Confirmed!</h1>
      <p className="mt-4 text-muted-foreground">
        Thank you for your order. We&apos;ve received your order and will begin processing it soon.
      </p>

      {orderId && (
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4">
              <Package className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono font-medium">{orderId}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold">What happens next?</h2>
        <div className="mt-4 space-y-4 text-left">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              1
            </div>
            <div>
              <p className="font-medium">Order Processing</p>
              <p className="text-sm text-muted-foreground">We&apos;re preparing your order for shipment</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              2
            </div>
            <div>
              <p className="font-medium">Shipping</p>
              <p className="text-sm text-muted-foreground">
                Your order will be shipped and you&apos;ll receive tracking info
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              3
            </div>
            <div>
              <p className="font-medium">Delivery</p>
              <p className="text-sm text-muted-foreground">Receive your order at your doorstep</p>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link href="/">
          <Button className="gap-2">
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function OrderConfirmationFallback() {
  return (
    <div className="mx-auto max-w-2xl py-12 text-center">
      <Skeleton className="mx-auto h-16 w-16 rounded-full" />
      <Skeleton className="mx-auto mt-6 h-8 w-64" />
      <Skeleton className="mx-auto mt-4 h-4 w-96" />
      <Skeleton className="mx-auto mt-8 h-24 w-full" />
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Container>
      <Suspense fallback={<OrderConfirmationFallback />}>
        <OrderConfirmationContent />
      </Suspense>
    </Container>
  );
}
