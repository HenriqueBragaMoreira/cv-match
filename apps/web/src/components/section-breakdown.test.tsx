import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SectionBreakdown } from "./section-breakdown";

afterEach(cleanup);

const defaultBreakdown = {
  experience: 80,
  skills: 65,
  education: 45,
  certifications: 20,
};

describe("SectionBreakdown", () => {
  it("renders the section title", () => {
    render(<SectionBreakdown breakdown={defaultBreakdown} />);

    expect(screen.getByText("Detalhamento por seção")).toBeInTheDocument();
  });

  it("renders all four section labels", () => {
    render(<SectionBreakdown breakdown={defaultBreakdown} />);

    expect(screen.getByText("Experiência")).toBeInTheDocument();
    expect(screen.getByText("Habilidades")).toBeInTheDocument();
    expect(screen.getByText("Educação")).toBeInTheDocument();
    expect(screen.getByText("Certificações")).toBeInTheDocument();
  });

  it("renders the scores for each section", () => {
    render(<SectionBreakdown breakdown={defaultBreakdown} />);

    expect(screen.getByText("80")).toBeInTheDocument();
    expect(screen.getByText("65")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("renders accessible progress bars", () => {
    render(<SectionBreakdown breakdown={defaultBreakdown} />);

    expect(screen.getByLabelText("Experiência: 80 de 100")).toBeInTheDocument();
    expect(screen.getByLabelText("Habilidades: 65 de 100")).toBeInTheDocument();
    expect(screen.getByLabelText("Educação: 45 de 100")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Certificações: 20 de 100")
    ).toBeInTheDocument();
  });

  it("clamps values to 0-100 range", () => {
    render(
      <SectionBreakdown
        breakdown={{
          experience: 150,
          skills: -10,
          education: 50,
          certifications: 200,
        }}
      />
    );

    expect(screen.getAllByText("100")).toHaveLength(2); // 150 and 200 both clamp to 100
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });
});
