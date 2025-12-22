// src/wrappers/generateText.ts
import { generateText } from "ai";
import { checkBilling } from "../billings";
import { CheckoutResult, TextResult } from "../types";

export async function generateTextWrapper({
  model,
  apiKey,
  customerId,
  options,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any;
  apiKey: string;
  customerId: string;
  options: Parameters<typeof generateText>[0];
}): Promise<TextResult | CheckoutResult> {
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

  const result = await generateText({
    ...options,
    model,
  });

  return {
    type: "text",
    text: result.text,
  };
}
