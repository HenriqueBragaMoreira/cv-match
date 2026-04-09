import { describe, expect, it, vi } from "vitest";

const mockOpenAIModel = { modelId: "gpt-4o-mini", provider: "openai" };
const mockAnthropicModel = {
  modelId: "claude-sonnet-4-20250514",
  provider: "anthropic",
};
const mockGoogleModel = {
  modelId: "gemini-2.0-flash",
  provider: "google",
};

const mockOpenAIInstance = vi.fn(() => mockOpenAIModel);
const mockAnthropicInstance = vi.fn(() => mockAnthropicModel);
const mockGoogleInstance = vi.fn(() => mockGoogleModel);

vi.mock("@ai-sdk/openai", () => ({
  createOpenAI: vi.fn(() => mockOpenAIInstance),
}));

vi.mock("@ai-sdk/anthropic", () => ({
  createAnthropic: vi.fn(() => mockAnthropicInstance),
}));

vi.mock("@ai-sdk/google", () => ({
  createGoogleGenerativeAI: vi.fn(() => mockGoogleInstance),
}));

import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createProviderModel } from "./provider-factory.js";

describe("createProviderModel", () => {
  describe("openai provider", () => {
    it("creates an OpenAI provider with the given API key", () => {
      createProviderModel("openai", "sk-test-key-123");

      expect(createOpenAI).toHaveBeenCalledWith({ apiKey: "sk-test-key-123" });
    });

    it("uses gpt-4o-mini as the default model", () => {
      createProviderModel("openai", "sk-test-key-123");

      expect(mockOpenAIInstance).toHaveBeenCalledWith("gpt-4o-mini");
    });

    it("returns the model instance", () => {
      const result = createProviderModel("openai", "sk-test-key-123");

      expect(result).toBe(mockOpenAIModel);
    });
  });

  describe("anthropic provider", () => {
    it("creates an Anthropic provider with the given API key", () => {
      createProviderModel("anthropic", "sk-ant-test-key-456");

      expect(createAnthropic).toHaveBeenCalledWith({
        apiKey: "sk-ant-test-key-456",
      });
    });

    it("uses claude-sonnet-4-20250514 as the default model", () => {
      createProviderModel("anthropic", "sk-ant-test-key-456");

      expect(mockAnthropicInstance).toHaveBeenCalledWith(
        "claude-sonnet-4-20250514"
      );
    });

    it("returns the model instance", () => {
      const result = createProviderModel("anthropic", "sk-ant-test-key-456");

      expect(result).toBe(mockAnthropicModel);
    });
  });

  describe("google provider", () => {
    it("creates a Google provider with the given API key", () => {
      createProviderModel("google", "AIza-test-key-789");

      expect(createGoogleGenerativeAI).toHaveBeenCalledWith({
        apiKey: "AIza-test-key-789",
      });
    });

    it("uses gemini-2.0-flash as the default model", () => {
      createProviderModel("google", "AIza-test-key-789");

      expect(mockGoogleInstance).toHaveBeenCalledWith("gemini-2.0-flash");
    });

    it("returns the model instance", () => {
      const result = createProviderModel("google", "AIza-test-key-789");

      expect(result).toBe(mockGoogleModel);
    });
  });
});
