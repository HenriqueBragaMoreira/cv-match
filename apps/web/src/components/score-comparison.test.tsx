import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ScoreComparison } from "./score-comparison";

afterEach(cleanup);

describe("ScoreComparison", () => {
  it("renders section title", () => {
    render(<ScoreComparison originalScore={50} newScore={80} />);

    expect(screen.getByText("Comparação de pontuações")).toBeInTheDocument();
  });

  it("renders original and improved labels", () => {
    render(<ScoreComparison originalScore={50} newScore={80} />);

    expect(screen.getByText("Original")).toBeInTheDocument();
    expect(screen.getByText("Melhorado")).toBeInTheDocument();
    expect(screen.getByText("Diferença")).toBeInTheDocument();
  });

  it("renders both scores", () => {
    render(<ScoreComparison originalScore={45} newScore={82} />);

    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("82")).toBeInTheDocument();
  });

  it("shows positive delta with + prefix", () => {
    render(<ScoreComparison originalScore={45} newScore={82} />);

    expect(screen.getByText("+37 pontos")).toBeInTheDocument();
  });

  it("shows negative delta", () => {
    render(<ScoreComparison originalScore={80} newScore={70} />);

    expect(screen.getByText("-10 pontos")).toBeInTheDocument();
  });

  it("shows zero delta without 'pontos'", () => {
    render(<ScoreComparison originalScore={50} newScore={50} />);

    expect(screen.getByRole("status")).toHaveTextContent("0");
    expect(screen.getByRole("status")).not.toHaveTextContent("pontos");
  });

  it("clamps scores to 0-100 range", () => {
    render(<ScoreComparison originalScore={-10} newScore={150} />);

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("+100 pontos")).toBeInTheDocument();
  });
});
