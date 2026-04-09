import { extractText, getDocumentProxy } from "unpdf";

/**
 * Extracts text content from a PDF file.
 * Uses unpdf (PDF.js serverless build) — compatible with Cloudflare Workers edge runtime.
 */
export async function extractTextFromPdf(
  data: ArrayBuffer | Uint8Array
): Promise<string> {
  const uint8 = data instanceof ArrayBuffer ? new Uint8Array(data) : data;

  const document = await getDocumentProxy(uint8);
  const { text } = await extractText(document, { mergePages: true });

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    throw new Error(
      "No text could be extracted from the PDF. The file may be scanned/image-only."
    );
  }

  return trimmed;
}
