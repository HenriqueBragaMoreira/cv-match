import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ScoreDisplay } from "./score-display";

afterEach(cleanup);

describe("ScoreDisplay", () => {
  it("renders the score value", () => {
    render(<ScoreDisplay score={75} />);

    expect(screen.getByText("75")).toBeInTheDocument();
    expect(screen.getByText("de 100")).toBeInTheDocument();
  });

  it("shows 'Boa compatibilidade' for score >= 70", () => {
    render(<ScoreDisplay score={85} />);

    expect(screen.getByText("Boa compatibilidade")).toBeInTheDocument();
  });

  it("shows 'Compatibilidade parcial' for score 40-69", () => {
    render(<ScoreDisplay score={55} />);

    expect(screen.getByText("Compatibilidade parcial")).toBeInTheDocument();
  });

  it("shows 'Baixa compatibilidade' for score < 40", () => {
    render(<ScoreDisplay score={20} />);

    expect(screen.getByText("Baixa compatibilidade")).toBeInTheDocument();
  });

  it("clamps score to 0-100 range", () => {
    render(<ScoreDisplay score={150} />);
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("clamps negative score to 0", () => {
    render(<ScoreDisplay score={-10} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("rounds decimal scores", () => {
    render(<ScoreDisplay score={72.7} />);
    expect(screen.getByText("73")).toBeInTheDocument();
  });

  it("has accessible aria-label with score info", () => {
    render(<ScoreDisplay score={85} />);

    expect(
      screen.getByLabelText("Pontuação ATS: 85 de 100. Boa compatibilidade")
    ).toBeInTheDocument();
  });
});
