import { StellarTools } from "@stellartools/core";
import { UploadThingError, createUploadthing } from "uploadthing/server";
import type { ExpandedRouteConfig } from "uploadthing/types";

import {
  StellarMetadata,
  StellarUploadthingOptions,
  stellarUploadthingOptionsSchema,
} from "./schema";

export class StellarUploadThingAdapter {
  private stellar: StellarTools;
  private options: StellarUploadthingOptions;

  private baseFactory = createUploadthing();

  constructor(opts: StellarUploadthingOptions) {
    const { error, data } = stellarUploadthingOptionsSchema.safeParse(opts);
    if (error) throw new Error(`Invalid options: ${error.message}`);

    this.options = data;
    this.stellar = new StellarTools({ apiKey: data.apiKey });
  }

  public routerFactory<T extends ExpandedRouteConfig>(
    routeConfig: T,
    routeOptions?: Parameters<typeof this.baseFactory>[1]
  ) {
    const baseBuilder = this.baseFactory(routeConfig, routeOptions);

    return {
      input: baseBuilder.input.bind(baseBuilder),

      middleware: <TOutput extends Record<string, unknown>>(
        userMiddleware?: (opts: {
          req: Request;
          files: Array<{ name: string; size: number; type: string }>;
          input: unknown;
        }) => Promise<TOutput> | TOutput
      ) => {
        const wrappedMiddleware = async (opts: {
          req: Request;
          files: Array<{ name: string; size: number; type: string }>;
          input: unknown;
        }) => {
          const product = await this.stellar.product.retrieve(
            this.options.productId
          );
          if (!product.ok)
            throw new UploadThingError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Stellar product not found",
            });

          const customerId =
            opts.req?.headers?.get?.("x-customer-id") ??
            (opts.req?.headers as unknown as Record<string, string>)?.[
              "x-customer-id"
            ];

          if (!customerId) {
            throw new UploadThingError({
              code: "FORBIDDEN",
              message: "Missing x-customer-id header",
            });
          }

          const result = await this.stellar.credit.consume(customerId, {
            productId: this.options.productId,
            rawAmount: opts.files.reduce(
              (sum: number, f: any) => sum + f.size,
              0
            ),
            reason: "Upload started",
            metadata: { fileCount: opts.files.length },
          });

          if (!result.ok) {
            throw new UploadThingError({
              code: "FORBIDDEN",
              message: result.error?.message ?? "Insufficient credits",
            });
          }

          try {
            const userMetadata = userMiddleware
              ? await userMiddleware(opts)
              : ({} as TOutput);

            return {
              ...userMetadata,
              __stellar: {
                customerId,
                requiredCredits: result.value.creditsToDeduct,
              } satisfies StellarMetadata["__stellar"],
            };
          } catch (err) {
            // Pass refund data through the Error object if user middleware crashes
            throw new UploadThingError({
              code: "INTERNAL_SERVER_ERROR",
              message: err instanceof Error ? err.message : "Middleware failed",
              data: {
                __stellar: {
                  customerId,
                  requiredCredits: result.value.creditsToDeduct,
                },
              },
            });
          }
        };

        return baseBuilder.middleware(wrappedMiddleware as any);
      },

      onUploadError: (
        fn?: (opts: {
          req: Request;
          error: UploadThingError;
          fileKey: string;
        }) => Promise<void> | void
      ) => {
        const wrappedOnUploadError = async (opts: any) => {
          // Only refund if the error contains the __stellar data we attached in middleware
          const refundData = (opts.error.data as any)?.__stellar;

          if (refundData?.customerId && refundData?.requiredCredits) {
            if (this.options.debug) {
              console.log(
                `[Stellar] Refunding ${refundData.requiredCredits} to ${refundData.customerId}`
              );
            }

            await this.stellar.credit.refund(refundData.customerId, {
              productId: this.options.productId,
              amount: refundData.requiredCredits,
              reason: "Upload failed: automatic refund",
            });
          }

          if (fn) await fn(opts);
        };

        return baseBuilder.onUploadError(wrappedOnUploadError);
      },

      onUploadComplete: <TReturn extends Record<string, unknown> | void>(
        fn: (opts: any) => Promise<TReturn> | TReturn
      ) => {
        const wrappedOnUploadComplete = async (opts: any) => {
          if (this.options.debug)
            console.log(
              `[Stellar] Successfully used ${opts.metadata.__stellar?.requiredCredits} credits.`
            );
          return await fn(opts);
        };
        return baseBuilder.onUploadComplete(wrappedOnUploadComplete as any);
      },
    } as unknown as ReturnType<typeof createUploadthing>;
  }
}
