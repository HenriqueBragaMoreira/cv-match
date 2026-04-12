import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SuggestionsList } from "./suggestions-list";

afterEach(cleanup);

describe("SuggestionsList", () => {
  it("renders the section title", () => {
    render(<SuggestionsList suggestions={[]} />);

    expect(screen.getByText("Sugestões de melhoria")).toBeInTheDocument();
  });

  it("shows empty state when no suggestions", () => {
    render(<SuggestionsList suggestions={[]} />);

    expect(
      screen.getByText("Nenhuma sugestão de melhoria identificada.")
    ).toBeInTheDocument();
  });

  it("renders suggestion items", () => {
    render(
      <SuggestionsList
        suggestions={[
          "Adicionar mais palavras-chave",
          "Reorganizar seções",
          "Incluir métricas",
        ]}
      />
    );

    expect(
      screen.getByText("Adicionar mais palavras-chave")
    ).toBeInTheDocument();
    expect(screen.getByText("Reorganizar seções")).toBeInTheDocument();
    expect(screen.getByText("Incluir métricas")).toBeInTheDocument();
  });

  it("shows priority badges (Alta for first, Média for 2nd-3rd, Baixa for rest)", () => {
    render(
      <SuggestionsList
        suggestions={[
          "Primeira sugestão",
          "Segunda sugestão",
          "Terceira sugestão",
          "Quarta sugestão",
        ]}
      />
    );

    expect(screen.getByText("Alta")).toBeInTheDocument();
    expect(screen.getAllByText("Média")).toHaveLength(2);
    expect(screen.getByText("Baixa")).toBeInTheDocument();
  });

  it("shows numbered items", () => {
    render(<SuggestionsList suggestions={["Sugestão A", "Sugestão B"]} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
