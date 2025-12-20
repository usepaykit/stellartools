"use server";

import { Network, Webhook, WebhookLog, db, webhookLogs, webhooks } from "@/db";
import { hash } from "crypto";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const postWebhook = async (
  organizationId: string,
  data: Partial<Webhook>
) => {
  const [webhook] = await db
    .insert(webhooks)
    .values({
      id: `wh_${nanoid(25)}`,
      secretHash: hash(nanoid(32), "sha256"),
      organizationId,
      ...data,
    } as Webhook)
    .returning();

  if (!webhook) throw new Error("Failed to create webhook");

  return webhook as Webhook;
};

export const retrieveWebhooks = async (
  organizationId: string,
  environment: Network
) => {
  const webhooksResult = await db
    .select()
    .from(webhooks)
    .where(
      and(
        eq(webhooks.organizationId, organizationId),
        eq(webhooks.environment, environment)
      )
    );

  if (!webhooksResult.length) throw new Error("Failed to retrieve webhooks");

  return webhooksResult;
};

export const retrieveWebhook = async (id: string, organizationId: string) => {
  const [webhook] = await db
    .select()
    .from(webhooks)
    .where(
      and(eq(webhooks.id, id), eq(webhooks.organizationId, organizationId))
    );

  if (!webhook) throw new Error("Failed to retrieve webhook");

  return webhook;
};

export const putWebhook = async (
  id: string,
  organizationId: string,
  data: Partial<Webhook>
) => {
  const [webhook] = await db
    .update(webhooks)
    .set({ ...data, updatedAt: new Date() })
    .where(
      and(eq(webhooks.id, id), eq(webhooks.organizationId, organizationId))
    )
    .returning();

  if (!webhook) throw new Error("Failed to update webhook");

  return webhook;
};

export const deleteWebhook = async (id: string, organizationId: string) => {
  await db
    .delete(webhooks)
    .where(
      and(eq(webhooks.id, id), eq(webhooks.organizationId, organizationId))
    )
    .returning();

  return null;
};

export const postWebhookLog = async (
  webhookId: string,
  params: Partial<WebhookLog>
) => {
  const [webhookLog] = await db
    .insert(webhookLogs)
    .values({ id: `wh_log_${nanoid(25)}`, webhookId, ...params } as WebhookLog)
    .returning();

  if (!webhookLog) throw new Error("Failed to create webhook log");

  return webhookLog;
};

export const retrieveWebhookLogs = async (
  webhookId: string,
  organizationId: string,
  environment: Network
) => {
  const webhookLogsResult = await db
    .select()
    .from(webhookLogs)
    .where(
      and(
        eq(webhookLogs.webhookId, webhookId),
        eq(webhookLogs.environment, environment),
        eq(webhookLogs.organizationId, organizationId)
      )
    );

  if (!webhookLogsResult.length)
    throw new Error("Failed to retrieve webhook logs");

  return webhookLogsResult;
};

export const retrieveWebhookLog = async (
  id: string,
  organizationId: string
) => {
  const [webhookLog] = await db
    .select()
    .from(webhookLogs)
    .where(
      and(
        eq(webhookLogs.id, id),
        eq(webhookLogs.organizationId, organizationId)
      )
    );

  if (!webhookLog) throw new Error("Failed to retrieve webhook log");

  return webhookLog;
};

export const putWebhookLog = async (
  id: string,
  organizationId: string,
  data: Partial<WebhookLog>
) => {
  const [webhookLog] = await db
    .update(webhookLogs)
    .set({ ...data, updatedAt: new Date() })
    .where(
      and(
        eq(webhookLogs.id, id),
        eq(webhookLogs.organizationId, organizationId)
      )
    )
    .returning();

  if (!webhookLog) throw new Error("Failed to update webhook log");

  return webhookLog;
};

export const deleteWebhookLog = async (id: string, organizationId: string) => {
  await db
    .delete(webhookLogs)
    .where(
      and(
        eq(webhookLogs.id, id),
        eq(webhookLogs.organizationId, organizationId)
      )
    )
    .returning();

  return null;
};
