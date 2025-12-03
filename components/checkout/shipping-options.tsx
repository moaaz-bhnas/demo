"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ShippingOption } from "@/lib/types";

interface ShippingOptionsProps {
  options: ShippingOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onContinue: () => void;
  isLoading?: boolean;
}

export function ShippingOptions({
  options,
  selectedId,
  onSelect,
  onContinue,
  isLoading,
}: ShippingOptionsProps) {
  return (
    <div className="space-y-4">
      <RadioGroup value={selectedId ?? ""} onValueChange={onSelect}>
        {options.map((option) => (
          <div
            key={option.id}
            className="flex items-center justify-between rounded-md border p-4"
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id} className="cursor-pointer">
                <span className="font-medium capitalize">{option.name}</span>
              </Label>
            </div>
            <span className="font-medium">
              {option.calculated_price.calculated_amount === 0
                ? "Free"
                : `${option.calculated_price.calculated_amount} ${option.calculated_price.currency_code.toUpperCase()}`}
            </span>
          </div>
        ))}
      </RadioGroup>

      <Button
        className="w-full"
        disabled={!selectedId || isLoading}
        onClick={onContinue}
      >
        {isLoading ? "Saving..." : "Continue to Payment"}
      </Button>
    </div>
  );
}

