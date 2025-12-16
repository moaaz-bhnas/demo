"use client";

import { AccountInfo } from "@/components/profile/account-info";
import { AccountInfoSkeleton } from "@/components/skeleton/profile-skeleton";
import { WithSkeleton } from "@/components/with-skeleton";
import { useAuth } from "@/hooks/use-auth";

export default function ProfilePage() {
  const { isLoading, customer } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Account</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <WithSkeleton isLoading={isLoading || !customer} skeleton={<AccountInfoSkeleton />}>
        <AccountInfo />
      </WithSkeleton>
    </div>
  );
}

