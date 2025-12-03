import React from "react";

interface WithSkeletonProps {
  children: React.ReactNode;
  isLoading: boolean;
  skeleton: React.ReactNode;
}

export function WithSkeleton({ children, isLoading, skeleton }: WithSkeletonProps) {
  if (isLoading) {
    return <>{skeleton}</>;
  }
  return <>{children}</>;
}

