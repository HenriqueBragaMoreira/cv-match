import { Hono } from "hono";
import { generateObject } from "ai";
import {
  analyzeRequestSchema,
  analyzeResponseSchema,
} from "../schemas/index.js";
import {
  ATS_ANALYSIS_SYSTEM_PROMPT,
  buildAtsAnalysisUserPrompt,
} from "../prompts/index.js";
import { createProviderModel } from "../services/index.js";
import { extractTextFromPdf, extractTextFromLatex } from "../utils/index.js";
import { AppError } from "../errors.js";

const analyze = new Hono();

analyze.post("/", async (c) => {
  const formData = await c.req.formData();

  const parsed = analyzeRequestSchema.parse({
    resumeFile: formData.get("resumeFile"),
    jobDescription: formData.get("jobDescription"),
    provider: formData.get("provider"),
    apiKey: formData.get("apiKey"),
  });

  const resumeText = await extractResumeText(parsed.resumeFile);
  const model = createProviderModel(parsed.provider, parsed.apiKey);

  try {
    const { object } = await generateObject({
      model,
      schema: analyzeResponseSchema,
      system: ATS_ANALYSIS_SYSTEM_PROMPT,
      prompt: buildAtsAnalysisUserPrompt(resumeText, parsed.jobDescription),
    });

    return c.json(object);
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

export { analyze };
