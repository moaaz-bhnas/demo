"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/container";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { ProfileSidebarSkeleton } from "@/components/skeleton/profile-skeleton";
import { useAuth } from "@/hooks/use-auth";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <Container>
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <ProfileSidebarSkeleton />
          </aside>
          <main>
            <div className="animate-pulse text-muted-foreground">
              Loading...
            </div>
          </main>
        </div>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <ProfileSidebar />
        </aside>
        <main>{children}</main>
      </div>
    </Container>
  );
}

