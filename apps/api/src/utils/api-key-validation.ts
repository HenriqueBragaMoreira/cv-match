import type { AiProvider } from "../schemas/analyze.js";

const API_KEY_RULES: Record<AiProvider, { pattern: RegExp; hint: string }> = {
  openai: {
    pattern: /^sk-.+/,
    hint: 'OpenAI keys start with "sk-"',
  },
  anthropic: {
    pattern: /^sk-ant-.+/,
    hint: 'Anthropic keys start with "sk-ant-"',
  },
  google: {
    pattern: /^AIza.+/,
    hint: 'Google AI keys start with "AIza"',
  },
};

export function validateApiKeyFormat(
  provider: AiProvider,
  apiKey: string
): { valid: true } | { valid: false; hint: string } {
  const rule = API_KEY_RULES[provider];
  if (rule.pattern.test(apiKey)) {
    return { valid: true };
  }
  return { valid: false, hint: rule.hint };
}
