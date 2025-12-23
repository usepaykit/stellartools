import { ApiClient } from "../api-client";
import { CreateRefund, Refund, createRefundSchema } from "../schema/refund";
import { ERR, OK, tryCatchAsync } from "../utils";

export class RefundApi {
  constructor(private apiClient: ApiClient) {}

  async create(params: CreateRefund) {
    const { error, data } = createRefundSchema.safeParse(params);

    if (error) {
      return ERR(new Error(`Invalid parameters: ${error.message}`));
    }

    const [response, refundError] = await tryCatchAsync(
      this.apiClient.post<Refund>("/refunds", {
        body: JSON.stringify(data),
      })
    );

    if (refundError) {
      return ERR(new Error(`Failed to create refund: ${refundError.message}`));
    }

    return OK(response.value);
  }
}
