import { CreditBalance, db, creditBalances } from "@/db";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const postCreditBalance = async (params: Partial<CreditBalance>) => {
  const [creditBalance] = await db
    .insert(creditBalances)
    .values({ id: `cb_${nanoid(25)}`, ...params } as CreditBalance)
    .returning();

  return creditBalance;
};

export const retrieveCreditBalance = async (id: string) => {
  const [creditBalance] = await db
    .select()
    .from(creditBalances)
    .where(eq(creditBalances.id, id))
    .limit(1);

  if (!creditBalance) throw new Error("Credit balance not found");

  return creditBalance;
};

export const putCreditBalance = async (
  id: string,
  retUpdate: Partial<CreditBalance>
) => {
  const [record] = await db
    .update(creditBalances)
    .set({ ...retUpdate, updatedAt: new Date() })
    .where(eq(creditBalances.id, id))
    .returning();

  if (!record) throw new Error("Record not found");

  return record;
};

export const deleteCreditBalance = async (id: string) =>
{ 
  await db.delete(creditBalances).where(eq(creditBalances.id, id)).returning();

  return null;
}