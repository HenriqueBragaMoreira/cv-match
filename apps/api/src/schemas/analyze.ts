import { z } from "zod";
import { validateApiKeyFormat } from "../utils/api-key-validation.js";

export const aiProvider = z.enum(["openai", "anthropic", "google"]);

export type AiProvider = z.infer<typeof aiProvider>;

const MAX_RESUME_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_RESUME_EXTENSIONS = [".pdf", ".tex"] as const;

export const resumeFileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, "Resume file must not be empty")
  .refine(
    (file) => file.size <= MAX_RESUME_FILE_SIZE,
    "Resume file must not exceed 10 MB"
  )
  .refine(
    (file) =>
      ACCEPTED_RESUME_EXTENSIONS.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      ),
    "Only .pdf and .tex files are accepted"
  );

export const analyzeRequestSchema = z
  .object({
    resumeFile: resumeFileSchema,
    jobDescription: z
      .string()
      .min(1, "Job description is required")
      .max(50_000, "Job description must not exceed 50 000 characters"),
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
