"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleGoogleCallback, isAuthenticated } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    // Prevent double processing
    if (hasProcessed) return;

    const processCallback = async () => {
      setHasProcessed(true);

      // Get all query parameters from the URL
      const queryParams: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });

      // Check if we have the required params (code and state from Google)
      if (!queryParams.code) {
        setStatus("error");
        setError("Invalid callback. Missing authorization code.");
        return;
      }

      try {
        await handleGoogleCallback(queryParams);
        setStatus("success");

        // Redirect to profile after short delay
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      } catch (err) {
        console.error("Google callback error:", err);
        setStatus("error");
        setError(err instanceof Error ? err.message : "Authentication failed. Please try again.");
      }
    };

    processCallback();
  }, [searchParams, handleGoogleCallback, router, hasProcessed]);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && status === "success") {
      router.push("/profile");
    }
  }, [isAuthenticated, status, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>
            {status === "loading" && "Signing you in..."}
            {status === "success" && "Welcome!"}
            {status === "error" && "Authentication Failed"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Please wait while we complete your Google sign-in."}
            {status === "success" && "You've been successfully signed in with Google."}
            {status === "error" && "We couldn't complete your sign-in."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {status === "loading" && (
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          )}
          {status === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-sm text-muted-foreground">Redirecting to your profile...</p>
            </>
          )}
          {status === "error" && (
            <>
              <XCircle className="h-12 w-12 text-destructive" />
              {error && (
                <p className="text-center text-sm text-destructive">{error}</p>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.push("/login")}>
                  Back to Login
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}

