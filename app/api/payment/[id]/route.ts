import { resolveApiKey } from "@/actions/apikey";
import { refreshTxStatus, retrievePayment } from "@/actions/payment";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, params: { id: string }) => {
  const { id } = params;

  const apiKey = req.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json({ error: "API key is required" }, { status: 400 });
  }

  const { organizationId, environment } = await resolveApiKey(apiKey);

  const payment = await retrievePayment(id, organizationId);

  // Refresh payment status, mostly needed by adapters to get the latest status.
  await refreshTxStatus(
    id,
    payment.transactionHash,
    organizationId,
    environment
  );

  return NextResponse.json({ data: payment });
};
