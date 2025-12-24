"use client";

import { useEffect, useState } from "react";

import { handleGoogleOAuth } from "@/actions/auth";
import { toast } from "@/components/ui/toast";
import { useRouter, useSearchParams } from "next/navigation";

type UseGoogleOAuthOptions = {
  onSuccess?: (redirect?: string) => void;
  onError?: (error: Error) => void;
  defaultIntent?: "SIGN_IN" | "SIGN_UP";
  defaultRedirect?: string;
};

export function useGoogleOAuth(options: UseGoogleOAuthOptions = {}) {
  const {
    onSuccess,
    onError,
    defaultIntent = "SIGN_IN",
    defaultRedirect = "/dashboard",
  } = options;

  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const verifyGoogleAuth = async () => {
      const hash =
        typeof window !== "undefined" ? window.location.hash.substring(1) : "";
      const hashParams = new URLSearchParams(hash);
      const idToken = hashParams.get("id_token");
      const oauthError = hashParams.get("error");
      const state = searchParams.get("state");

      if (!idToken && !oauthError) {
        return;
      }

      setIsVerifying(true);
      setError(null);

      try {
        if (oauthError) {
          throw new Error(
            oauthError === "access_denied"
              ? "Access denied"
              : "Authentication failed"
          );
        }

        if (!idToken) {
          throw new Error("No authentication token received");
        }

        let intent: "SIGN_IN" | "SIGN_UP" = defaultIntent;
        let redirect = defaultRedirect;

        if (state) {
          try {
            const stateData = JSON.parse(atob(state));
            intent = stateData.intent || defaultIntent;
            redirect = stateData.redirect || defaultRedirect;
          } catch {
            // ignore invalid state
          }
        }

        await handleGoogleOAuth(idToken, intent);

        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", window.location.pathname);
        }

        if (onSuccess) {
          onSuccess(redirect);
        } else {
          toast.success("Signed in successfully", {
            id: "google-oauth-success",
            description: "Redirecting...",
          });
          setTimeout(() => {
            router.push(redirect);
          }, 500);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err : new Error("Authentication failed");
        setError(errorMessage);

        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", window.location.pathname);
        }

        if (onError) {
          onError(errorMessage);
        } else {
          toast.error("Sign-in failed", {
            id: "google-oauth-error",
            description: errorMessage.message,
          });
        }
      } finally {
        setIsVerifying(false);
      }
    };

    verifyGoogleAuth();
  }, [
    router,
    searchParams,
    defaultIntent,
    defaultRedirect,
    onSuccess,
    onError,
  ]);

  return {
    isVerifying,
    error,
  };
}
