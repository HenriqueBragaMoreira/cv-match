import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { AiProvider } from "../schemas/index.js";

const DEFAULT_MODELS: Record<AiProvider, string> = {
  openai: "gpt-4o-mini",
  anthropic: "claude-sonnet-4-20250514",
  google: "gemini-2.0-flash",
};

export function createProviderModel(provider: AiProvider, apiKey: string) {
  switch (provider) {
    case "openai": {
      const openai = createOpenAI({ apiKey });
      return openai(DEFAULT_MODELS.openai);
    }
    case "anthropic": {
      const anthropic = createAnthropic({ apiKey });
      return anthropic(DEFAULT_MODELS.anthropic);
    }
    case "google": {
      const google = createGoogleGenerativeAI({ apiKey });
      return google(DEFAULT_MODELS.google);
    }
  }
}
