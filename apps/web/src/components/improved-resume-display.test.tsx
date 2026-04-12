import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ImprovedResumeDisplay } from "./improved-resume-display";

afterEach(cleanup);

const mockResult = {
  improvedResume: "João Silva\nDesenvolvedor Frontend\nExperiência com React",
  changes:
    "Adicionadas palavras-chave relevantes\nReorganizada seção de experiência",
  newScore: 90,
};

describe("ImprovedResumeDisplay", () => {
  it("renders changes section title", () => {
    render(<ImprovedResumeDisplay result={mockResult} />);

    expect(screen.getByText("Mudanças realizadas")).toBeInTheDocument();
  });

  it("renders CV section title", () => {
    render(<ImprovedResumeDisplay result={mockResult} />);

    expect(screen.getByText("CV melhorado")).toBeInTheDocument();
  });

  it("renders the changes summary", () => {
    render(<ImprovedResumeDisplay result={mockResult} />);

    expect(
      screen.getByText(/Adicionadas palavras-chave relevantes/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Reorganizada seção de experiência/)
    ).toBeInTheDocument();
  });

  it("renders the improved resume text", () => {
    render(<ImprovedResumeDisplay result={mockResult} />);

    expect(screen.getByText(/João Silva/)).toBeInTheDocument();
    expect(screen.getByText(/Desenvolvedor Frontend/)).toBeInTheDocument();
  });

  it("has accessible section for resume text", () => {
    render(<ImprovedResumeDisplay result={mockResult} />);

    expect(
      screen.getByLabelText("Texto do currículo melhorado")
    ).toBeInTheDocument();
  });

  it("renders download button", () => {
    render(<ImprovedResumeDisplay result={mockResult} />);

    expect(
      screen.getByRole("button", {
        name: "Baixar CV melhorado em formato texto",
      })
    ).toBeInTheDocument();
  });

  it("triggers download when download button is clicked", async () => {
    const user = userEvent.setup();

    const createObjectURL = vi.fn(() => "blob:mock-url");
    const revokeObjectURL = vi.fn();
    globalThis.URL.createObjectURL = createObjectURL;
    globalThis.URL.revokeObjectURL = revokeObjectURL;

    const clickSpy = vi.fn();
    const createElementOriginal = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      const el = createElementOriginal(tag);
      if (tag === "a") {
        Object.defineProperty(el, "click", { value: clickSpy });
      }
      return el;
    });

    render(<ImprovedResumeDisplay result={mockResult} />);

    await user.click(
      screen.getByRole("button", {
        name: "Baixar CV melhorado em formato texto",
      })
    );

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(clickSpy).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });
});
