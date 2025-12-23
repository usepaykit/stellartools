import { createUploadthing } from "uploadthing/server";

import { StellarUploadThingAdapter } from "./provider";
import { StellarUploadthingOptions } from "./schema";

export const createStellarUploadthing = (opts: StellarUploadthingOptions) => {
  const adapter = new StellarUploadThingAdapter(opts);

  return adapter.routerFactory as unknown as ReturnType<
    typeof createUploadthing
  >;
};
