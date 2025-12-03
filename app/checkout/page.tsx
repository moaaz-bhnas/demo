"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Container } from "@/components/container";
import { AddressForm, type AddressFormValues } from "@/components/checkout/address-form";
import { ShippingOptions } from "@/components/checkout/shipping-options";
import { PaymentOptions } from "@/components/checkout/payment-options";
import { CartSummary } from "@/components/cart/cart-summary";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import type { ShippingOption, PaymentProvider } from "@/lib/types";

type CheckoutStep = "address" | "shipping" | "payment";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    isLoading,
    itemCount,
    updateAddresses,
    getShippingOptions,
    selectShippingMethod,
    getPaymentProviders,
    initiatePayment,
    completeCart,
  } = useCart();

  const [step, setStep] = useState<CheckoutStep>("address");
  const [isProcessing, setIsProcessing] = useState(false);

  // Shipping
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);

  // Payment
  const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoading && itemCount === 0) {
      router.push("/cart");
    }
  }, [isLoading, itemCount, router]);

  const handleAddressSubmit = async (values: AddressFormValues) => {
    setIsProcessing(true);
    try {
      const address = {
        first_name: values.first_name,
        last_name: values.last_name,
        address_1: values.address_1,
        address_2: values.address_2 || "",
        city: values.city,
        postal_code: values.postal_code || "",
        country_code: "eg",
        phone: values.phone,
      };

      await updateAddresses(values.email, address);

      // Fetch shipping options
      const options = await getShippingOptions();
      setShippingOptions(options);

      // Pre-select first option
      if (options.length > 0) {
        setSelectedShipping(options[0].id);
      }

      setStep("shipping");
    } catch (error) {
      console.error("Failed to save address:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShippingContinue = async () => {
    if (!selectedShipping) return;

    setIsProcessing(true);
    try {
      await selectShippingMethod(selectedShipping);

      // Fetch payment providers
      const providers = await getPaymentProviders();
      setPaymentProviders(providers);

      // Pre-select COD
      const cod = providers.find((p) => p.id === "pp_system_default");
      if (cod) {
        setSelectedPayment(cod.id);
      }

      setStep("payment");
    } catch (error) {
      console.error("Failed to select shipping:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedPayment) return;

    setIsProcessing(true);
    try {
      // Initiate payment
      const paymentCollection = await initiatePayment(
        selectedPayment,
        selectedPayment === "pp_fawaterak_json"
          ? `${window.location.origin}/order/confirmation`
          : undefined
      );

      // Check for Fawaterak redirect
      const fawaterakSession = paymentCollection.payment_sessions.find(
        (s) => s.provider_id === "pp_fawaterak_json"
      );

      if (fawaterakSession?.data?.checkoutUrl) {
        // Redirect to Fawaterak
        window.location.href = fawaterakSession.data.checkoutUrl;
        return;
      }

      // For COD, complete the cart
      const order = await completeCart();
      router.push(`/order/confirmation?order=${order.id}`);
    } catch (error) {
      console.error("Failed to place order:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: "address", label: "Address" },
    { id: "shipping", label: "Shipping" },
    { id: "payment", label: "Payment" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  if (isLoading || itemCount === 0) {
    return null;
  }

  return (
    <Container>
      {/* Back to Cart */}
      <Link href="/cart">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Button>
      </Link>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    i < currentStepIndex
                      ? "bg-primary text-primary-foreground"
                      : i === currentStepIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < currentStepIndex ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    i <= currentStepIndex
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-px w-12 ${
                    i < currentStepIndex ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="rounded-md border p-6">
            {step === "address" && (
              <>
                <h2 className="mb-6 text-lg font-semibold">
                  Shipping Address
                </h2>
                <AddressForm
                  onSubmit={handleAddressSubmit}
                  isLoading={isProcessing}
                />
              </>
            )}

            {step === "shipping" && (
              <>
                <h2 className="mb-6 text-lg font-semibold">Shipping Method</h2>
                <ShippingOptions
                  options={shippingOptions}
                  selectedId={selectedShipping}
                  onSelect={setSelectedShipping}
                  onContinue={handleShippingContinue}
                  isLoading={isProcessing}
                />
              </>
            )}

            {step === "payment" && (
              <>
                <h2 className="mb-6 text-lg font-semibold">Payment Method</h2>
                <PaymentOptions
                  providers={paymentProviders}
                  selectedId={selectedPayment}
                  onSelect={setSelectedPayment}
                  onComplete={handlePlaceOrder}
                  isLoading={isProcessing}
                />
              </>
            )}
          </div>
        </div>

        {/* Summary */}
        <div>
          {cart && <CartSummary cart={cart} />}
        </div>
      </div>
    </Container>
  );
}

