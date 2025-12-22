// src/createStellarAI.ts
import { generateTextWrapper } from "./wrappers/generateText";
import { streamTextWrapper } from "./wrappers/streamText";
import { embedWrapper } from "./wrappers/embed";
import { generateObjectWrapper } from "./wrappers/generateObject";
import { streamObjectWrapper } from "./wrappers/streamObject";

export function createStellarAI({
  apiKey,
  customerId,
  model,
}: {
  apiKey: string;
  customerId: string;
  model: any;
}) {
  return {
    generateText: (options: any) =>
      generateTextWrapper({
        model,
        apiKey,
        customerId,
        options,
      }),

    streamText: (options: any) =>
      streamTextWrapper({
        model,
        apiKey,
        customerId,
        options,
      }),

    embed: (options: any) =>
      embedWrapper({
        model,
        apiKey,
        customerId,
        options,
      }),

    generateObject: function<T>(options: any) {
      return generateObjectWrapper<T>({
        model,
        apiKey,
        customerId,
        options,
      });
    },

    streamObject: function<T>(options: any) {
      return streamObjectWrapper<T>({
        model,
        apiKey,
        customerId,
        options,
      });
    },
  };
}
