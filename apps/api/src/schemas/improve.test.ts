import { describe, expect, it } from "vitest";
import {
  cvImprovementSchema,
  improveRequestSchema,
  improveResponseSchema,
} from "./improve.js";

function makeFile(
  name: string,
  size = 100,
  type = "application/octet-stream"
): File {
  const content = new Uint8Array(size);
  return new File([content], name, { type });
}

function validAnalysisResult() {
  return {
    score: 60,
    strengths: ["Good layout"],
    weaknesses: ["Missing keywords"],
    suggestions: ["Add more keywords"],
    keywords: { present: ["Python"], missing: ["AWS"] },
    breakdown: {
      experience: 70,
      skills: 50,
      education: 60,
      certifications: 40,
    },
    formattingWarnings: [],
  };
}

function validImproveRequest() {
  return {
    resumeFile: makeFile("resume.pdf"),
    jobDescription: "Senior Backend Engineer",
    analysisResult: validAnalysisResult(),
    provider: "anthropic" as const,
    apiKey: "sk-ant-test1234567890",
  };
}

// ---------------------------------------------------------------------------
// improveRequestSchema
// ---------------------------------------------------------------------------
describe("improveRequestSchema", () => {
  it("accepts a fully valid request", () => {
    const result = improveRequestSchema.parse(validImproveRequest());
    expect(result.provider).toBe("anthropic");
  });

  it("validates the nested analysisResult against analyzeResponseSchema", () => {
    const data = {
      ...validImproveRequest(),
      analysisResult: { score: 50 },
    };
    expect(() => improveRequestSchema.parse(data)).toThrow();
  });

  it("rejects analysisResult with invalid score", () => {
    const data = {
      ...validImproveRequest(),
      analysisResult: { ...validAnalysisResult(), score: 200 },
    };
    expect(() => improveRequestSchema.parse(data)).toThrow();
  });

  it("validates API key format per provider", () => {
    const base = validImproveRequest();

    expect(
      improveRequestSchema.parse({
        ...base,
        provider: "openai",
        apiKey: "sk-something",
      })
    ).toBeTruthy();

    expect(() =>
      improveRequestSchema.parse({
        ...base,
        provider: "openai",
        apiKey: "wrong-key",
      })
    ).toThrow("Invalid API key format");
  });

  it("rejects empty job description", () => {
    const data = { ...validImproveRequest(), jobDescription: "" };
    expect(() => improveRequestSchema.parse(data)).toThrow();
  });

  it("rejects unsupported file extension", () => {
    const data = {
      ...validImproveRequest(),
      resumeFile: makeFile("resume.docx"),
    };
    expect(() => improveRequestSchema.parse(data)).toThrow(
      "Only .pdf and .tex"
    );
  });

  it("rejects missing fields", () => {
    expect(() => improveRequestSchema.parse({})).toThrow();
  });
});

// ---------------------------------------------------------------------------
// cvImprovementSchema
// ---------------------------------------------------------------------------
describe("cvImprovementSchema", () => {
  it("accepts valid data", () => {
    const result = cvImprovementSchema.parse({
      improvedResume: "Improved content here",
      changes: "Added keywords, restructured experience",
    });
    expect(result.improvedResume).toBe("Improved content here");
  });

  it("rejects empty improvedResume", () => {
    expect(() =>
      cvImprovementSchema.parse({ improvedResume: "", changes: "changes" })
    ).toThrow("Improved resume text is required");
  });

  it("rejects empty changes", () => {
    expect(() =>
      cvImprovementSchema.parse({ improvedResume: "text", changes: "" })
    ).toThrow("Changes summary is required");
  });
});

// ---------------------------------------------------------------------------
// improveResponseSchema
// ---------------------------------------------------------------------------
describe("improveResponseSchema", () => {
  it("accepts valid data with newScore", () => {
    const result = improveResponseSchema.parse({
      improvedResume: "Better resume",
      changes: "Made it better",
      newScore: 85,
    });
    expect(result.newScore).toBe(85);
  });

  it("accepts boundary scores (0 and 100)", () => {
    const base = {
      improvedResume: "text",
      changes: "changes",
    };
    expect(improveResponseSchema.parse({ ...base, newScore: 0 }).newScore).toBe(
      0
    );
    expect(
      improveResponseSchema.parse({ ...base, newScore: 100 }).newScore
    ).toBe(100);
  });

  it("rejects newScore below 0", () => {
    expect(() =>
      improveResponseSchema.parse({
        improvedResume: "text",
        changes: "changes",
        newScore: -1,
      })
    ).toThrow();
  });

  it("rejects newScore above 100", () => {
    expect(() =>
      improveResponseSchema.parse({
        improvedResume: "text",
        changes: "changes",
        newScore: 101,
      })
    ).toThrow();
  });

  it("rejects non-integer newScore", () => {
    expect(() =>
      improveResponseSchema.parse({
        improvedResume: "text",
        changes: "changes",
        newScore: 85.5,
      })
    ).toThrow();
  });

  it("rejects missing newScore", () => {
    expect(() =>
      improveResponseSchema.parse({
        improvedResume: "text",
        changes: "changes",
      })
    ).toThrow();
  });
});
