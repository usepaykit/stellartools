// src/wrappers/streamObject.ts
import { streamObject } from "ai";
import { checkBilling } from "../billings";
import { CheckoutResult, StreamObjectSuccess } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function streamObjectWrapper<T = any>({
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
}): Promise<StreamObjectSuccess<T> | CheckoutResult> {
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
  const streamResult = (streamObject as any)({
    ...options,
    model,
  });

  return {
    type: "stream",
    stream: streamResult as StreamObjectSuccess<T>["stream"],
  };
}
