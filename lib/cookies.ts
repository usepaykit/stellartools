import { cookies } from "next/headers";

// Helper function to set auth cookies
export const setAuthCookies = async (
  authToken: string,
  accountId: string,
  expiresAt: Date
) => {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
  cookieStore.set("account_id", accountId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
};

// Helper function to clear auth cookies
export const clearAuthCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("account_id");
};
