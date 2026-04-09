import { Hono } from "hono";
import { generateObject } from "ai";
import {
  improveRequestSchema,
  cvImprovementSchema,
  analyzeResponseSchema,
} from "../schemas/index.js";
import {
  CV_IMPROVEMENT_SYSTEM_PROMPT,
  buildCvImprovementUserPrompt,
  RE_SCORING_SYSTEM_PROMPT,
  buildReScoringUserPrompt,
} from "../prompts/index.js";
import { createProviderModel } from "../services/index.js";
import { extractTextFromPdf, extractTextFromLatex } from "../utils/index.js";
import { AppError } from "../errors.js";

const improve = new Hono();

improve.post("/", async (c) => {
  const formData = await c.req.formData();

  const analysisResultRaw = formData.get("analysisResult");
  const analysisResult =
    typeof analysisResultRaw === "string"
      ? JSON.parse(analysisResultRaw)
      : analysisResultRaw;

  const parsed = improveRequestSchema.parse({
    resumeFile: formData.get("resumeFile"),
    jobDescription: formData.get("jobDescription"),
    analysisResult,
    provider: formData.get("provider"),
    apiKey: formData.get("apiKey"),
  });

  const resumeText = await extractResumeText(parsed.resumeFile);
  const model = createProviderModel(parsed.provider, parsed.apiKey);

  try {
    const { object: improvement } = await generateObject({
      model,
      schema: cvImprovementSchema,
      system: CV_IMPROVEMENT_SYSTEM_PROMPT,
      prompt: buildCvImprovementUserPrompt(
        resumeText,
        parsed.jobDescription,
        JSON.stringify(parsed.analysisResult)
      ),
    });

    const { object: reScoring } = await generateObject({
      model,
      schema: analyzeResponseSchema,
      system: RE_SCORING_SYSTEM_PROMPT,
      prompt: buildReScoringUserPrompt(
        improvement.improvedResume,
        parsed.jobDescription
      ),
    });

    return c.json({
      improvedResume: improvement.improvedResume,
      changes: improvement.changes,
      newScore: reScoring.score,
    });
  } catch (error) {
    throw toProviderError(error);
  }
});

async function extractResumeText(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  try {
    if (name.endsWith(".pdf")) {
      const buffer = await file.arrayBuffer();
      return await extractTextFromPdf(buffer);
    }
    const raw = await file.text();
    return extractTextFromLatex(raw);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to extract text from resume file";
    throw AppError.validation(message);
  }
}

function toProviderError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  const message =
    error instanceof Error ? error.message : "AI provider request failed";

  if (
    message.includes("401") ||
    message.toLowerCase().includes("unauthorized") ||
    message.toLowerCase().includes("invalid api key") ||
    message.toLowerCase().includes("incorrect api key")
  ) {
    return AppError.invalidApiKey(
      "Invalid API key. Please check your key and try again."
    );
  }

  return AppError.provider(`AI provider error: ${message}`);
}

export { improve };
