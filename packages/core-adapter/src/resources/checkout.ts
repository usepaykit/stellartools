import { ApiClient } from "../api-client";
import {
  Checkout,
  CreateCheckout,
  UpdateCheckout,
  createCheckoutSchema,
  updateCheckoutSchema,
} from "../schema/checkout";
import { ERR, OK, tryCatchAsync } from "../utils";

export class CheckoutApi {
  constructor(private apiClient: ApiClient) {}

  async create(params: CreateCheckout) {
    const { error, data } = createCheckoutSchema.safeParse(params);

    if (error) {
      return ERR(new Error(`Invalid parameters: ${error.message}`));
    }

    const [response, checkoutError] = await tryCatchAsync(
      this.apiClient.post<Checkout>(`/checkouts`, {
        body: JSON.stringify(data),
      })
    );

    if (checkoutError) {
      return ERR(
        new Error(`Failed to create checkout: ${checkoutError.message}`)
      );
    }

    return OK(response.value);
  }

  async retrieve(id: string) {
    const [response, error] = await tryCatchAsync(
      this.apiClient.get<Checkout>(`/checkouts/${id}`)
    );

    if (error) {
      return ERR(new Error(`Invalid parameters: ${error.message}`));
    }

    return OK(response.value);
  }

  async update(id: string, params: UpdateCheckout) {
    const { error, data } = updateCheckoutSchema.safeParse(params);

    if (error) {
      return ERR(new Error(`Invalid parameters: ${error.message}`));
    }

    const [response, checkoutError] = await tryCatchAsync(
      this.apiClient.put<Checkout>(`/checkouts/${id}`, {
        body: JSON.stringify(data),
      })
    );

    if (checkoutError) {
      return ERR(
        new Error(`Failed to update checkout: ${checkoutError.message}`)
      );
    }

    return OK(response.value);
  }

  async delete(id: string) {
    const [response, error] = await tryCatchAsync(
      this.apiClient.delete<Checkout>(`/checkouts/${id}`)
    );

    if (error) {
      return ERR(new Error(`Failed to delete checkout: ${error.message}`));
    }

    return OK(response.value);
  }
}
