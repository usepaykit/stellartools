// src/wrappers/generateObject.ts
import { generateObject } from "ai";
import { checkBilling } from "../billings";
import { CheckoutResult, ObjectResult } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateObjectWrapper<T = any>({
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
}): Promise<ObjectResult<T> | CheckoutResult> {
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
  const result = await (generateObject as any)({
    ...options,
    model,
  });

  return {
    type: "object",
    object: result.object as T,
  };
}
