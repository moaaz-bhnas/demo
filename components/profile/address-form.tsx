"use client";

import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAddresses } from "@/hooks/use-addresses";
import type { CustomerAddress } from "@/lib/types";

interface AddressFormProps {
  address?: CustomerAddress | null;
  onClose: () => void;
}

export function AddressForm({ address, onClose }: AddressFormProps) {
  const { createAddress, updateAddress } = useAddresses();
  const [isLoading, setIsLoading] = useState(false);

  const [firstName, setFirstName] = useState(address?.first_name ?? "");
  const [lastName, setLastName] = useState(address?.last_name ?? "");
  const [company, setCompany] = useState(address?.company ?? "");
  const [phone, setPhone] = useState(address?.phone ?? "");
  const [address1, setAddress1] = useState(address?.address_1 ?? "");
  const [address2, setAddress2] = useState(address?.address_2 ?? "");
  const [city, setCity] = useState(address?.city ?? "");
  const [province, setProvince] = useState(address?.province ?? "");
  const [postalCode, setPostalCode] = useState(address?.postal_code ?? "");
  const [countryCode, setCountryCode] = useState(address?.country_code ?? "EG");
  const [isDefaultShipping, setIsDefaultShipping] = useState(
    address?.is_default_shipping ?? false
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        first_name: firstName,
        last_name: lastName,
        company: company || undefined,
        phone: phone || undefined,
        address_1: address1,
        address_2: address2 || undefined,
        city,
        province: province || undefined,
        postal_code: postalCode || undefined,
        country_code: countryCode,
        is_default_shipping: isDefaultShipping,
      };

      if (address) {
        await updateAddress(address.id, data);
      } else {
        await createAddress(data);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <CardTitle>{address ? "Edit Address" : "Add New Address"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company (optional)</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address1">Address Line 1</Label>
            <Input
              id="address1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address2">Address Line 2 (optional)</Label>
            <Input
              id="address2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Province/State (optional)</Label>
              <Input
                id="province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code (optional)</Label>
              <Input
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="countryCode">Country Code</Label>
              <Input
                id="countryCode"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                maxLength={2}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="defaultShipping"
              checked={isDefaultShipping}
              onCheckedChange={(checked) =>
                setIsDefaultShipping(checked === true)
              }
            />
            <Label htmlFor="defaultShipping" className="font-normal">
              Set as default shipping address
            </Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {address ? "Update Address" : "Add Address"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

