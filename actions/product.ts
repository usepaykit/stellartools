"use server";

import { postAsset } from "@/actions/asset";
import { Network, Product, assets, db, products } from "@/db";
import { and, eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";

// Helper function to find or create an asset
async function findOrCreateAsset(
    code: "XLM" | "USDC",
    network: Network
): Promise<string> {
    // Try to find existing asset
    const [existingAsset] = await db
        .select()
        .from(assets)
        .where(and(eq(assets.code, code), eq(assets.network, network)))
        .limit(1);

    if (existingAsset) {
        return existingAsset.id;
    }

    // Create new asset if not found
    const newAsset = await postAsset({
        code,
        network,
        issuer: code === "XLM" ? null : undefined, // XLM has no issuer
    });

    return newAsset.id;
}

export const postProduct = async (params: Partial<Product>) => {
    const [product] = await db
        .insert(products)
        .values({ id: `prod_${nanoid(25)}`, ...params } as Product)
        .returning();

    return product;
};

export const retrieveProducts = async (
    organizationId: string,
    environment: Network
) => {
    const productsList = await db
        .select()
        .from(products)
        .where(
            and(
                eq(products.organizationId, organizationId),
                eq(products.environment, environment)
            )
        );

    // Fetch assets for all products
    if (productsList.length === 0) {
        return [];
    }

    const assetIds = [...new Set(productsList.map((p) => p.assetId))];
    const assetsList = await db
        .select()
        .from(assets)
        .where(inArray(assets.id, assetIds));

    // Create a map for quick lookup
    const assetMap = new Map(assetsList.map((a) => [a.id, a]));

    // Combine products with their assets
    return productsList.map((product) => ({
        ...product,
        asset: assetMap.get(product.assetId),
    }));
};

export const retrieveProduct = async (id: string, organizationId: string) => {
    const [product] = await db
        .select()
        .from(products)
        .where(
            and(eq(products.id, id), eq(products.organizationId, organizationId))
        )
        .limit(1);

    if (!product) throw new Error("Product not found");

    return product;
};

export const putProduct = async (
    id: string,
    organizationId: string,
    retUpdate: Partial<Product>
) => {
    const [product] = await db
        .update(products)
        .set({ ...retUpdate, updatedAt: new Date() })
        .where(
            and(eq(products.id, id), eq(products.organizationId, organizationId))
        )
        .returning();

    if (!product) throw new Error("Product not found");

    return product;
};

export const deleteProduct = async (id: string, organizationId: string) => {
    await db
        .delete(products)
        .where(
            and(eq(products.id, id), eq(products.organizationId, organizationId))
        )
        .returning();

    return null;
};

// Export the helper for use in mutations
export { findOrCreateAsset };

