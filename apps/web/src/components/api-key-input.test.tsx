import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiKeyInput } from "./api-key-input";

afterEach(cleanup);

describe("ApiKeyInput", () => {
  it("renders label", () => {
    render(<ApiKeyInput provider={undefined} value="" onChange={vi.fn()} />);

    expect(screen.getByText("Chave de API")).toBeInTheDocument();
  });

  it("is disabled when no provider is selected", () => {
    render(<ApiKeyInput provider={undefined} value="" onChange={vi.fn()} />);

    expect(screen.getByLabelText("Chave de API")).toBeDisabled();
  });

  it("is enabled when a provider is selected", () => {
    render(<ApiKeyInput provider="openai" value="" onChange={vi.fn()} />);

    expect(screen.getByLabelText("Chave de API")).toBeEnabled();
  });

  it("shows provider-specific placeholder", () => {
    render(<ApiKeyInput provider="openai" value="" onChange={vi.fn()} />);

    expect(screen.getByPlaceholderText("sk-...")).toBeInTheDocument();
  });

  it("shows generic placeholder when no provider is selected", () => {
    render(<ApiKeyInput provider={undefined} value="" onChange={vi.fn()} />);

    expect(
      screen.getByPlaceholderText("Selecione um provedor primeiro")
    ).toBeInTheDocument();
  });

  it("calls onChange when typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<ApiKeyInput provider="openai" value="" onChange={onChange} />);

    await user.type(screen.getByLabelText("Chave de API"), "sk-test");

    expect(onChange).toHaveBeenCalled();
  });

  it("defaults to password type", () => {
    render(<ApiKeyInput provider="openai" value="secret" onChange={vi.fn()} />);

    expect(screen.getByLabelText("Chave de API")).toHaveAttribute(
      "type",
      "password"
    );
  });

  it("toggles visibility when clicking the eye button", async () => {
    const user = userEvent.setup();

    render(<ApiKeyInput provider="openai" value="secret" onChange={vi.fn()} />);

    const toggle = screen.getByRole("button", { name: "Mostrar chave" });
    await user.click(toggle);

    expect(screen.getByLabelText("Chave de API")).toHaveAttribute(
      "type",
      "text"
    );

    const hideToggle = screen.getByRole("button", { name: "Ocultar chave" });
    await user.click(hideToggle);

    expect(screen.getByLabelText("Chave de API")).toHaveAttribute(
      "type",
      "password"
    );
  });
});
