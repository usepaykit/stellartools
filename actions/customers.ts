"use server";

import { Customer, Network, customers, db } from "@/db";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { resolveOrgContext } from "./organization";

export const postCustomer = async (params: Omit<Customer, "id">) => {
  const { organizationId, environment } = await resolveOrgContext(
    params.organizationId,
    params.environment
  );

  const [customer] = await db
    .insert(customers)
    .values({
      ...params,
      id: `cu_${nanoid(25)}`,
      organizationId,
      environment,
    } as Customer)
    .returning();

  if (!customer) throw new Error("Customer not created");

  return customer;
};

export const retrieveCustomers = async (orgId?: string, env?: Network) => {
  const { organizationId, environment } = await resolveOrgContext(orgId, env);

  return await db
    .select()
    .from(customers)
    .where(
      and(
        eq(customers.organizationId, organizationId),
        eq(customers.environment, environment)
      )
    );
};

export const retrieveCustomer = async (
  id: string,
  orgId?: string,
  env?: Network
) => {
  const { organizationId, environment } = await resolveOrgContext(orgId, env);

  const [customer] = await db
    .select()
    .from(customers)
    .where(
      and(
        eq(customers.id, id),
        eq(customers.organizationId, organizationId),
        eq(customers.environment, environment)
      )
    )
    .limit(1);

  if (!customer) throw new Error("Customer not found");

  return customer;
};

export const putCustomer = async (
  id: string,
  retUpdate: Partial<Customer>,
  orgId?: string,
  env?: Network
) => {
  const { organizationId, environment } = await resolveOrgContext(orgId, env);

  const [customer] = await db
    .update(customers)
    .set({ ...retUpdate, updatedAt: new Date() })
    .where(
      and(
        eq(customers.id, id),
        eq(customers.organizationId, organizationId),
        eq(customers.environment, environment)
      )
    )
    .returning();

  if (!customer) throw new Error("Customer not found");

  return customer;
};

export const deleteCustomer = async (
  id: string,
  orgId?: string,
  env?: Network
) => {
  const { organizationId, environment } = await resolveOrgContext(orgId, env);

  await db
    .delete(customers)
    .where(
      and(
        eq(customers.id, id),
        eq(customers.organizationId, organizationId),
        eq(customers.environment, environment)
      )
    )
    .returning();

  return null;
};
