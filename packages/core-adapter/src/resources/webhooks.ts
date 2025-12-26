import crypto from "crypto";

import { ApiClient } from "../api-client";
import {
  CreateWebhook,
  UpdateWebhook,
  Webhook,
  createWebhookSchema,
  updateWebhookSchema,
} from "../schema/webhooks";
import { ERR, OK, tryCatchAsync } from "../utils";

export class WebhookApi {
  constructor(private apiClient: ApiClient) {}

  async create(params: CreateWebhook) {
    const { error, data } = createWebhookSchema.safeParse(params);

    if (error) {
      return ERR(new Error(`Invalid parameters: ${error.message}`));
    }

    const [response, webhookError] = await tryCatchAsync(
      this.apiClient.post<Webhook>("/webhooks", { body: JSON.stringify(data) })
    );

    if (webhookError) {
      return ERR(
        new Error(`Failed to create webhook: ${webhookError.message}`)
      );
    }

    return OK(response.value);
  }

  async retrieve(id: string) {
    const [response, error] = await tryCatchAsync(
      this.apiClient.get<Webhook>(`/webhooks/${id}`)
    );

    if (error) {
      return ERR(new Error(`Failed to retrieve webhook: ${error.message}`));
    }

    return OK(response.value);
  }

  async update(id: string, params: UpdateWebhook) {
    const { error, data } = updateWebhookSchema.safeParse(params);

    if (error) {
      return ERR(new Error(`Invalid parameters: ${error.message}`));
    }

    const [response, webhookError] = await tryCatchAsync(
      this.apiClient.put<Webhook>(`/webhooks/${id}`, {
        body: JSON.stringify(data),
      })
    );

    if (webhookError) {
      return ERR(
        new Error(`Failed to update webhook: ${webhookError.message}`)
      );
    }

    return OK(response.value);
  }

  async delete(id: string) {
    const [response, webhookError] = await tryCatchAsync(
      this.apiClient.delete<Webhook>(`/webhooks/${id}`)
    );

    if (webhookError) {
      return ERR(
        new Error(`Failed to delete webhook: ${webhookError.message}`)
      );
    }

    return OK(response.value);
  }

  generateSignature(payload: string, secret: string): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const signedPayload = `${timestamp}.${payload}`;

    const hmac = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");

    return `t=${timestamp},v1=${hmac}`;
  }

  verifySignature(
    payload: string,
    signature: string,
    secret: string,
    tolerance: number = 300
  ): boolean {
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
  }
}
