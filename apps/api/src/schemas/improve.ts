import { z } from "zod";

import { aiProvider, analyzeResponseSchema } from "./analyze.js";

export const improveRequestSchema = z.object({
  resumeText: z
    .string()
    .min(1, "Resume text is required")
    .max(100_000, "Resume text must not exceed 100 000 characters"),
  jobDescription: z
    .string()
    .min(1, "Job description is required")
    .max(50_000, "Job description must not exceed 50 000 characters"),
  analysisResult: analyzeResponseSchema,
  provider: aiProvider,
  apiKey: z.string().min(1, "API key is required"),
});

export type ImproveRequest = z.infer<typeof improveRequestSchema>;
