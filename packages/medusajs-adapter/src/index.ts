import { ModuleProvider, Modules } from "@medusajs/framework/utils";
import {
  StellarMedusaAdapter,
  type StellarMedusaAdapterOptions,
} from "./provider";

export default ModuleProvider(Modules.PAYMENT, {
  services: [StellarMedusaAdapter],
});

export { StellarMedusaAdapter, StellarMedusaAdapterOptions };
