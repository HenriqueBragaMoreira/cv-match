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

export const analyzeResponseSchema = z.object({
  score: z
    .int()
    .min(0, "Score must be at least 0")
    .max(100, "Score must be at most 100"),
  strengths: z.array(z.string()).min(1, "At least one strength is required"),
  weaknesses: z.array(z.string()).min(1, "At least one weakness is required"),
  suggestions: z
    .array(z.string())
    .min(1, "At least one suggestion is required"),
  keywords: z.object({
    present: z.array(z.string()),
    missing: z.array(z.string()),
  }),
  breakdown: z.object({
    experience: z
      .int()
      .min(0, "Experience score must be at least 0")
      .max(100, "Experience score must be at most 100"),
    skills: z
      .int()
      .min(0, "Skills score must be at least 0")
      .max(100, "Skills score must be at most 100"),
    education: z
      .int()
      .min(0, "Education score must be at least 0")
      .max(100, "Education score must be at most 100"),
    certifications: z
      .int()
      .min(0, "Certifications score must be at least 0")
      .max(100, "Certifications score must be at most 100"),
  }),
  formattingWarnings: z.array(z.string()),
});

export type AnalyzeResponse = z.infer<typeof analyzeResponseSchema>;
