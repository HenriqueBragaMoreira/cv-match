import { describe, expect, it } from "vitest";
import {
  aiProvider,
  analyzeRequestSchema,
  analyzeResponseSchema,
  resumeFileSchema,
} from "./analyze.js";

function makeFile(
  name: string,
  size = 100,
  type = "application/octet-stream"
): File {
  const content = new Uint8Array(size);
  return new File([content], name, { type });
}

function validAnalyzeRequest() {
  return {
    resumeFile: makeFile("resume.pdf"),
    jobDescription: "Senior Software Engineer at Acme Corp",
    provider: "openai" as const,
    apiKey: "sk-test1234567890",
  };
}

function validAnalyzeResponse() {
  return {
    score: 75,
    strengths: ["Strong TypeScript skills"],
    weaknesses: ["No cloud experience mentioned"],
    suggestions: ["Add AWS certifications"],
    keywords: { present: ["TypeScript"], missing: ["AWS"] },
    breakdown: {
      experience: 80,
      skills: 70,
      education: 60,
      certifications: 50,
    },
    formattingWarnings: [],
  };
}

// ---------------------------------------------------------------------------
// aiProvider
// ---------------------------------------------------------------------------
describe("aiProvider", () => {
  it.each(["openai", "anthropic", "google"])("accepts '%s'", (value) => {
    expect(aiProvider.parse(value)).toBe(value);
  });

  it("rejects unknown provider", () => {
    expect(() => aiProvider.parse("mistral")).toThrow();
  });
});

