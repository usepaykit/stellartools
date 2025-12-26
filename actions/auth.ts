"use server";

import { Account, Auth, auth, db } from "@/db";
import {
  clearAuthCookies,
  getAuthCookies,
  setAuthCookies,
} from "@/lib/cookies";
import { sendEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { OAuth2Client } from "google-auth-library";
import { nanoid } from "nanoid";

import { postAccount, putAccount, retrieveAccount } from "./account";
import {
  createPasswordResetToken,
  markPasswordResetTokenAsUsed,
  retrievePasswordResetToken,
} from "./password-reset";

const getGoogleClient = () => {
  const clientId =
    process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID is not configured");
  }
  return new OAuth2Client(clientId);
};

export const postAuth = async (params: Partial<Auth>): Promise<Auth> => {
  const [response] = await db
    .insert(auth)
    .values({ id: `au_${nanoid(25)}`, ...params } as Auth)
    .returning();

  if (!response) throw new Error("Failed to create auth");

  return response;
};

export const retieveAuth = async (id: string) => {
  const [response] = await db
    .select()
    .from(auth)
    .where(eq(auth.id, id))
    .limit(1);

  if (!response) throw new Error("Auth not found");

  return response;
};

export const putAuth = async (id: string, params: Partial<Auth>) => {
  const [response] = await db
    .update(auth)
    .set({ ...params, updatedAt: new Date() })
    .where(eq(auth.id, id))
    .returning();

  if (!response) throw new Error("Failed to update auth");

  return response;
};

export const deleteAuth = async (id: string) => {
  const [response] = await db.delete(auth).where(eq(auth.id, id)).returning();

  if (!response) throw new Error("Failed to delete auth");

  return response;
};

export const retrieveAuthByAccountId = async (accountId: string) => {
  const [response] = await db
    .select()
    .from(auth)
    .where(eq(auth.accountId, accountId))
    .limit(1);

  if (!response) throw new Error("Auth not found");

  return response;
};

