import { resolveApiKey } from "@/actions/apikey";
import { retrievePayment } from "@/actions/payment";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, params: { id: string }) => {
  const { id } = params;

  const apiKey = req.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json({ error: "API key is required" }, { status: 400 });
  }

  const { organizationId } = await resolveApiKey(apiKey);

  const payment = await retrievePayment(id, organizationId);

  return NextResponse.json({ data: payment });
};
