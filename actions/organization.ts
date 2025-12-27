"use server";

import { Network, Organization, db, organizations, teamMembers } from "@/db";
import { and, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

import { postTeamMember } from "./team-member";

export const postOrganization = async (params: Partial<Organization>) => {
  const [organization] = await db
    .insert(organizations)
    .values({ id: `org_${nanoid(25)}`, ...params } as Organization)
    .returning();

  await postTeamMember({
    organizationId: organization.id,
    accountId: organization.accountId,
    role: "owner",
  });

  return organization;
};

export const retrieveOrganizations = async (
  accountId: string,
  environment: Network
) => {
  const orgs = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      logoUrl: organizations.logoUrl,
      role: teamMembers.role,
      memberCount:
        sql<number>`(SELECT COUNT(*) FROM ${teamMembers} WHERE ${teamMembers.organizationId} = ${organizations.id})`.as(
          "member_count"
        ),
    })
    .from(teamMembers)
    .innerJoin(organizations, eq(teamMembers.organizationId, organizations.id))
    .where(
      and(
        eq(teamMembers.accountId, accountId),
        eq(organizations.environment, environment)
      )
    );

  return orgs;
};

export const retrieveOrganization = async (id: string) => {
  const [organization] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, id))
    .limit(1);

  if (!organization) throw new Error("Organization not found");

  return organization;
};

export const putOrganization = async (
  id: string,
  params: Partial<Organization>
) => {
  const [organization] = await db
    .update(organizations)
    .set({ ...params, updatedAt: new Date() })
    .where(eq(organizations.id, id))
    .returning();

  if (!organization) throw new Error("Organization not found");

  return organization;
};

export const deleteOrganization = async (id: string) => {
  await db.delete(organizations).where(eq(organizations.id, id)).returning();

  return null;
};