// ---------------------------------------------------------------------------
// resumeFileSchema
// ---------------------------------------------------------------------------
describe("resumeFileSchema", () => {
  it("accepts a valid .pdf file", () => {
    const file = makeFile("resume.pdf");
    expect(resumeFileSchema.parse(file)).toBe(file);
  });

  it("accepts a valid .tex file", () => {
    const file = makeFile("resume.tex");
    expect(resumeFileSchema.parse(file)).toBe(file);
  });

  it("accepts uppercase extensions", () => {
    expect(resumeFileSchema.parse(makeFile("RESUME.PDF"))).toBeTruthy();
    expect(resumeFileSchema.parse(makeFile("RESUME.TEX"))).toBeTruthy();
  });

  it("rejects an empty file", () => {
    const file = makeFile("resume.pdf", 0);
    expect(() => resumeFileSchema.parse(file)).toThrow("must not be empty");
  });

  it("rejects a file exceeding 10 MB", () => {
    const file = makeFile("resume.pdf", 10 * 1024 * 1024 + 1);
    expect(() => resumeFileSchema.parse(file)).toThrow("must not exceed 10 MB");
  });

  it("accepts a file exactly at 10 MB", () => {
    const file = makeFile("resume.pdf", 10 * 1024 * 1024);
    expect(resumeFileSchema.parse(file)).toBe(file);
  });

  it("rejects unsupported extensions", () => {
    expect(() => resumeFileSchema.parse(makeFile("resume.docx"))).toThrow(
      "Only .pdf and .tex"
    );
    expect(() => resumeFileSchema.parse(makeFile("resume.txt"))).toThrow(
      "Only .pdf and .tex"
    );
  });

  it("rejects non-File values", () => {
    expect(() => resumeFileSchema.parse("not a file")).toThrow();
    expect(() => resumeFileSchema.parse(null)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// analyzeRequestSchema
// ---------------------------------------------------------------------------
describe("analyzeRequestSchema", () => {
  it("accepts a fully valid request", () => {
    const data = validAnalyzeRequest();
    const result = analyzeRequestSchema.parse(data);
    expect(result.provider).toBe("openai");
  });

  it("accepts each provider with correct key format", () => {
    const base = validAnalyzeRequest();

    expect(
      analyzeRequestSchema.parse({
        ...base,
        provider: "openai",
        apiKey: "sk-abc123",
      })
    ).toBeTruthy();

    expect(
      analyzeRequestSchema.parse({
        ...base,
        provider: "anthropic",
        apiKey: "sk-ant-abc123",
      })
    ).toBeTruthy();

    expect(
      analyzeRequestSchema.parse({
        ...base,
        provider: "google",
        apiKey: "AIzaSomething",
      })
    ).toBeTruthy();
  });

  it("rejects mismatched provider/key combinations", () => {
    const base = validAnalyzeRequest();

    expect(() =>
      analyzeRequestSchema.parse({
        ...base,
        provider: "openai",
        apiKey: "AIzaWrong",
      })
    ).toThrow("Invalid API key format");

    expect(() =>
      analyzeRequestSchema.parse({
        ...base,
        provider: "anthropic",
        apiKey: "sk-wrong",
      })
    ).toThrow("Invalid API key format");

    expect(() =>
      analyzeRequestSchema.parse({
        ...base,
        provider: "google",
        apiKey: "sk-wrong",
      })
    ).toThrow("Invalid API key format");
  });

  it("rejects empty job description", () => {
    const data = { ...validAnalyzeRequest(), jobDescription: "" };
    expect(() => analyzeRequestSchema.parse(data)).toThrow();
  });

  it("rejects job description exceeding 50 000 characters", () => {
    const data = {
      ...validAnalyzeRequest(),
      jobDescription: "a".repeat(50_001),
    };
    expect(() => analyzeRequestSchema.parse(data)).toThrow(
      "must not exceed 50 000"
    );
  });

  it("rejects empty API key", () => {
    const data = { ...validAnalyzeRequest(), apiKey: "" };
    expect(() => analyzeRequestSchema.parse(data)).toThrow();
  });

  it("rejects missing fields", () => {
    expect(() => analyzeRequestSchema.parse({})).toThrow();
  });
});

// ---------------------------------------------------------------------------
// analyzeResponseSchema
// ---------------------------------------------------------------------------
describe("analyzeResponseSchema", () => {
  it("accepts a fully valid response", () => {
    const data = validAnalyzeResponse();
    const result = analyzeResponseSchema.parse(data);
    expect(result.score).toBe(75);
  });

  it("accepts boundary scores (0 and 100)", () => {
    const base = validAnalyzeResponse();
    expect(analyzeResponseSchema.parse({ ...base, score: 0 }).score).toBe(0);
    expect(analyzeResponseSchema.parse({ ...base, score: 100 }).score).toBe(
      100
    );
  });

  it("rejects score below 0", () => {
    const data = { ...validAnalyzeResponse(), score: -1 };
    expect(() => analyzeResponseSchema.parse(data)).toThrow();
  });

  it("rejects score above 100", () => {
    const data = { ...validAnalyzeResponse(), score: 101 };
    expect(() => analyzeResponseSchema.parse(data)).toThrow();
  });

  it("rejects non-integer score", () => {
    const data = { ...validAnalyzeResponse(), score: 75.5 };
    expect(() => analyzeResponseSchema.parse(data)).toThrow();
  });

  it("requires at least one strength", () => {
    const data = { ...validAnalyzeResponse(), strengths: [] };
    expect(() => analyzeResponseSchema.parse(data)).toThrow(
      "At least one strength"
    );
  });

  it("requires at least one weakness", () => {
    const data = { ...validAnalyzeResponse(), weaknesses: [] };
    expect(() => analyzeResponseSchema.parse(data)).toThrow(
      "At least one weakness"
    );
  });

  it("requires at least one suggestion", () => {
    const data = { ...validAnalyzeResponse(), suggestions: [] };
    expect(() => analyzeResponseSchema.parse(data)).toThrow(
      "At least one suggestion"
    );
  });

  it("allows empty formattingWarnings", () => {
    const data = validAnalyzeResponse();
    expect(analyzeResponseSchema.parse(data).formattingWarnings).toEqual([]);
  });

  it("allows empty keywords arrays", () => {
    const data = {
      ...validAnalyzeResponse(),
      keywords: { present: [], missing: [] },
    };
    expect(analyzeResponseSchema.parse(data).keywords).toEqual({
      present: [],
      missing: [],
    });
  });

  it("rejects breakdown scores outside 0-100", () => {
    const base = validAnalyzeResponse();

    expect(() =>
      analyzeResponseSchema.parse({
        ...base,
        breakdown: { ...base.breakdown, experience: -1 },
      })
    ).toThrow();

    expect(() =>
      analyzeResponseSchema.parse({
        ...base,
        breakdown: { ...base.breakdown, skills: 101 },
      })
    ).toThrow();
  });

  it("rejects non-integer breakdown scores", () => {
    const base = validAnalyzeResponse();
    expect(() =>
      analyzeResponseSchema.parse({
        ...base,
        breakdown: { ...base.breakdown, education: 50.5 },
      })
    ).toThrow();
  });

  it("rejects missing required fields", () => {
    expect(() => analyzeResponseSchema.parse({})).toThrow();
    expect(() => analyzeResponseSchema.parse({ score: 50 })).toThrow();
  });
});
