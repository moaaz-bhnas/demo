"use client";

import { CreditCard, Banknote } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { PaymentProvider } from "@/lib/types";

interface PaymentOptionsProps {
  providers: PaymentProvider[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onComplete: () => void;
  isLoading?: boolean;
}

const providerInfo: Record<string, { name: string; icon: React.ReactNode }> = {
  pp_system_default: {
    name: "Cash on Delivery",
    icon: <Banknote className="h-5 w-5" />,
  },
  pp_fawaterak_json: {
    name: "Online Payment",
    icon: <CreditCard className="h-5 w-5" />,
  },
};

export function PaymentOptions({
  providers,
  selectedId,
  onSelect,
  onComplete,
  isLoading,
}: PaymentOptionsProps) {
  return (
    <div className="space-y-4">
      <RadioGroup value={selectedId ?? ""} onValueChange={onSelect}>
        {providers
          .filter((p) => p.is_enabled)
          .map((provider) => {
            const info = providerInfo[provider.id] ?? {
              name: provider.id,
              icon: <CreditCard className="h-5 w-5" />,
            };

            return (
              <div
                key={provider.id}
                className="flex items-center gap-3 rounded-md border p-4"
              >
                <RadioGroupItem value={provider.id} id={provider.id} />
                <Label
                  htmlFor={provider.id}
                  className="flex cursor-pointer items-center gap-3"
                >
                  {info.icon}
                  <span className="font-medium">{info.name}</span>
                </Label>
              </div>
            );
          })}
      </RadioGroup>

      <Button
        className="w-full"
        disabled={!selectedId || isLoading}
        onClick={onComplete}
      >
        {isLoading ? "Processing..." : "Place Order"}
      </Button>
    </div>
  );
}

