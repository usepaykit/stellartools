// src/wrappers/streamText.ts
import { streamText } from "ai";
import { checkBilling } from "../billings";
import { CheckoutResult, StreamTextSuccess } from "../types";

export async function streamTextWrapper({
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
}): Promise<StreamTextSuccess | CheckoutResult> {
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
  const streamResult = (streamText as any)({
    ...options,
    model,
  });

  return {
    type: "stream",
    stream: streamResult as StreamTextSuccess["stream"],
  };
}
