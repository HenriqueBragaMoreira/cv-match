import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnalysisForm } from "./analysis-form";

vi.mock("@/services/api", () => ({
  analyzeResume: vi.fn(),
  ApiError: class ApiError extends Error {
    code: string;
    statusCode: number;
    constructor(code: string, statusCode: number, message: string) {
      super(message);
      this.code = code;
      this.statusCode = statusCode;
      this.name = "ApiError";
    }
  },
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function selectProvider(name: string) {
  const trigger = screen.getByRole("combobox");
  fireEvent.pointerDown(trigger, {
    button: 0,
    ctrlKey: false,
    pointerType: "mouse",
  });
  fireEvent.click(screen.getByRole("option", { name }));
}

function uploadFile(fileName = "resume.pdf") {
  const input = screen.getByLabelText("Upload de currículo");
  const file = new File(["content"], fileName, { type: "application/pdf" });
  fireEvent.change(input, { target: { files: [file] } });
  return file;
}

describe("AnalysisForm", () => {
  it("renders the form with title and description", () => {
    render(<AnalysisForm />);

    expect(screen.getByText("Análise ATS de Currículo")).toBeInTheDocument();
    expect(
      screen.getByText(/Cole seu currículo e a descrição da vaga/)
    ).toBeInTheDocument();
  });

  it("renders all form fields", () => {
    render(<AnalysisForm />);

    expect(screen.getByText("Provedor de IA")).toBeInTheDocument();
    expect(screen.getByText("Chave de API")).toBeInTheDocument();
    expect(screen.getByText("Currículo")).toBeInTheDocument();
    expect(screen.getByText("Descrição da vaga")).toBeInTheDocument();
  });

  it("has submit button disabled when form is incomplete", () => {
    render(<AnalysisForm />);

    expect(
      screen.getByRole("button", { name: /Analisar currículo/ })
    ).toBeDisabled();
  });

  it("shows submit button with correct text", () => {
    render(<AnalysisForm />);

    expect(
      screen.getByRole("button", { name: /Analisar currículo/ })
    ).toBeInTheDocument();
  });

  it("calls analyzeResume and onResult on successful submission", async () => {
    const user = userEvent.setup();
    const onResult = vi.fn();
    const mockResult = {
      score: 75,
      strengths: ["Good"],
      weaknesses: ["Bad"],
      suggestions: ["Improve"],
      keywords: { present: ["react"], missing: ["vue"] },
      breakdown: {
        experience: 80,
        skills: 70,
        education: 60,
        certifications: 50,
      },
      formattingWarnings: [],
    };

    const { analyzeResume } = await import("@/services/api");
    vi.mocked(analyzeResume).mockResolvedValue(mockResult);

    render(<AnalysisForm onResult={onResult} />);

    // Select provider (Radix needs pointer events)
    selectProvider("OpenAI");

    // Type API key
    await user.type(screen.getByLabelText("Chave de API"), "sk-test123");

    // Upload file via fireEvent (custom upload component)
    uploadFile();

    // Type job description
    await user.type(
      screen.getByLabelText("Descrição da vaga"),
      "Frontend developer"
    );

    // Submit
    const submitButton = screen.getByRole("button", {
      name: /Analisar currículo/,
    });
    expect(submitButton).toBeEnabled();
    await user.click(submitButton);

    await waitFor(() => {
      expect(analyzeResume).toHaveBeenCalledWith({
        file: expect.any(File),
        jobDescription: "Frontend developer",
        provider: "openai",
        apiKey: "sk-test123",
      });
    });

    expect(onResult).toHaveBeenCalledWith(mockResult, {
      file: expect.any(File),
      jobDescription: "Frontend developer",
      provider: "openai",
      apiKey: "sk-test123",
    });
  });

  it("shows error alert when API call fails with ApiError", async () => {
    const user = userEvent.setup();
    const { analyzeResume, ApiError } = await import("@/services/api");
    vi.mocked(analyzeResume).mockRejectedValue(
      new ApiError("INVALID_API_KEY", 401, "Chave de API inválida.")
    );

    render(<AnalysisForm />);

    selectProvider("OpenAI");
    await user.type(screen.getByLabelText("Chave de API"), "sk-bad");
    uploadFile();
    await user.type(screen.getByLabelText("Descrição da vaga"), "Dev role");

    await user.click(
      screen.getByRole("button", { name: /Analisar currículo/ })
    );

    expect(
      await screen.findByText("Chave de API inválida.")
    ).toBeInTheDocument();
  });

  it("shows generic error for non-ApiError exceptions", async () => {
    const user = userEvent.setup();
    const { analyzeResume } = await import("@/services/api");
    vi.mocked(analyzeResume).mockRejectedValue(new Error("network failure"));

    render(<AnalysisForm />);

    selectProvider("OpenAI");
    await user.type(screen.getByLabelText("Chave de API"), "sk-test");
    uploadFile();
    await user.type(screen.getByLabelText("Descrição da vaga"), "Job");

    await user.click(
      screen.getByRole("button", { name: /Analisar currículo/ })
    );

    expect(
      await screen.findByText("Ocorreu um erro inesperado. Tente novamente.")
    ).toBeInTheDocument();
  });
});
