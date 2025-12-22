import { embed } from "ai";
import { checkBilling } from "../billings";
import { CheckoutResult, EmbedResult } from "../types";

export async function embedWrapper({
  model,
  apiKey,
  customerId,
  options,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any;
  apiKey: string;
  customerId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any;
}): Promise<EmbedResult | CheckoutResult> {
  const billing = await checkBilling({
    apiKey,
    customerId,
    usage: 1,
  });

  if (!billing.allowed) {
    return {
      type: "checkout",
      checkout: { url: billing.checkoutUrl },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (embed as any)({
    ...options,
    model,
  });

  return {
    type: "embedding",
    embedding: result.embedding as EmbedResult["embedding"],
  };
}
