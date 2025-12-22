"use server";

import { TeamInvite, db, teamInvites } from "@/db";
import { and, eq } from "drizzle-orm";
import moment from "moment";
import { nanoid } from "nanoid";

export const postTeamInvite = async (params: Partial<TeamInvite>) => {
  const [teamInvite] = await db
    .insert(teamInvites)
    .values({
      id: `ti_${nanoid(25)}`,
      expiresAt: moment().add(7, "days").toDate(),
      status: "pending",
      ...params,
    } as TeamInvite)
    .returning();

  return teamInvite;
};

export const retrieveTeamInvites = async (organizationId: string) => {
  return await db
    .select()
    .from(teamInvites)
    .where(eq(teamInvites.organizationId, organizationId));
};

export const retrieveTeamInvite = async (id: string) => {
  const [teamInvite] = await db
    .select()
    .from(teamInvites)
    .where(eq(teamInvites.id, id))
    .limit(1);

  if (!teamInvite) throw new Error("Team invite not found");

  return teamInvite;
};

export const putTeamInvite = async (
  id: string,
  organizationId: string,
  params: Partial<TeamInvite>
) => {
  const [teamInvite] = await db
    .update(teamInvites)
    .set({ ...params, updatedAt: new Date() })
    .where(
      and(
        eq(teamInvites.id, id),
        eq(teamInvites.organizationId, organizationId)
      )
    )
    .returning();

  if (!teamInvite) throw new Error("Team invite not found");

  return teamInvite;
};

export const deleteTeamInvite = async (id: string, organizationId: string) => {
  await db
    .delete(teamInvites)
    .where(
      and(
        eq(teamInvites.id, id),
        eq(teamInvites.organizationId, organizationId)
      )
    )
    .returning();

  return null;
};
