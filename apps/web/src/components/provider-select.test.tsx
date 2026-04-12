import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProviderSelect } from "./provider-select";

afterEach(cleanup);

function openSelect() {
  const trigger = screen.getByRole("combobox");
  fireEvent.pointerDown(trigger, {
    button: 0,
    ctrlKey: false,
    pointerType: "mouse",
  });
}

function selectOption(name: string) {
  openSelect();
  fireEvent.click(screen.getByRole("option", { name }));
}

describe("ProviderSelect", () => {
  it("renders label and placeholder", () => {
    render(<ProviderSelect value={undefined} onValueChange={vi.fn()} />);

    expect(screen.getByText("Provedor de IA")).toBeInTheDocument();
    expect(screen.getByText("Selecione um provedor")).toBeInTheDocument();
  });

  it("calls onValueChange when a provider is selected", () => {
    const onChange = vi.fn();

    render(<ProviderSelect value={undefined} onValueChange={onChange} />);

    selectOption("OpenAI");

    expect(onChange).toHaveBeenCalledWith("openai");
  });

  it("shows the selected provider label", () => {
    render(<ProviderSelect value="anthropic" onValueChange={vi.fn()} />);

    expect(screen.getByRole("combobox")).toHaveTextContent("Anthropic");
  });

  it("lists all three providers", () => {
    render(<ProviderSelect value={undefined} onValueChange={vi.fn()} />);

    openSelect();

    expect(screen.getByRole("option", { name: "OpenAI" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Anthropic" })
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Google" })).toBeInTheDocument();
  });
});
