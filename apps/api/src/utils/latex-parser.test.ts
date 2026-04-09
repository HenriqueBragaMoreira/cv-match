import { describe, expect, it } from "vitest";
import { extractTextFromLatex } from "./latex-parser.js";

describe("extractTextFromLatex", () => {
  it("extracts text from a full LaTeX document", () => {
    const tex = String.raw`
\documentclass{article}
\usepackage{hyperref}
\begin{document}
\section{Experience}
\textbf{Software Engineer} at Acme Corp
\begin{itemize}
\item Built APIs
\item Led team of 5
\end{itemize}
\section{Skills}
JavaScript, TypeScript, Python
\end{document}
`;
    const result = extractTextFromLatex(tex);
    expect(result).toContain("Experience");
    expect(result).toContain("Software Engineer");
    expect(result).toContain("Acme Corp");
    expect(result).toContain("- Built APIs");
    expect(result).toContain("- Led team of 5");
    expect(result).toContain("Skills");
    expect(result).toContain("JavaScript, TypeScript, Python");
    // Should not contain LaTeX commands
    expect(result).not.toContain("\\documentclass");
    expect(result).not.toContain("\\usepackage");
    expect(result).not.toContain("\\textbf");
    expect(result).not.toContain("\\begin{");
  });

  it("handles LaTeX without document environment", () => {
    const tex = String.raw`
\section{Education}
\textbf{BS Computer Science} -- University of Example, 2020
GPA: 3.8/4.0
`;
    const result = extractTextFromLatex(tex);
    expect(result).toContain("Education");
    expect(result).toContain("BS Computer Science");
    expect(result).toContain("University of Example");
  });

  it("extracts href and url text", () => {
    const tex = String.raw`
\begin{document}
Contact: \href{mailto:john@example.com}{john@example.com} | \url{https://github.com/john}
\end{document}
`;
    const result = extractTextFromLatex(tex);
    expect(result).toContain("john@example.com");
    expect(result).toContain("https://github.com/john");
  });

  it("strips comments", () => {
    const tex = String.raw`
\begin{document}
Visible text
% This is a comment that should be removed
More visible text
\end{document}
`;
    const result = extractTextFromLatex(tex);
    expect(result).toContain("Visible text");
    expect(result).toContain("More visible text");
    expect(result).not.toContain("comment that should be removed");
  });

  it("converts special characters", () => {
    const tex = [
      "\\begin{document}",
      "He said ``hello'' --- and then -- left.",
      "Non~breaking space.",
      "\\end{document}",
    ].join("\n");
    const result = extractTextFromLatex(tex);
    expect(result).toContain('"hello"');
    expect(result).toContain("—");
    expect(result).toContain("–");
    expect(result).toContain("Non breaking space");
  });

  it("throws on empty content", () => {
    const tex = String.raw`\documentclass{article}
\begin{document}
\end{document}`;
    expect(() => extractTextFromLatex(tex)).toThrow(
      "No text could be extracted"
    );
  });

  it("throws on commands-only content", () => {
    expect(() => extractTextFromLatex("\\noindent\\centering")).toThrow(
      "No text could be extracted"
    );
  });

  it("ignores content after \\end{document}", () => {
    const tex = String.raw`
\begin{document}
Inside document
\end{document}
This should be ignored
`;
    const result = extractTextFromLatex(tex);
    expect(result).toContain("Inside document");
    expect(result).not.toContain("should be ignored");
  });
});
