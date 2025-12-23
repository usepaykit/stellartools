import { ApiClient } from "../api-client";
import { Product } from "../schema/product";
import { ERR, OK, tryCatchAsync } from "../utils";

export class ProductApi {
  constructor(private readonly apiClient: ApiClient) {}

  async retrieve(productId: string) {
    const [response, error] = await tryCatchAsync(
      this.apiClient.get<Product>(`/api/products/${productId}`)
    );

    if (error) {
      return ERR(new Error(`Failed to retrieve product: ${error.message}`));
    }

    return OK(response.value);
  }
}
