import { describe, expect, it, vi } from "vitest";

const { mockExtractText, mockGetDocumentProxy } = vi.hoisted(() => ({
  mockExtractText: vi.fn(),
  mockGetDocumentProxy: vi.fn(),
}));

vi.mock("unpdf", () => ({
  extractText: mockExtractText,
  getDocumentProxy: mockGetDocumentProxy,
}));

import { extractTextFromPdf } from "./pdf-parser.js";

describe("extractTextFromPdf", () => {
  const mockDocument = { numPages: 1 };

  it("extracts text from a valid PDF (ArrayBuffer)", async () => {
    const buffer = new ArrayBuffer(8);
    mockGetDocumentProxy.mockResolvedValue(mockDocument);
    mockExtractText.mockResolvedValue({ text: "John Doe\nSoftware Engineer" });

    const result = await extractTextFromPdf(buffer);

    expect(result).toBe("John Doe\nSoftware Engineer");
    expect(mockGetDocumentProxy).toHaveBeenCalledWith(new Uint8Array(buffer));
    expect(mockExtractText).toHaveBeenCalledWith(mockDocument, {
      mergePages: true,
    });
  });

  it("extracts text from a valid PDF (Uint8Array)", async () => {
    const uint8 = new Uint8Array([1, 2, 3, 4]);
    mockGetDocumentProxy.mockResolvedValue(mockDocument);
    mockExtractText.mockResolvedValue({ text: "Resume content here" });

    const result = await extractTextFromPdf(uint8);

    expect(result).toBe("Resume content here");
    expect(mockGetDocumentProxy).toHaveBeenCalledWith(uint8);
  });

  it("trims whitespace from extracted text", async () => {
    mockGetDocumentProxy.mockResolvedValue(mockDocument);
    mockExtractText.mockResolvedValue({
      text: "  \n  Some text with whitespace  \n  ",
    });

    const result = await extractTextFromPdf(new Uint8Array([1]));

    expect(result).toBe("Some text with whitespace");
  });

  it("throws on empty PDF (no text extracted)", async () => {
    mockGetDocumentProxy.mockResolvedValue(mockDocument);
    mockExtractText.mockResolvedValue({ text: "" });

    await expect(extractTextFromPdf(new Uint8Array([1]))).rejects.toThrow(
      "No text could be extracted from the PDF"
    );
  });

  it("throws on whitespace-only PDF", async () => {
    mockGetDocumentProxy.mockResolvedValue(mockDocument);
    mockExtractText.mockResolvedValue({ text: "   \n\n  \t  " });

    await expect(extractTextFromPdf(new Uint8Array([1]))).rejects.toThrow(
      "No text could be extracted from the PDF"
    );
  });

  it("propagates errors from getDocumentProxy", async () => {
    mockGetDocumentProxy.mockRejectedValue(new Error("Invalid PDF structure"));

    await expect(extractTextFromPdf(new Uint8Array([1]))).rejects.toThrow(
      "Invalid PDF structure"
    );
  });

  it("propagates errors from extractText", async () => {
    mockGetDocumentProxy.mockResolvedValue(mockDocument);
    mockExtractText.mockRejectedValue(new Error("Extraction failed"));

    await expect(extractTextFromPdf(new Uint8Array([1]))).rejects.toThrow(
      "Extraction failed"
    );
  });

  it("calls extractText with mergePages: true", async () => {
    mockGetDocumentProxy.mockResolvedValue(mockDocument);
    mockExtractText.mockResolvedValue({
      text: "Page 1 content Page 2 content",
    });

    await extractTextFromPdf(new Uint8Array([1]));

    expect(mockExtractText).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ mergePages: true })
    );
  });
});
