import
  {
    CreditTransaction,db, creditTransactions
  } from "@/db";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
// import id from "zod/v4/locales/id.js";

export const postCreditTransaction = async(
  params: Partial<CreditTransaction>
) =>
{
  const [creditTransaction] = await db
    .insert(creditTransactions)
    .values({ id: `ct_${nanoid(25)}`, ...params } as CreditTransaction)
    .returning();

  return creditTransaction;
};

export const retrieveCreditTransaction = async (id: string) => {
  const [creditTransaction] = await db
    .select()
    .from(creditTransactions)
    .where(eq(creditTransactions.id, id))
    .limit(1);

  if (!creditTransaction) throw new Error("Credit transaction not found");

  return creditTransaction;
};

export const putCreditTransaction = async (
  id: string,
  returnUpdate: Partial<CreditTransaction>
) => {
  const [record] = await db
    .update(creditTransactions)
    .set({ ...returnUpdate, updatedAt: new Date() })
    .where(eq(creditTransactions.id, id))
    .returning();

  if (!record) throw new Error("Record not found");

  return record;
};

export const deleteCreditTransaction = async (id: string) => {
  await db.delete(creditTransactions).where(eq(creditTransactions.id, id)).returning();

  return null;
};