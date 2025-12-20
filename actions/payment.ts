"use server";

import { Network, Payment, db, payments } from "@/db";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const postPayment = async (params: Partial<Payment>) => {
  const isTestnet = params.environment === "testnet";

  const [payment] = await db
    .insert(payments)
    .values({
      id: isTestnet ? `pay_test_${nanoid(25)}` : `pay_main_${nanoid(25)}`,
      ...params,
    } as Payment)
    .returning();

  return payment;
};

export const retrievePayments = async (
  organizationId: string,
  network: Network
) => {
  return await db
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.organizationId, organizationId),
        eq(payments.environment, network)
      )
    );
};

export const retrievePayment = async (id: string, organizationId: string) => {
  const [payment] = await db
    .select()
    .from(payments)
    .where(
      and(eq(payments.id, id), eq(payments.organizationId, organizationId))
    );

  if (!payment) throw new Error("Payment not found");

  return payment;
};

export const putPayment = async (
  id: string,
  organizationId: string,
  params: Partial<Payment>
) => {
  const [payment] = await db
    .update(payments)
    .set({ ...params, updatedAt: new Date() })
    .where(
      and(eq(payments.id, id), eq(payments.organizationId, organizationId))
    )
    .returning();

  if (!payment) throw new Error("Payment not found");

  return payment;
};

export const deletePayment = async (id: string, organizationId: string) => {
  await db
    .delete(payments)
    .where(
      and(eq(payments.id, id), eq(payments.organizationId, organizationId))
    )
    .returning();

  return null;
};
