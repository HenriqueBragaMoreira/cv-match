import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StrengthsWeaknesses } from "./strengths-weaknesses";

afterEach(cleanup);

describe("StrengthsWeaknesses", () => {
  it("renders both section titles", () => {
    render(<StrengthsWeaknesses strengths={[]} weaknesses={[]} />);

    expect(screen.getByText("Pontos fortes")).toBeInTheDocument();
    expect(screen.getByText("Pontos fracos")).toBeInTheDocument();
  });

  it("renders strength items", () => {
    render(
      <StrengthsWeaknesses
        strengths={["Boa experiência", "Habilidades técnicas"]}
        weaknesses={[]}
      />
    );

    expect(screen.getByText("Boa experiência")).toBeInTheDocument();
    expect(screen.getByText("Habilidades técnicas")).toBeInTheDocument();
  });

  it("renders weakness items", () => {
    render(
      <StrengthsWeaknesses
        strengths={[]}
        weaknesses={["Falta certificações", "Pouca experiência"]}
      />
    );

    expect(screen.getByText("Falta certificações")).toBeInTheDocument();
    expect(screen.getByText("Pouca experiência")).toBeInTheDocument();
  });

  it("shows empty state for strengths", () => {
    render(<StrengthsWeaknesses strengths={[]} weaknesses={["Algo"]} />);

    expect(
      screen.getByText("Nenhum ponto forte identificado.")
    ).toBeInTheDocument();
  });

  it("shows empty state for weaknesses", () => {
    render(<StrengthsWeaknesses strengths={["Algo"]} weaknesses={[]} />);

    expect(
      screen.getByText("Nenhum ponto fraco identificado.")
    ).toBeInTheDocument();
  });
});
