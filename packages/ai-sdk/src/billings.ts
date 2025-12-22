// src/billing.ts
export async function checkBilling({
    apiKey,
    customerId,
    usage,
  }: {
    apiKey: string;
    customerId: string;
    usage: number;
  }): Promise<
    | { allowed: true }
    | { allowed: false; checkoutUrl: string }
  > {
    const res = await fetch(
      "https://api.stellartools.com/billing/check",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          usage,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Billing check failed");
    }

    return res.json();
  }
