import { postWebhookLog } from "@/actions/webhook";
import { Network } from "@/db";
import { Webhook as WebhookSchema } from "@/db/schema";
import crypto from "crypto";
import { nanoid } from "nanoid";

export class Webhook {
  constructor() {}

  generateSignature = (payload: string, secret: string): string => {
    const timestamp = Math.floor(Date.now() / 1000);
    const signedPayload = `${timestamp}.${payload}`;

    const hmac = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");

    return `t=${timestamp},v1=${hmac}`;
  };

  verifySignature = (
    payload: string,
    signature: string,
    secret: string,
    tolerance: number = 300
  ): boolean => {
    try {
      const parts = signature.split(",");
      const timestamp = parseInt(parts[0].split("=")[1]);
      const receivedSignature = parts[1].split("=")[1];

      const now = Math.floor(Date.now() / 1000);

      if (Math.abs(now - timestamp) > tolerance) return false;

      const signedPayload = `${timestamp}.${payload}`;

      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(signedPayload)
        .digest("hex");

      return crypto.timingSafeEqual(
        Buffer.from(receivedSignature),
        Buffer.from(expectedSignature)
      );
    } catch {
      return false;
    }
  };

  deliverWebhook = async (
    webhook: WebhookSchema,
    eventType: string,
    payload: Record<string, unknown>,
    environment: Network
  ) => {
    const startTime = Date.now();

    const webhookId = `wh+evt_${nanoid(25)}`;

    const webhookPayload = {
      id: webhookId,
      object: "event",
      type: eventType,
      created: Math.floor(Date.now() / 1000),
      data: payload,
      livemode: environment === "mainnet",
    };

    const signature = this.generateSignature(
      JSON.stringify(webhookPayload),
      webhook.secretHash
    );

    try {
      const response = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "StellarTools-Webhooks/1.0",
          "X-Stellar-Signature": signature,
          "X-Stellar-Event": eventType,
        },
        body: JSON.stringify(webhookPayload),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      const duration = Date.now() - startTime;
      const responseText = await response.text().catch(() => "");

      await postWebhookLog(webhook.id, {
        id: webhookId,
        organizationId: webhook.organizationId,
        eventType,
        payload: webhookPayload,
        statusCode: response.status,
        errorMessage: response.ok ? null : responseText,
        environment,
      });

      if (!response.ok) {
        throw new Error(
          `Webhook delivery failed: ${response.status} - ${responseText}`
        );
      }

      console.log(
        `✅ Webhook delivered to ${webhook.url} in ${duration}ms (${response.status})`
      );

      return { success: true, webhookId: webhook.id };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      await postWebhookLog(webhook.id, {
        organizationId: webhook.organizationId,
        eventType,
        payload: webhookPayload,
        statusCode: null,
        errorMessage,
        environment,
      });

      console.error(
        `❌ Webhook delivery failed to ${webhook.url} after ${duration}ms:`,
        errorMessage
      );

      throw error;
    }
  };
}