export const signUp = async (
  params: Partial<Account> & { password: string }
) => {
  if (!params.email) throw new Error("Email is required");

  // Check if email already exists
  const existingAccount = await retrieveAccount({ email: params.email.toLowerCase() });
  if (existingAccount) {
    throw new Error("Email already registered");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(params.password, 10);

  // Extract first and last name
  const nameParts = params.userName?.trim().split(/\s+/) || [];
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Create account using postAccount
  const account: Account = await postAccount({
    email: params.email.toLowerCase(),
    userName: params.email.toLowerCase().split("@")[0],
    profile: {
      first_name: firstName,
      last_name: lastName,
    },
    sso: {
      values: [
        ...(params.sso?.values || []),
        {
          provider: "local",
          sub: passwordHash,
        },
      ],
    },
  });
  // Create auth record using postAuth
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const authRecord = await postAuth({
    accountId: account.id,
    provider: "local",
    accessToken: `local_${nanoid(32)}`,
    refreshToken: `refresh_${nanoid(32)}`,
    expiresAt,
    isRevoked: false,
  });

  await setAuthCookies(authRecord.accessToken, account.id, expiresAt);

  return { account, auth: authRecord };
};

export const signIn = async (params: { email: string; password: string }) => {
  const account = await retrieveAccount({
    email: params.email.toLowerCase(),
  });
  console.log("the account found here?---->", account);

  if (!account) {
    throw new Error("Invalid email or password");
  }

  const authRecord = await retrieveAuthByAccountId(account.id);

  if (authRecord.provider !== "local") {
    throw new Error("Invalid authentication method");
  }

  if (authRecord.isRevoked) {
    throw new Error("Account access has been revoked");
  }

  //compare with the sso values for the matching provider
  const isValidPassword = await bcrypt.compare(
    params.password,
    account.sso?.values?.find((sso) => sso.provider === "local")?.sub as string
  );
  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  if (new Date() > authRecord.expiresAt) {
    throw new Error("Session expired. Please sign in again.");
  }
  await setAuthCookies(
    authRecord.accessToken,
    account.id,
    authRecord.expiresAt
  );
  return { account, auth: authRecord };
};

export const getCurrentUser = async () => {
  const { authToken, accountId } = await getAuthCookies();

  if (!authToken || !accountId) {
    return null;
  }

  try {
    const authRecord = await retrieveAuthByAccountId(accountId);

    // Verify token matches and is not revoked/expired
    if (
      authRecord.accessToken !== authToken ||
      authRecord.isRevoked ||
      new Date() > authRecord.expiresAt
    ) {
      return null;
    }

    const account = await retrieveAccount({ id: accountId });
    return { account, auth: authRecord };
  } catch {
    return null;
  }
};

export const signOut = async () => {
  await clearAuthCookies();
};

export const forgotPassword = async (email: string) => {
  try {
    const account = await retrieveAccount({ email: email.toLowerCase() });
    console.log("the account found here?---->", account);
    if (!account) {
      return { success: true };
    }
    const resetToken = await createPasswordResetToken(account.id, 1);

    const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken.token}`;
    const result = await sendEmail(
      email.toLowerCase(),
      "Reset Password",
      `<a href="${resetLink}">Reset Password</a>`
    );
    console.log(result);
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Account not found") {
      return { success: true };
    }
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  const resetTokenRecord = await retrievePasswordResetToken(token);

  if (!resetTokenRecord) {
    throw new Error("Invalid or expired reset token");
  }

  const account = await retrieveAccount({ id: resetTokenRecord.accountId });
  if (!account) {
    throw new Error("Account not found");
  }
  const passwordHash = await bcrypt.hash(newPassword, 10);

  const updatedSso = {
    values: [
      ...(account.sso?.values?.filter((sso) => sso.provider !== "local") || []),
      {
        provider: "local",
        sub: passwordHash,
      },
    ],
  };

  await putAccount(account.id, {
    sso: updatedSso as {
      values: { provider: "google" | "local"; sub: string }[];
    },
  });

  await markPasswordResetTokenAsUsed(resetTokenRecord.id);

  return { success: true };
};

// Update Password - For authenticated users
export const updatePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  const account = user.account;
  if (!account) {
    throw new Error("Account not found");
  }
  // Verify current password
  const currentPasswordHash = account.sso?.values?.find(
    (sso) => sso.provider === "local"
  )?.sub as string;

  if (!currentPasswordHash) {
    throw new Error("Password not set for this account");
  }

  const isValidPassword = await bcrypt.compare(
    currentPassword,
    currentPasswordHash
  );

  if (!isValidPassword) {
    throw new Error("Current password is incorrect");
  }

  // Hash new password
  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  // Update password in account SSO
  const updatedSso = {
    values: [
      ...(account.sso?.values?.filter((sso) => sso.provider !== "local") || []),
      {
        provider: "local",
        sub: newPasswordHash,
      },
    ],
  };

  await putAccount(account.id, {
    sso: updatedSso as {
      values: { provider: "google" | "local"; sub: string }[];
    },
  });

  return { success: true };
};

export const handleGoogleOAuth = async (
  idToken: string,
  intent: "SIGN_IN" | "SIGN_UP"
) => {
  try {
    const client = getGoogleClient();
    const ticket = await client.verifyIdToken({
      idToken,
      audience:
        process.env.GOOGLE_CLIENT_ID ||
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error("Invalid token payload");
    }

    // Verify required claims
    if (!payload.email) {
      throw new Error("Email not found in token");
    }

    if (!payload.email_verified) {
      throw new Error("Email not verified");
    }

    // Verify the token is for the correct audience
    const clientId =
      process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (payload.aud !== clientId) {
      throw new Error("Token audience mismatch");
    }

    const email = payload.email.toLowerCase();
    const googleSub = payload.sub;

    let account: Account | null;
    try {
      account = await retrieveAccount({ email });

      if (!account) {
        throw new Error("Account not found");
      }

      const hasGoogleSSO = account.sso?.values?.some(
        (sso) => sso.provider === "google" && sso.sub === googleSub
      );

      if (!hasGoogleSSO) {
        const updatedSso = {
          values: [
            ...(account.sso?.values || []),
            {
              provider: "google",
              sub: googleSub,
            },
          ],
        };
        await putAccount(account.id, {
          sso: updatedSso as {
            values: { provider: "google" | "local"; sub: string }[];
          },
        });
      }

      let authRecord: Auth;
      try {
        authRecord = await retrieveAuthByAccountId(account.id);

        if (authRecord.provider !== "google") {
          const expiresAt = new Date();
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);

          authRecord = await putAuth(authRecord.id, {
            provider: "google",
            accessToken: `google_${nanoid(32)}`,
            refreshToken: `refresh_${nanoid(32)}`,
            expiresAt,
            isRevoked: false,
          });
        }
      } catch {
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);

        authRecord = await postAuth({
          accountId: account.id,
          provider: "google",
          accessToken: `google_${nanoid(32)}`,
          refreshToken: `refresh_${nanoid(32)}`,
          expiresAt,
          isRevoked: false,
        });
      }

      await setAuthCookies(
        authRecord.accessToken,
        account.id,
        authRecord.expiresAt
      );

      return { account, auth: authRecord };
    } catch {
      if (intent === "SIGN_UP") {
        const nameParts = payload.name?.split(/\s+/) || [];
        const firstName = payload.given_name || nameParts[0] || "";
        const lastName =
          payload.family_name || nameParts.slice(1).join(" ") || "";

        account = await postAccount({
          email,
          userName: email.split("@")[0],
          profile: {
            first_name: firstName,
            last_name: lastName,
            avatar_url: payload.picture,
          },
          sso: {
            values: [
              {
                provider: "google",
                sub: googleSub,
              },
            ],
          },
        });

        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);

        const authRecord = await postAuth({
          accountId: account.id,
          provider: "google",
          accessToken: `google_${nanoid(32)}`,
          refreshToken: `refresh_${nanoid(32)}`,
          expiresAt,
          isRevoked: false,
        });

        await setAuthCookies(authRecord.accessToken, account.id, expiresAt);

        return { account, auth: authRecord };
      } else {
        throw new Error("Account not found. Please sign up first.");
      }
    }
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Google authentication failed");
  }
};

export const googleSignin = async (metadata: Record<string, any>) => {
  const authUrlDomain = "https://accounts.google.com/o/oauth2/v2/auth";

  const authUrlParams = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.APP_URL}/api/auth/verify-callback`,
    response_type: "code",
    scope: "openid profile email",
    access_type: "offline",
    prompt: "consent",
    state: btoa(JSON.stringify({ ...metadata })),
  };

  const authUrl = `${authUrlDomain}?${new URLSearchParams(authUrlParams as Record<string, string>)}`;
  return authUrl;
};
