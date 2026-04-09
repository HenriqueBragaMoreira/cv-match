import { z } from "zod";

import {
  aiProvider,
  analyzeResponseSchema,
  resumeFileSchema,
} from "./analyze.js";
import { validateApiKeyFormat } from "../utils/api-key-validation.js";

export const improveRequestSchema = z
  .object({
    resumeFile: resumeFileSchema,
    jobDescription: z
      .string()
      .min(1, "Job description is required")
      .max(50_000, "Job description must not exceed 50 000 characters"),
    analysisResult: analyzeResponseSchema,
    provider: aiProvider,
    apiKey: z.string().min(1, "API key is required"),
  })
  .superRefine((data, ctx) => {
    const result = validateApiKeyFormat(data.provider, data.apiKey);
    if (!result.valid) {
      ctx.addIssue({
        code: "custom",
        message: `Invalid API key format: ${result.hint}`,
        path: ["apiKey"],
      });
    }
  });

export type ImproveRequest = z.infer<typeof improveRequestSchema>;

export const cvImprovementSchema = z.object({
  improvedResume: z.string().min(1, "Improved resume text is required"),
  changes: z.string().min(1, "Changes summary is required"),
});

export const improveResponseSchema = cvImprovementSchema.extend({
  newScore: z
    .int()
    .min(0, "Score must be at least 0")
    .max(100, "Score must be at most 100"),
});

export type ImproveResponse = z.infer<typeof improveResponseSchema>;
