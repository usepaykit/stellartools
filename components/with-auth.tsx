"use client";

import { ComponentType, ReactNode, useEffect } from "react";

import { getCurrentUser } from "@/actions/auth";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

type WithAuthOptions = {
  requireAuth?: boolean; // true = protected route, false = auth route
  redirectTo?: string;
  fallback?: ReactNode;
};

export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    requireAuth = true,
    redirectTo,
    fallback = (
      <div className="flex h-screen items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    ),
  } = options;

  return function AuthenticatedComponent(props: P) {
    const router = useRouter();

    const { data: user, isLoading } = useQuery({
      queryKey: ["currentUser"],
      queryFn: getCurrentUser,
      staleTime: 1000 * 60 * 5, 
    });

    useEffect(() => {
      if (isLoading) return;

      if (requireAuth) {
        // Protected route - redirect if not authenticated
        if (!user) {
          router.push(redirectTo || "/auth/signin");
        }
      } else {
        // Auth route - redirect if already authenticated
        if (user) {
          router.push(redirectTo || "/dashboard");
        }
      }
    }, [user, isLoading, router]);

    // Show loading state
    if (isLoading) {
      return <>{fallback}</>;
    }

    // Protected route: render only if authenticated
    if (requireAuth) {
      if (!user) {
        return null; // Will redirect via useEffect
      }
      return <Component {...props} />;
    }

    // Auth route: render only if NOT authenticated
    if (user) {
      return null; // Will redirect via useEffect
    }

    return <Component {...props} />;
  };
}
