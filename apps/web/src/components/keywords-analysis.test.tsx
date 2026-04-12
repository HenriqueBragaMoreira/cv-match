import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { KeywordsAnalysis } from "./keywords-analysis";

afterEach(cleanup);

describe("KeywordsAnalysis", () => {
  it("renders both section titles", () => {
    render(<KeywordsAnalysis present={[]} missing={[]} />);

    expect(screen.getByText("Palavras-chave encontradas")).toBeInTheDocument();
    expect(screen.getByText("Palavras-chave ausentes")).toBeInTheDocument();
  });

  it("renders present keywords", () => {
    render(<KeywordsAnalysis present={["React", "TypeScript"]} missing={[]} />);

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders missing keywords", () => {
    render(<KeywordsAnalysis present={[]} missing={["Vue", "Angular"]} />);

    expect(screen.getByText("Vue")).toBeInTheDocument();
    expect(screen.getByText("Angular")).toBeInTheDocument();
  });

  it("shows empty state for present keywords", () => {
    render(<KeywordsAnalysis present={[]} missing={["Vue"]} />);

    expect(
      screen.getByText("Nenhuma palavra-chave encontrada.")
    ).toBeInTheDocument();
  });

  it("shows empty state for missing keywords", () => {
    render(<KeywordsAnalysis present={["React"]} missing={[]} />);

    expect(
      screen.getByText("Nenhuma palavra-chave ausente.")
    ).toBeInTheDocument();
  });
});
