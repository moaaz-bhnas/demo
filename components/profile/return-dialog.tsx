"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Loader2, Minus, Plus, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useReturnReasons, useCreateReturn } from "@/hooks/use-returns";
import { useShippingOptions } from "@/hooks/use-shipping-options";
import type { OrderItem, CustomerOrder } from "@/lib/types";

interface ReturnItem {
  itemId: string;
  quantity: number;
  reasonId: string;
  note: string;
}

interface ReturnDialogProps {
  order: CustomerOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ReturnDialog({
  order,
  open,
  onOpenChange,
  onSuccess,
}: ReturnDialogProps) {
  const { returnReasons, isLoading: isLoadingReasons } = useReturnReasons();
  const { createReturn } = useCreateReturn();
  const {
    shippingOptions,
    isLoading: isLoadingShippingOptions,
  } = useShippingOptions(open ? order.cart?.id : null);

  const [selectedItems, setSelectedItems] = useState<Map<string, ReturnItem>>(
    new Map()
  );
  const [shippingOptionId, setShippingOptionId] = useState<string>("");
  const [generalNote, setGeneralNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter items that can be returned (fulfilled items that haven't been fully returned)
  const returnableItems = useMemo(() => {
    return order.items.filter((item) => item.quantity > 0);
  }, [order.items]);

  const toggleItem = (item: OrderItem) => {
    setSelectedItems((prev) => {
      const next = new Map(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.set(item.id, {
          itemId: item.id,
          quantity: 1,
          reasonId: "",
          note: "",
        });
      }
      return next;
    });
  };

  const updateItemQuantity = (itemId: string, delta: number) => {
    setSelectedItems((prev) => {
      const next = new Map(prev);
      const current = next.get(itemId);
      if (!current) return prev;

      const orderItem = order.items.find((i) => i.id === itemId);
      if (!orderItem) return prev;

      const newQty = Math.max(
        1,
        Math.min(orderItem.quantity, current.quantity + delta)
      );
      next.set(itemId, { ...current, quantity: newQty });
      return next;
    });
  };

  const updateItemReason = (itemId: string, reasonId: string) => {
    setSelectedItems((prev) => {
      const next = new Map(prev);
      const current = next.get(itemId);
      if (!current) return prev;
      next.set(itemId, { ...current, reasonId });
      return next;
    });
  };

  const updateItemNote = (itemId: string, note: string) => {
    setSelectedItems((prev) => {
      const next = new Map(prev);
      const current = next.get(itemId);
      if (!current) return prev;
      next.set(itemId, { ...current, note });
      return next;
    });
  };

  const canSubmit = useMemo(() => {
    if (selectedItems.size === 0) return false;
    if (!shippingOptionId) return false;
    // Check all selected items have a reason
    for (const item of selectedItems.values()) {
      if (!item.reasonId) return false;
    }
    return true;
  }, [selectedItems, shippingOptionId]);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await createReturn({
        order_id: order.id,
        items: Array.from(selectedItems.values()).map((item) => ({
          id: item.itemId,
          quantity: item.quantity,
          reason_id: item.reasonId || undefined,
          note: item.note || undefined,
        })),
        return_shipping: {
          option_id: shippingOptionId,
        },
        note: generalNote || undefined,
      });

      // Reset form and close dialog
      setSelectedItems(new Map());
      setShippingOptionId("");
      setGeneralNote("");
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      console.error("Failed to create return:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create return. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedItems(new Map());
      setShippingOptionId("");
      setGeneralNote("");
      setError(null);
      onOpenChange(false);
    }
  };

  const isLoading = isLoadingReasons || isLoadingShippingOptions;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Request Return
          </DialogTitle>
          <DialogDescription>
            Select the items you want to return from order #{order.display_id}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Items Selection */}
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Select Items to Return
              </Label>
              <div className="space-y-4">
                {returnableItems.map((item) => {
                  const selected = selectedItems.get(item.id);
                  const isSelected = !!selected;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-md border p-4 transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-input"
                      }`}
                    >
                      <div className="flex gap-4">
                        {/* Checkbox */}
                        <div className="flex items-start pt-1">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleItem(item)}
                          />
                        </div>

                        {/* Thumbnail */}
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

                        {/* Item Details */}
                        <div className="flex-1 space-y-2">
                          <div>
                            <p className="font-medium">{item.product_title}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.title} • Max: {item.quantity}
                            </p>
                          </div>

                          {isSelected && (
                            <div className="space-y-3">
                              {/* Quantity */}
                              <div className="flex items-center gap-2">
                                <Label className="text-sm">Quantity:</Label>
                                <div className="flex items-center gap-1">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() =>
                                      updateItemQuantity(item.id, -1)
                                    }
                                    disabled={selected.quantity <= 1}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center text-sm">
                                    {selected.quantity}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() =>
                                      updateItemQuantity(item.id, 1)
                                    }
                                    disabled={
                                      selected.quantity >= item.quantity
                                    }
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>

                              {/* Reason */}
                              <div className="space-y-1">
                                <Label className="text-sm">
                                  Reason{" "}
                                  <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                  value={selected.reasonId}
                                  onValueChange={(v) =>
                                    updateItemReason(item.id, v)
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a reason" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {returnReasons.map((reason) => (
                                      <SelectItem
                                        key={reason.id}
                                        value={reason.id}
                                      >
                                        {reason.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Note */}
                              <div className="space-y-1">
                                <Label className="text-sm">
                                  Note (optional)
                                </Label>
                                <Input
                                  placeholder="Additional details..."
                                  value={selected.note}
                                  onChange={(e) =>
                                    updateItemNote(item.id, e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Shipping Option */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Return Shipping <span className="text-destructive">*</span>
              </Label>
              {!order.cart?.id ? (
                <p className="text-sm text-muted-foreground">
                  Unable to load shipping options. Cart information is missing.
                </p>
              ) : shippingOptions.length === 0 && !isLoadingShippingOptions ? (
                <p className="text-sm text-muted-foreground">
                  No shipping methods available for returns.
                </p>
              ) : (
                <Select
                  value={shippingOptionId}
                  onValueChange={setShippingOptionId}
                  disabled={isLoadingShippingOptions}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isLoadingShippingOptions
                          ? "Loading shipping options..."
                          : "Select shipping method"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {shippingOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name} - {option.amount}{" "}
                        {option.calculated_price.currency_code.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* General Note */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                General Note (optional)
              </Label>
              <Input
                placeholder="Any additional information about this return..."
                value={generalNote}
                onChange={(e) => setGeneralNote(e.target.value)}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Return Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
