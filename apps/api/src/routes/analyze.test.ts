import { describe, expect, it, vi, beforeEach } from "vitest";

const mockAnalysisResult = {
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
  formattingWarnings: ["Consider using standard section headings"],
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
    jobDescription: "Senior Software Engineer with TypeScript experience",
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
  return new Request("http://localhost/analyze", {
    method: "POST",
    body,
  });
}

describe("POST /analyze", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGenerateObject.mockResolvedValue({ object: mockAnalysisResult });
  });

  // ---------------------------------------------------------------------------
  // Happy path
  // ---------------------------------------------------------------------------
  describe("successful analysis", () => {
    it("returns 200 with analysis result for a PDF file", async () => {
      const res = await app.request(makeRequest(makeFormData()));

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.score).toBe(75);
      expect(json.strengths).toEqual(["Strong TypeScript skills"]);
      expect(json.weaknesses).toEqual(["No cloud experience mentioned"]);
      expect(json.suggestions).toEqual(["Add AWS certifications"]);
      expect(json.keywords).toEqual({
        present: ["TypeScript"],
        missing: ["AWS"],
      });
      expect(json.breakdown).toEqual({
        experience: 80,
        skills: 70,
        education: 60,
        certifications: 50,
      });
      expect(json.formattingWarnings).toEqual([
        "Consider using standard section headings",
      ]);
    });

    it("returns 200 with analysis result for a LaTeX file", async () => {
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
      expect(json.score).toBe(75);
    });

    it("extracts text from PDF using extractTextFromPdf", async () => {
      await app.request(makeRequest(makeFormData()));

      expect(extractTextFromPdf).toHaveBeenCalled();
    });

    it("passes extracted text and job description to the AI model", async () => {
      const jobDescription = "Looking for a React developer";
      await app.request(makeRequest(makeFormData({ jobDescription })));

      expect(mockGenerateObject).toHaveBeenCalledTimes(1);
      const call = mockGenerateObject.mock.calls[0][0];
      expect(call.prompt).toContain("Extracted PDF resume text");
      expect(call.prompt).toContain(jobDescription);
      expect(call.system).toBeDefined();
      expect(call.schema).toBeDefined();
    });

    it("works with each supported provider", async () => {
      const providers = [
        { provider: "openai", apiKey: "sk-test1234567890" },
        { provider: "anthropic", apiKey: "sk-ant-test1234567890" },
        { provider: "google", apiKey: "AIzaTestKey1234567890" },
      ];

      for (const { provider, apiKey } of providers) {
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

      expect(json).toHaveProperty("score");
      expect(json).toHaveProperty("strengths");
      expect(json).toHaveProperty("weaknesses");
      expect(json).toHaveProperty("suggestions");
      expect(json).toHaveProperty("keywords");
      expect(json).toHaveProperty("keywords.present");
      expect(json).toHaveProperty("keywords.missing");
      expect(json).toHaveProperty("breakdown");
      expect(json).toHaveProperty("breakdown.experience");
      expect(json).toHaveProperty("breakdown.skills");
      expect(json).toHaveProperty("breakdown.education");
      expect(json).toHaveProperty("breakdown.certifications");
      expect(json).toHaveProperty("formattingWarnings");
    });

    it("returns score as an integer in range 0-100", async () => {
      const res = await app.request(makeRequest(makeFormData()));
      const json = await res.json();

      expect(json.score).toBeGreaterThanOrEqual(0);
      expect(json.score).toBeLessThanOrEqual(100);
      expect(Number.isInteger(json.score)).toBe(true);
    });

    it("returns score 0 at the lower boundary", async () => {
      mockGenerateObject.mockResolvedValueOnce({
        object: { ...mockAnalysisResult, score: 0 },
      });

      const res = await app.request(makeRequest(makeFormData()));
      const json = await res.json();
      expect(json.score).toBe(0);
    });

    it("returns score 100 at the upper boundary", async () => {
      mockGenerateObject.mockResolvedValueOnce({
        object: { ...mockAnalysisResult, score: 100 },
      });

      const res = await app.request(makeRequest(makeFormData()));
      const json = await res.json();
      expect(json.score).toBe(100);
    });
  });

  // ---------------------------------------------------------------------------
  // Validation errors (400)
  // ---------------------------------------------------------------------------
  describe("validation errors", () => {
    it("returns 400 when resumeFile is missing", async () => {
      const formData = new FormData();
      formData.append("jobDescription", "Senior Software Engineer");
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
      formData.append("provider", "openai");
      formData.append("apiKey", "sk-test1234567890");

      const res = await app.request(makeRequest(formData));
      expect(res.status).toBe(400);
    });

    it("returns 400 when provider is missing", async () => {
      const formData = new FormData();
      formData.append(
        "resumeFile",
        new File(["content"], "resume.pdf", { type: "application/pdf" })
      );
      formData.append("jobDescription", "Senior Engineer");
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
    it("returns 401 when provider returns unauthorized", async () => {
      mockGenerateObject.mockRejectedValueOnce(
        new Error("401 Unauthorized - Invalid API key")
      );

      const res = await app.request(makeRequest(makeFormData()));

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error.code).toBe("INVALID_API_KEY");
      expect(json.error.message).toContain("Invalid API key");
    });

    it("returns 401 when provider says incorrect api key", async () => {
      mockGenerateObject.mockRejectedValueOnce(
        new Error("Incorrect API key provided")
      );

      const res = await app.request(makeRequest(makeFormData()));

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error.code).toBe("INVALID_API_KEY");
    });

    it("returns 502 for generic provider errors", async () => {
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
      mockGenerateObject.mockRejectedValueOnce("something unexpected");

      const res = await app.request(makeRequest(makeFormData()));

      expect(res.status).toBe(502);
      const json = await res.json();
      expect(json.error.code).toBe("PROVIDER_ERROR");
    });

    it("does not leak API keys in provider error messages", async () => {
      const apiKey = "sk-proj-secretkey1234567890abcdef";
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
    it("returns 404 for GET /analyze", async () => {
      const res = await app.request(
        new Request("http://localhost/analyze", { method: "GET" })
      );
      expect(res.status).toBe(404);
    });
  });
});
