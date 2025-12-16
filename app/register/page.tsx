"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/container";
import { RegisterForm } from "@/components/auth/register-form";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Container>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <Container>
      <div className="flex justify-center">
        <RegisterForm />
      </div>
    </Container>
  );
}
