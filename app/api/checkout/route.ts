import { resolveApiKey } from "@/actions/apikey";
import { postCheckout } from "@/actions/checkout";
import { postCustomer, retrieveCustomer } from "@/actions/customers";
import { Checkout, Customer } from "@/db";
import { schemaFor } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const postCheckoutSchema = schemaFor<
  Partial<Checkout> & { customerEmail?: string }
>()(
  z.object({
    priceId: z.string(),
    customerId: z.string().optional(),
    metadata: z.record(z.string(), z.any()).default({}),
    customerEmail: z.email().optional(),
  })
);

export const POST = async (req: NextRequest) => {
  const apiKey = req.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json({ error: "API key is required" }, { status: 400 });
  }

  const { error, data } = postCheckoutSchema.safeParse(await req.json());

  if (error) return NextResponse.json({ error }, { status: 400 });

  const { organizationId, environment } = await resolveApiKey(apiKey);

  let customer: Customer | null = null;

  if (data.customerEmail) {
    customer = await retrieveCustomer(data.customerEmail, organizationId);
  } else {
    customer = await postCustomer({
      email: data.customerEmail as string,
      name: data.customerEmail?.split("@")[0],
      organizationId,
      environment,
      ...(data.metadata && { appMetadata: data.metadata }),
    });
  }

  const checkout = await postCheckout({
    organizationId,
    environment,
    customerId: customer?.id,
    ...data,
  });

  return NextResponse.json({ data: checkout });
};
