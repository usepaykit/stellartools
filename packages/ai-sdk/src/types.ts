// src/types.ts
import type {
    StreamTextResult,
    StreamObjectResult,
} from "ai";

export type CheckoutResult = {
    type: "checkout";
    checkout: {
        url: string;
    };
};

export type TextResult = {
    type: "text";
    text: string;
};

export type EmbedResult = {
    type: "embedding";
    embedding: number[];
};

export type ObjectResult<T> = {
    type: "object";
    object: T;
};

export type StreamTextSuccess = {
    type: "stream";
    stream: StreamTextResult<never, string>;
};

export type StreamObjectSuccess<T> = {
    type: "stream";
    stream: StreamObjectResult<Partial<T>, T, T>;
};

export type StellarResult<T> = T | CheckoutResult;
