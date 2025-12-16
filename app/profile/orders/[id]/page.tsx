"use client";

import { use } from "react";
import { OrderDetail } from "@/components/profile/order-detail";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  
  return <OrderDetail orderId={id} />;
}

