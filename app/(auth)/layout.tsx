"use client";
import { withAuth } from "@/components/with-auth";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export default withAuth(AuthLayout, {
  requireAuth: false,
  redirectTo: "/dashboard",
});
