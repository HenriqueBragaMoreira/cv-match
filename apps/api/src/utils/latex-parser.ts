/**
 * Extracts plain text content from a LaTeX (.tex) file.
 * Strips LaTeX commands and environments to produce readable text.
 */
export function extractTextFromLatex(raw: string): string {
  let text = raw;

  // Remove comments (lines starting with % that aren't escaped)
  text = text.replace(/(?<!\\)%.*/g, "");

  // Remove document preamble (everything before \begin{document})
  const beginDoc = text.indexOf("\\begin{document}");
  if (beginDoc !== -1) {
    text = text.slice(beginDoc + "\\begin{document}".length);
  }

  // Remove \end{document} and anything after it
  const endDoc = text.indexOf("\\end{document}");
  if (endDoc !== -1) {
    text = text.slice(0, endDoc);
  }

  // Remove common environments that don't contain visible text
  text = text.replace(
    /\\begin\{(picture|tikzpicture|figure)\}[\s\S]*?\\end\{\1\}/g,
    ""
  );

  // Replace \\ (line breaks) with newlines
  text = text.replace(/\\\\/g, "\n");

  // Replace \newline, \newpage, \clearpage, \pagebreak with newlines
  text = text.replace(/\\(newline|newpage|clearpage|pagebreak)\b/g, "\n");

  // Replace \hfill, \vfill, \hspace{...}, \vspace{...} with space/newline
  text = text.replace(/\\[hv]fill\b/g, " ");
  text = text.replace(/\\[hv]space\*?\{[^}]*\}/g, " ");

  // Replace \item with bullet-like marker
  text = text.replace(/\\item\s*/g, "- ");

  // Replace \section{...}, \subsection{...}, etc. with their content + newlines
  text = text.replace(
    /\\(section|subsection|subsubsection|paragraph|subparagraph|chapter|part)\*?\{([^}]*)}/g,
    "\n$2\n"
  );

  // Replace \textbf{...}, \textit{...}, \emph{...}, \underline{...}, etc. with content
  text = text.replace(
    /\\(textbf|textit|textsc|texttt|emph|underline|uppercase|lowercase|textrm|textsf|textsl|textup)\{([^}]*)}/g,
    "$2"
  );

  // Replace \href{url}{text} with text
  text = text.replace(/\\href\{[^}]*\}\{([^}]*)}/g, "$1");

  // Replace \url{...} with the URL text
  text = text.replace(/\\url\{([^}]*)}/g, "$1");

  // Remove \begin{...} and \end{...} for remaining environments
  text = text.replace(/\\(begin|end)\{[^}]*\}/g, "");

  // Remove \documentclass, \usepackage, \input, \include and similar preamble commands
  text = text.replace(
    /\\(documentclass|usepackage|input|include|bibliography|bibliographystyle|pagestyle|thispagestyle|setlength|setcounter|addtolength|renewcommand|newcommand|definecolor|hypersetup|geometry|fancyhf|fancyhead|fancyfoot|titleformat|titlespacing|pagenumbering|graphicspath)(\[[^\]]*\])?\{[^}]*\}/g,
    ""
  );

  // Remove remaining commands with no arguments: \commandname
  text = text.replace(
    /\\(centering|noindent|raggedright|raggedleft|small|large|Large|LARGE|huge|Huge|tiny|footnotesize|scriptsize|normalsize|bigskip|medskip|smallskip|maketitle|tableofcontents|newpage|clearpage|linebreak|par)\b/g,
    ""
  );

  // Remove \label{...}, \ref{...}, \cite{...}, \footnote{...}
  text = text.replace(/\\(label|ref|cite|footnote|tag)\{[^}]*\}/g, "");

  // Remove any remaining \command{} patterns (catch-all for unknown commands)
  text = text.replace(/\\[a-zA-Z]+\{([^}]*)}/g, "$1");

  // Remove any remaining bare \commands (no braces)
  text = text.replace(/\\[a-zA-Z]+/g, "");

  // Remove curly braces that are left over
  text = text.replace(/[{}]/g, "");

  // Replace ~ (non-breaking space) with regular space
  text = text.replace(/~/g, " ");

  // Clean up common LaTeX special characters
  text = text.replace(/``/g, '"');
  text = text.replace(/''/g, '"');
  text = text.replace(/---/g, "—");
  text = text.replace(/--/g, "–");

  // Collapse multiple blank lines into one
  text = text.replace(/\n{3,}/g, "\n\n");

  // Collapse multiple spaces into one
  text = text.replace(/ {2,}/g, " ");

  // Trim each line
  text = text
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    throw new Error(
      "No text could be extracted from the LaTeX file. The file may be empty or contain only commands."
    );
  }

  return trimmed;
}
