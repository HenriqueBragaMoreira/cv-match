import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { JobDescriptionInput } from "./job-description-input";

afterEach(cleanup);

describe("JobDescriptionInput", () => {
  it("renders label and placeholder", () => {
    render(<JobDescriptionInput value="" onChange={vi.fn()} />);

    expect(screen.getByText("Descrição da vaga")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "Cole aqui a descrição da vaga para a qual deseja se candidatar..."
      )
    ).toBeInTheDocument();
  });

  it("displays character counter", () => {
    render(<JobDescriptionInput value="hello" onChange={vi.fn()} />);

    expect(screen.getByText("5/50.000 caracteres")).toBeInTheDocument();
  });

  it("calls onChange when typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<JobDescriptionInput value="" onChange={onChange} />);

    await user.type(screen.getByLabelText("Descrição da vaga"), "test");

    expect(onChange).toHaveBeenCalled();
  });

  it("does not call onChange when at max character limit", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const maxValue = "x".repeat(50_000);

    render(<JobDescriptionInput value={maxValue} onChange={onChange} />);

    await user.type(screen.getByLabelText("Descrição da vaga"), "a");

    expect(onChange).not.toHaveBeenCalled();
  });

  it("displays formatted character count in pt-BR", () => {
    const value = "x".repeat(1234);

    render(<JobDescriptionInput value={value} onChange={vi.fn()} />);

    expect(screen.getByText("1.234/50.000 caracteres")).toBeInTheDocument();
  });
});
