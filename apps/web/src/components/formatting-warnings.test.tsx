import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FormattingWarnings } from "./formatting-warnings";

afterEach(cleanup);

describe("FormattingWarnings", () => {
  it("shows success message when no warnings", () => {
    render(<FormattingWarnings warnings={[]} />);

    expect(screen.getByText("Formatação ATS")).toBeInTheDocument();
    expect(
      screen.getByText(/Nenhum problema de formatação detectado/)
    ).toBeInTheDocument();
  });

  it("shows warning title when there are warnings", () => {
    render(<FormattingWarnings warnings={["Tabelas detectadas"]} />);

    expect(screen.getByText("Alertas de formatação ATS")).toBeInTheDocument();
  });

  it("renders all warning messages", () => {
    render(
      <FormattingWarnings
        warnings={[
          "Tabelas detectadas no currículo",
          "Imagens não são compatíveis com ATS",
          "Cabeçalhos em formato não padrão",
        ]}
      />
    );

    expect(
      screen.getByText("Tabelas detectadas no currículo")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Imagens não são compatíveis com ATS")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Cabeçalhos em formato não padrão")
    ).toBeInTheDocument();
  });
});
