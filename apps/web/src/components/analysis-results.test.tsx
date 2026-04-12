import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnalysisResults } from "./analysis-results";
import type { AnalysisResult } from "@/services/api";

afterEach(cleanup);

const mockResult: AnalysisResult = {
  score: 72,
  strengths: ["Boa experiência"],
  weaknesses: ["Falta certificação"],
  suggestions: ["Adicionar keywords"],
  keywords: { present: ["React"], missing: ["Vue"] },
  breakdown: {
    experience: 80,
    skills: 70,
    education: 60,
    certifications: 50,
  },
  formattingWarnings: ["Tabelas detectadas"],
};

describe("AnalysisResults", () => {
  it("renders the score display", () => {
    render(
      <AnalysisResults
        result={mockResult}
        onBack={vi.fn()}
        onImprove={vi.fn()}
        isImproving={false}
      />
    );

    expect(screen.getByText("72")).toBeInTheDocument();
    expect(screen.getByText("Boa compatibilidade")).toBeInTheDocument();
  });

  it("renders all result sections", () => {
    render(
      <AnalysisResults
        result={mockResult}
        onBack={vi.fn()}
        onImprove={vi.fn()}
        isImproving={false}
      />
    );

    expect(screen.getByText("Pontos fortes")).toBeInTheDocument();
    expect(screen.getByText("Pontos fracos")).toBeInTheDocument();
    expect(screen.getByText("Sugestões de melhoria")).toBeInTheDocument();
    expect(screen.getByText("Palavras-chave encontradas")).toBeInTheDocument();
    expect(screen.getByText("Detalhamento por seção")).toBeInTheDocument();
    expect(screen.getByText("Alertas de formatação ATS")).toBeInTheDocument();
  });

  it("renders the back button", () => {
    render(
      <AnalysisResults
        result={mockResult}
        onBack={vi.fn()}
        onImprove={vi.fn()}
        isImproving={false}
      />
    );

    expect(
      screen.getByRole("button", { name: /Nova análise/ })
    ).toBeInTheDocument();
  });

  it("calls onBack when back button is clicked", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();

    render(
      <AnalysisResults
        result={mockResult}
        onBack={onBack}
        onImprove={vi.fn()}
        isImproving={false}
      />
    );

    await user.click(screen.getByRole("button", { name: /Nova análise/ }));

    expect(onBack).toHaveBeenCalledOnce();
  });

  it("renders the improve button", () => {
    render(
      <AnalysisResults
        result={mockResult}
        onBack={vi.fn()}
        onImprove={vi.fn()}
        isImproving={false}
      />
    );

    expect(
      screen.getByRole("button", { name: /Melhorar meu CV/ })
    ).toBeInTheDocument();
  });

  it("calls onImprove when improve button is clicked", async () => {
    const user = userEvent.setup();
    const onImprove = vi.fn();

    render(
      <AnalysisResults
        result={mockResult}
        onBack={vi.fn()}
        onImprove={onImprove}
        isImproving={false}
      />
    );

    await user.click(screen.getByRole("button", { name: /Melhorar meu CV/ }));

    expect(onImprove).toHaveBeenCalledOnce();
  });

  it("shows loading state when improving", () => {
    render(
      <AnalysisResults
        result={mockResult}
        onBack={vi.fn()}
        onImprove={vi.fn()}
        isImproving={true}
      />
    );

    expect(
      screen.getByRole("button", { name: /Melhorando seu CV/ })
    ).toBeDisabled();
    expect(
      screen.getByText(
        /A IA está reescrevendo seu currículo e recalculando a pontuação/
      )
    ).toBeInTheDocument();
  });

  it("shows improve error when provided", () => {
    render(
      <AnalysisResults
        result={mockResult}
        onBack={vi.fn()}
        onImprove={vi.fn()}
        isImproving={false}
        improveError="Erro ao melhorar"
      />
    );

    expect(screen.getByText("Erro ao melhorar")).toBeInTheDocument();
  });

  it("shows improve results when available", () => {
    render(
      <AnalysisResults
        result={mockResult}
        onBack={vi.fn()}
        onImprove={vi.fn()}
        isImproving={false}
        improveResult={{
          improvedResume: "Currículo melhorado aqui",
          changes: "Adicionadas keywords",
          newScore: 90,
        }}
      />
    );

    expect(screen.getByText("Comparação de pontuações")).toBeInTheDocument();
    expect(screen.getByText("Currículo melhorado aqui")).toBeInTheDocument();
  });

  it("hides improve button when improve result exists", () => {
    render(
      <AnalysisResults
        result={mockResult}
        onBack={vi.fn()}
        onImprove={vi.fn()}
        isImproving={false}
        improveResult={{
          improvedResume: "Texto",
          changes: "Mudanças",
          newScore: 90,
        }}
      />
    );

    expect(
      screen.queryByRole("button", { name: /Melhorar meu CV/ })
    ).not.toBeInTheDocument();
  });
});
