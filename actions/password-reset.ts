"use server";

import { db, passwordResetTokens } from "@/db";
import type { PasswordResetToken } from "@/db";
import { and, eq, gt } from "drizzle-orm";
import { nanoid } from "nanoid";

export const createPasswordResetToken = async (
  accountId: string,
  expiresInHours: number = 1
): Promise<PasswordResetToken> => {
  const token = `reset_${nanoid(32)}`;
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);

  const [resetToken] = await db
    .insert(passwordResetTokens)
    .values({
      id: `prt_${nanoid(25)}`,
      accountId,
      token,
      expiresAt,
      isUsed: false,
    })
    .returning();

  return resetToken;
};

export const retrievePasswordResetToken = async (
  token: string
): Promise<PasswordResetToken | null> => {
  const [resetToken] = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.token, token),
        eq(passwordResetTokens.isUsed, false),
        gt(passwordResetTokens.expiresAt, new Date())
      )
    )
    .limit(1);

  return resetToken || null;
};

export const markPasswordResetTokenAsUsed = async (id: string) => {
  await db
    .update(passwordResetTokens)
    .set({
      isUsed: true,
      usedAt: new Date(),
    })
    .where(eq(passwordResetTokens.id, id));
};

export const deleteExpiredPasswordResetTokens = async () => {
  await db
    .delete(passwordResetTokens)
    .where(gt(passwordResetTokens.expiresAt, new Date()));
};
