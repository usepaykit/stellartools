import { pgTable, text, timestamp, boolean, integer, jsonb, pgEnum, unique, index } from 'drizzle-orm/pg-core';

// Enums
export const networkEnum = pgEnum('network', ['testnet', 'mainnet']);
export const roleEnum = pgEnum('role', ['owner', 'admin', 'developer', 'viewer']);
export const billingTypeEnum = pgEnum('billing_type', ['one_time', 'recurring', 'metered']);
export const stellarAccountTypeEnum = pgEnum('stellar_account_type', ['custodial', 'external']);
export const checkoutStatusEnum = pgEnum('checkout_status', ['open', 'completed', 'expired', 'failed']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'confirmed', 'failed']);
export const assetCodeEnum = pgEnum('asset_code', ['XLM', 'USDC']);

// 1. Identity & Access Management

export const accounts = pgTable('accounts', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    userName: text('user_name').notNull(),
    profile: jsonb('profile').$type<{
        first_name?: string;
        last_name?: string;
        avatar_url?: string;
    }>(),
    phoneNumber: text('phone_number'),
    sso: jsonb('sso').$type<{
        provider: string;
        provider_id: string;
    }>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    metadata: jsonb('metadata').$type<object>().default({}),
});

export const organizations = pgTable('organizations', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    ownerAccountId: text('owner_account_id').notNull().references(() => accounts.id),
    settings: jsonb('settings').$type<{
        default_currency: string;
        stellar_network: 'testnet' | 'mainnet';
        statement_descriptor?: string;
    }>().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    metadata: jsonb('metadata').$type<object>().default({}),
});

export const teamMembers = pgTable('team_members', {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => organizations.id),
    accountId: text('account_id').notNull().references(() => accounts.id),
    role: roleEnum('role').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    metadata: jsonb('metadata').$type<object>().default({}),
}, (table) => ({
    uniqueOrgAccount: unique().on(table.organizationId, table.accountId),
}));

export const apiKeys = pgTable('api_keys', {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => organizations.id),
    name: text('name').notNull(),
    keyHash: text('key_hash').notNull().unique(),
    scope: jsonb('scope').$type<string[]>().notNull(),
    isRevoked: boolean('is_revoked').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    lastUsedAt: timestamp('last_used_at'),
    metadata: jsonb('metadata').$type<object>().default({}),
});

// 2. Stellar & Payments

export const assets = pgTable('assets', {
    id: text('id').primaryKey(),
    code: assetCodeEnum('code').notNull(),
    issuer: text('issuer'),
    network: networkEnum('network').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    metadata: jsonb('metadata').$type<object>().default({}),
}, (table) => ({
    uniqueCodeIssuerNetwork: unique().on(table.code, table.issuer, table.network),
}));


export const products = pgTable('products', {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => organizations.id),
    name: text('name').notNull(),
    description: text('description'),
    assetId: text('asset_id').notNull().references(() => assets.id),
    billingType: billingTypeEnum('billing_type').notNull(),
    active: boolean('active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    metadata: jsonb('metadata').$type<object>().default({}),
});

export const customers = pgTable('customers', {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => organizations.id),
    email: text('email'),
    name: text('name'),
    phone: text('phone'),
    appMetadata: jsonb('app_metadata').$type<object>().default({}),
    internalMetadata: jsonb('internal_metadata').$type<object>().default({}),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    uniqueOrgEmail: unique().on(table.organizationId, table.email),
}));

export const stellarAccounts = pgTable('stellar_accounts', {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => organizations.id),
    customerId: text('customer_id').references(() => customers.id),
    publicKey: text('public_key').notNull(),
    memo: text('memo'),
    type: stellarAccountTypeEnum('type').notNull(),
    network: networkEnum('network').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    metadata: jsonb('metadata').$type<object>().default({}),
}, (table) => ({
    uniquePublicKeyNetwork: unique().on(table.publicKey, table.network),
}));


export const checkouts = pgTable('checkouts', {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => organizations.id),
    apiKeyId: text('api_key_id').references(() => apiKeys.id),
    customerId: text('customer_id').references(() => customers.id),
    priceId: text('price_id').notNull(),
    status: checkoutStatusEnum('status').notNull(),
    paymentUrl: text('payment_url').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    metadata: jsonb('metadata').$type<object>().default({}),
});

export const payments = pgTable('payments', {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => organizations.id),
    checkoutId: text('checkout_id').references(() => checkouts.id),
    customerId: text('customer_id').references(() => customers.id),
    stellarAccountId: text('stellar_account_id').notNull().references(() => stellarAccounts.id),
    assetId: text('asset_id').notNull().references(() => assets.id),
    amount: integer('amount').notNull(),
    transactionHash: text('transaction_hash').notNull().unique(),
    status: paymentStatusEnum('status').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


export const usageRecords = pgTable('usage_records', {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => organizations.id),
    apiKeyId: text('api_key_id').notNull().references(() => apiKeys.id),
    customerId: text('customer_id').references(() => customers.id),
    feature: text('feature').notNull(),
    quantity: integer('quantity').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    metadata: jsonb('metadata').$type<object>().default({}),
}, (table) => ({
    orgFeatureCreatedIdx: index('usage_records_org_feature_created_idx').on(
        table.organizationId,
        table.feature,
        table.createdAt
    ),
}));

export const webhooks = pgTable('webhooks', {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => organizations.id),
    url: text('url').notNull(),
    secret: text('secret').notNull(),
    events: jsonb('events').$type<string[]>().notNull(),
    isDisabled: boolean('is_disabled').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const webhookLogs = pgTable('webhook_logs', {
    id: text('id').primaryKey(),
    webhookId: text('webhook_id').notNull().references(() => webhooks.id),
    eventType: text('event_type').notNull(),
    payload: jsonb('payload').$type<object>().notNull(),
    statusCode: integer('status_code'),
    errorMessage: text('error_message'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
