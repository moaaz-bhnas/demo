"use client";

import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAddresses } from "@/hooks/use-addresses";
import { WithSkeleton } from "@/components/with-skeleton";
import { AddressesListSkeleton } from "@/components/skeleton/profile-skeleton";
import { AddressForm } from "./address-form";
import type { CustomerAddress } from "@/lib/types";

function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: CustomerAddress;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">
                {address.first_name} {address.last_name}
              </p>
              {address.is_default_shipping && (
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3" />
                  Default
                </Badge>
              )}
            </div>
            {address.company && (
              <p className="text-sm text-muted-foreground">{address.company}</p>
            )}
            <p className="text-sm">{address.address_1}</p>
            {address.address_2 && <p className="text-sm">{address.address_2}</p>}
            <p className="text-sm">
              {address.city}
              {address.province && `, ${address.province}`}
              {address.postal_code && ` ${address.postal_code}`}
            </p>
            <p className="text-sm">{address.country_code?.toUpperCase()}</p>
            {address.phone && (
              <p className="text-sm text-muted-foreground">{address.phone}</p>
            )}
          </div>
          <div className="flex gap-2">
            {!address.is_default_shipping && (
              <Button variant="ghost" size="sm" onClick={onSetDefault}>
                Set Default
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 text-destructive" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AddressesList() {
  const { addresses, isLoading, deleteAddress, setDefaultShipping } =
    useAddresses();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(
    null
  );

  const handleEdit = (address: CustomerAddress) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  return (
    <WithSkeleton isLoading={isLoading} skeleton={<AddressesListSkeleton />}>
      {showForm ? (
        <AddressForm address={editingAddress} onClose={handleCloseForm} />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </div>

          {addresses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No addresses saved</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add an address to make checkout faster.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={() => handleEdit(address)}
                  onDelete={() => deleteAddress(address.id)}
                  onSetDefault={() => setDefaultShipping(address.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </WithSkeleton>
  );
}

