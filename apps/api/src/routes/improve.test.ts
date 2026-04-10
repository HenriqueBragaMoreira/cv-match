import { describe, expect, it, vi, beforeEach } from "vitest";

const mockAnalysisResult = {
  score: 55,
  strengths: ["Strong TypeScript skills"],
  weaknesses: ["No cloud experience mentioned"],
  suggestions: ["Add AWS certifications"],
  keywords: { present: ["TypeScript"], missing: ["AWS"] },
  breakdown: {
    experience: 60,
    skills: 50,
    education: 40,
    certifications: 30,
  },
  formattingWarnings: ["Consider using standard section headings"],
};

const mockImprovement = {
  improvedResume: "Improved resume text with better keywords",
  changes: "- Added AWS keywords\n- Reordered skills section",
};

const mockReScoringResult = {
  score: 82,
  strengths: ["Strong TypeScript skills", "Cloud experience highlighted"],
  weaknesses: ["Could add more certifications"],
  suggestions: ["Consider AWS certification"],
  keywords: { present: ["TypeScript", "AWS"], missing: [] },
  breakdown: {
    experience: 85,
    skills: 80,
    education: 70,
    certifications: 60,
  },
  formattingWarnings: [],
};

const mockGenerateObject = vi.fn();
vi.mock("ai", () => ({
  generateObject: (...args: unknown[]) => mockGenerateObject(...args),
}));

vi.mock("../utils/pdf-parser.js", () => ({
  extractTextFromPdf: vi.fn().mockResolvedValue("Extracted PDF resume text"),
}));

vi.mock("../utils/latex-parser.js", () => ({
  extractTextFromLatex: vi.fn().mockReturnValue("Extracted LaTeX resume text"),
}));

import app from "../index.js";
import { extractTextFromPdf } from "../utils/pdf-parser.js";
import { extractTextFromLatex } from "../utils/latex-parser.js";

function makeFormData(overrides: Record<string, string | File> = {}): FormData {
  const defaults: Record<string, string | File> = {
    resumeFile: new File(["dummy content"], "resume.pdf", {
      type: "application/pdf",
    }),
    jobDescription:
      "Senior Software Engineer with TypeScript and AWS experience",
    analysisResult: JSON.stringify(mockAnalysisResult),
    provider: "openai",
    apiKey: "sk-test1234567890",
  };

  const merged = { ...defaults, ...overrides };
  const formData = new FormData();
  for (const [key, value] of Object.entries(merged)) {
    formData.append(key, value);
  }
  return formData;
}

function makeRequest(body: FormData): Request {
  return new Request("http://localhost/improve", {
    method: "POST",
    body,
  });
}

