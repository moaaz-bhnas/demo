"use client";

import { cn } from "@/lib/utils";
import type { ProductOption, ProductVariant } from "@/lib/types";

interface VariantSelectorProps {
  options: ProductOption[];
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;
}

export function VariantSelector({
  options,
  variants,
  selectedVariant,
  onVariantChange,
}: VariantSelectorProps) {
  // Get the current selection for each option
  const getCurrentSelection = (optionId: string): string | null => {
    if (!selectedVariant) return null;
    const optionValue = selectedVariant.options.find(
      (o) => o.option_id === optionId || o.option?.id === optionId
    );
    return optionValue?.value ?? null;
  };

  // Find variant that matches the new selection
  const findVariant = (optionId: string, value: string): ProductVariant | null => {
    // Build the target option values
    const targetOptions: Record<string, string> = {};

    options.forEach((option) => {
      if (option.id === optionId) {
        targetOptions[option.id] = value;
      } else {
        const current = getCurrentSelection(option.id);
        if (current) {
          targetOptions[option.id] = current;
        }
      }
    });

    // Find matching variant
    return (
      variants.find((variant) => {
        return Object.entries(targetOptions).every(([optId, val]) => {
          return variant.options.some(
            (o) => (o.option_id === optId || o.option?.id === optId) && o.value === val
          );
        });
      }) ?? null
    );
  };

  // Check if a value is available (has a variant)
  const isValueAvailable = (optionId: string, value: string): boolean => {
    return findVariant(optionId, value) !== null;
  };

  // Check if a value is in stock
  const isValueInStock = (optionId: string, value: string): boolean => {
    const variant = findVariant(optionId, value);
    if (!variant) return false;
    if (!variant.manage_inventory) return true;
    return (variant.inventory_quantity ?? 0) > 0 || variant.allow_backorder;
  };

  if (options.length === 0 || options[0]?.title === "Default option") {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      {options.map((option) => {
        const currentValue = getCurrentSelection(option.id);

        return (
          <div key={option.id}>
            <h3 className="mb-3 text-sm font-medium">
              {option.title}: <span className="font-normal">{currentValue}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {option.values.map((optionValue) => {
                const isSelected = currentValue === optionValue.value;
                const isAvailable = isValueAvailable(option.id, optionValue.value);
                const inStock = isValueInStock(option.id, optionValue.value);

                return (
                  <button
                    key={optionValue.id}
                    onClick={() => {
                      const newVariant = findVariant(option.id, optionValue.value);
                      if (newVariant) {
                        onVariantChange(newVariant);
                      }
                    }}
                    disabled={!isAvailable}
                    className={cn(
                      "rounded-md border px-4 py-2 text-sm transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input hover:border-primary",
                      !isAvailable && "cursor-not-allowed opacity-50",
                      !inStock && isAvailable && "opacity-70 line-through"
                    )}
                  >
                    {optionValue.value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

