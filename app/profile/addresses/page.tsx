"use client";

import { AddressesList } from "@/components/profile/addresses-list";

export default function AddressesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <p className="text-muted-foreground">
          Manage your shipping and billing addresses
        </p>
      </div>

      <AddressesList />
    </div>
  );
}

