import { z } from "zod";

export const aiProvider = z.enum(["openai", "anthropic", "google"]);

export type AiProvider = z.infer<typeof aiProvider>;

export const analyzeRequestSchema = z.object({
  resumeText: z
    .string()
    .min(1, "Resume text is required")
    .max(100_000, "Resume text must not exceed 100 000 characters"),
  jobDescription: z
    .string()
    .min(1, "Job description is required")
    .max(50_000, "Job description must not exceed 50 000 characters"),
  provider: aiProvider,
  apiKey: z.string().min(1, "API key is required"),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