describe("POST /improve", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGenerateObject
      .mockResolvedValueOnce({ object: mockImprovement })
      .mockResolvedValueOnce({ object: mockReScoringResult });
  });

  // ---------------------------------------------------------------------------
  // Happy path
  // ---------------------------------------------------------------------------
  describe("successful improvement", () => {
    it("returns 200 with improved resume for a PDF file", async () => {
      const res = await app.request(makeRequest(makeFormData()));

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.improvedResume).toBe(mockImprovement.improvedResume);
      expect(json.changes).toBe(mockImprovement.changes);
      expect(json.newScore).toBe(82);
    });

    it("returns 200 with improved resume for a LaTeX file", async () => {
      const texFile = new File(
        ["\\begin{document}Resume content\\end{document}"],
        "resume.tex",
        { type: "application/x-tex" }
      );

      const res = await app.request(
        makeRequest(makeFormData({ resumeFile: texFile }))
      );

      expect(res.status).toBe(200);
      expect(extractTextFromLatex).toHaveBeenCalled();
      const json = await res.json();
      expect(json.improvedResume).toBe(mockImprovement.improvedResume);
    });

    it("extracts text from PDF using extractTextFromPdf", async () => {
      await app.request(makeRequest(makeFormData()));

      expect(extractTextFromPdf).toHaveBeenCalled();
    });

    it("calls generateObject twice (improvement + re-scoring)", async () => {
      await app.request(makeRequest(makeFormData()));

      expect(mockGenerateObject).toHaveBeenCalledTimes(2);
    });

    it("passes extracted text, job description, and analysis to the improvement call", async () => {
      const jobDescription = "Looking for a React developer";
      await app.request(makeRequest(makeFormData({ jobDescription })));

      const improvementCall = mockGenerateObject.mock.calls[0][0];
      expect(improvementCall.prompt).toContain("Extracted PDF resume text");
      expect(improvementCall.prompt).toContain(jobDescription);
      expect(improvementCall.prompt).toContain("ATS Analysis Result");
      expect(improvementCall.system).toBeDefined();
      expect(improvementCall.schema).toBeDefined();
    });

    it("passes improved resume to the re-scoring call", async () => {
      await app.request(makeRequest(makeFormData()));

      const reScoringCall = mockGenerateObject.mock.calls[1][0];
      expect(reScoringCall.prompt).toContain(mockImprovement.improvedResume);
      expect(reScoringCall.system).toBeDefined();
      expect(reScoringCall.schema).toBeDefined();
    });

    it("uses the same ATS prompt for re-scoring as /analyze uses", async () => {
      await app.request(makeRequest(makeFormData()));

      const reScoringCall = mockGenerateObject.mock.calls[1][0];
      // RE_SCORING_SYSTEM_PROMPT is re-exported from ATS_ANALYSIS_SYSTEM_PROMPT
      expect(reScoringCall.system).toContain("ATS");
    });

    it("works with each supported provider", async () => {
      const providers = [
        { provider: "openai", apiKey: "sk-test1234567890" },
        { provider: "anthropic", apiKey: "sk-ant-test1234567890" },
        { provider: "google", apiKey: "AIzaTestKey1234567890" },
      ];

      for (const { provider, apiKey } of providers) {
        mockGenerateObject
          .mockResolvedValueOnce({ object: mockImprovement })
          .mockResolvedValueOnce({ object: mockReScoringResult });

        const res = await app.request(
          makeRequest(makeFormData({ provider, apiKey }))
        );
        expect(res.status).toBe(200);
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Response format validation
  // ---------------------------------------------------------------------------
  describe("response format", () => {
    it("returns all required fields", async () => {
      const res = await app.request(makeRequest(makeFormData()));
      const json = await res.json();

      expect(json).toHaveProperty("improvedResume");
      expect(json).toHaveProperty("changes");
      expect(json).toHaveProperty("newScore");
    });

    it("returns newScore as an integer in range 0-100", async () => {
      const res = await app.request(makeRequest(makeFormData()));
      const json = await res.json();

      expect(json.newScore).toBeGreaterThanOrEqual(0);
      expect(json.newScore).toBeLessThanOrEqual(100);
      expect(Number.isInteger(json.newScore)).toBe(true);
    });

    it("returns newScore 0 at the lower boundary", async () => {
      mockGenerateObject.mockReset();
      mockGenerateObject
        .mockResolvedValueOnce({ object: mockImprovement })
        .mockResolvedValueOnce({
          object: { ...mockReScoringResult, score: 0 },
        });

      const res = await app.request(makeRequest(makeFormData()));
      const json = await res.json();
      expect(json.newScore).toBe(0);
    });

    it("returns newScore 100 at the upper boundary", async () => {
      mockGenerateObject.mockReset();
      mockGenerateObject
        .mockResolvedValueOnce({ object: mockImprovement })
        .mockResolvedValueOnce({
          object: { ...mockReScoringResult, score: 100 },
        });

      const res = await app.request(makeRequest(makeFormData()));
      const json = await res.json();
      expect(json.newScore).toBe(100);
    });

    it("does not include extra fields from re-scoring in the response", async () => {
      const res = await app.request(makeRequest(makeFormData()));
      const json = await res.json();

      expect(json).not.toHaveProperty("score");
      expect(json).not.toHaveProperty("strengths");
      expect(json).not.toHaveProperty("weaknesses");
      expect(json).not.toHaveProperty("breakdown");
    });
  });

  // ---------------------------------------------------------------------------
  // Validation errors (400)
  // ---------------------------------------------------------------------------
  describe("validation errors", () => {
    it("returns 400 when resumeFile is missing", async () => {
      const formData = new FormData();
      formData.append("jobDescription", "Senior Software Engineer");
      formData.append("analysisResult", JSON.stringify(mockAnalysisResult));
      formData.append("provider", "openai");
      formData.append("apiKey", "sk-test1234567890");

      const res = await app.request(makeRequest(formData));
      expect(res.status).toBe(400);
    });

    it("returns 400 when jobDescription is missing", async () => {
      const formData = new FormData();
      formData.append(
        "resumeFile",
        new File(["content"], "resume.pdf", { type: "application/pdf" })
      );
      formData.append("analysisResult", JSON.stringify(mockAnalysisResult));
      formData.append("provider", "openai");
      formData.append("apiKey", "sk-test1234567890");

      const res = await app.request(makeRequest(formData));
      expect(res.status).toBe(400);
    });

    it("returns 400 when analysisResult is missing", async () => {
      const formData = new FormData();
      formData.append(
        "resumeFile",
        new File(["content"], "resume.pdf", { type: "application/pdf" })
      );
      formData.append("jobDescription", "Senior Engineer");
      formData.append("provider", "openai");
      formData.append("apiKey", "sk-test1234567890");

      const res = await app.request(makeRequest(formData));
      expect(res.status).toBe(400);
    });

    it("returns 500 when analysisResult is invalid JSON", async () => {
      const res = await app.request(
        makeRequest(makeFormData({ analysisResult: "not-valid-json" }))
      );
      // JSON.parse throws before Zod validation, caught by global error handler
      expect(res.status).toBe(500);
    });

    it("returns 400 when analysisResult has invalid structure", async () => {
      const res = await app.request(
        makeRequest(
          makeFormData({
            analysisResult: JSON.stringify({ score: "not a number" }),
          })
        )
      );
      expect(res.status).toBe(400);
    });

    it("returns 400 when provider is missing", async () => {
      const formData = new FormData();
      formData.append(
        "resumeFile",
        new File(["content"], "resume.pdf", { type: "application/pdf" })
      );
      formData.append("jobDescription", "Senior Engineer");
      formData.append("analysisResult", JSON.stringify(mockAnalysisResult));
      formData.append("apiKey", "sk-test1234567890");

      const res = await app.request(makeRequest(formData));
      expect(res.status).toBe(400);
    });

    it("returns 400 when apiKey is missing", async () => {
      const formData = new FormData();
      formData.append(
        "resumeFile",
        new File(["content"], "resume.pdf", { type: "application/pdf" })
      );
      formData.append("jobDescription", "Senior Engineer");
      formData.append("analysisResult", JSON.stringify(mockAnalysisResult));
      formData.append("provider", "openai");

      const res = await app.request(makeRequest(formData));
      expect(res.status).toBe(400);
    });

    it("returns 400 for an unsupported file extension", async () => {
      const docxFile = new File(["content"], "resume.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const res = await app.request(
        makeRequest(makeFormData({ resumeFile: docxFile }))
      );
      expect(res.status).toBe(400);
    });

    it("returns 400 for an empty file", async () => {
      const emptyFile = new File([], "resume.pdf", {
        type: "application/pdf",
      });

      const res = await app.request(
        makeRequest(makeFormData({ resumeFile: emptyFile }))
      );
      expect(res.status).toBe(400);
    });

    it("returns 400 for an invalid provider", async () => {
      const res = await app.request(
        makeRequest(makeFormData({ provider: "mistral" }))
      );
      expect(res.status).toBe(400);
    });

    it("returns 400 for mismatched provider/apiKey format", async () => {
      const res = await app.request(
        makeRequest(
          makeFormData({ provider: "openai", apiKey: "AIzaWrongKey" })
        )
      );
      expect(res.status).toBe(400);
    });

    it("returns VALIDATION_ERROR code in error response", async () => {
      const res = await app.request(
        makeRequest(makeFormData({ provider: "invalid" }))
      );
      const json = await res.json();
      expect(json.error.code).toBe("VALIDATION_ERROR");
    });
  });

  // ---------------------------------------------------------------------------
  // File extraction errors (400)
  // ---------------------------------------------------------------------------
  describe("file extraction errors", () => {
    it("returns 400 when PDF extraction fails", async () => {
      vi.mocked(extractTextFromPdf).mockRejectedValueOnce(
        new Error("No text could be extracted from the PDF")
      );

      const res = await app.request(makeRequest(makeFormData()));

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error.code).toBe("VALIDATION_ERROR");
      expect(json.error.message).toContain(
        "No text could be extracted from the PDF"
      );
    });

    it("returns 400 when LaTeX extraction fails", async () => {
      vi.mocked(extractTextFromLatex).mockImplementationOnce(() => {
        throw new Error("No text could be extracted from the LaTeX file");
      });

      const texFile = new File(["empty"], "resume.tex", {
        type: "application/x-tex",
      });

      const res = await app.request(
        makeRequest(makeFormData({ resumeFile: texFile }))
      );

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error.code).toBe("VALIDATION_ERROR");
    });
  });

  // ---------------------------------------------------------------------------
  // AI provider errors
  // ---------------------------------------------------------------------------
  describe("AI provider errors", () => {
    it("returns 401 when provider returns unauthorized on improvement call", async () => {
      mockGenerateObject.mockReset();
      mockGenerateObject.mockRejectedValueOnce(
        new Error("401 Unauthorized - Invalid API key")
      );

      const res = await app.request(makeRequest(makeFormData()));

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error.code).toBe("INVALID_API_KEY");
      expect(json.error.message).toContain("Invalid API key");
    });

    it("returns 401 when provider returns unauthorized on re-scoring call", async () => {
      mockGenerateObject.mockReset();
      mockGenerateObject
        .mockResolvedValueOnce({ object: mockImprovement })
        .mockRejectedValueOnce(new Error("401 Unauthorized - Invalid API key"));

      const res = await app.request(makeRequest(makeFormData()));

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error.code).toBe("INVALID_API_KEY");
    });

    it("returns 502 for generic provider errors", async () => {
      mockGenerateObject.mockReset();
      mockGenerateObject.mockRejectedValueOnce(
        new Error("Rate limit exceeded")
      );

      const res = await app.request(makeRequest(makeFormData()));

      expect(res.status).toBe(502);
      const json = await res.json();
      expect(json.error.code).toBe("PROVIDER_ERROR");
      expect(json.error.message).toContain("Rate limit exceeded");
    });

    it("returns 502 for unknown provider errors", async () => {
      mockGenerateObject.mockReset();
      mockGenerateObject.mockRejectedValueOnce("something unexpected");

      const res = await app.request(makeRequest(makeFormData()));

      expect(res.status).toBe(502);
      const json = await res.json();
      expect(json.error.code).toBe("PROVIDER_ERROR");
    });

    it("does not leak API keys in provider error messages", async () => {
      const apiKey = "sk-proj-secretkey1234567890abcdef";
      mockGenerateObject.mockReset();
      mockGenerateObject.mockRejectedValueOnce(
        new Error(`Authentication failed for key ${apiKey}`)
      );

      const res = await app.request(makeRequest(makeFormData({ apiKey })));
      const json = await res.json();

      expect(json.error.message).not.toContain(apiKey);
      expect(json.error.message).toContain("[REDACTED]");
    });
  });

  // ---------------------------------------------------------------------------
  // 404 — wrong method / route
  // ---------------------------------------------------------------------------
  describe("routing", () => {
    it("returns 404 for GET /improve", async () => {
      const res = await app.request(
        new Request("http://localhost/improve", { method: "GET" })
      );
      expect(res.status).toBe(404);
    });
  });
});
