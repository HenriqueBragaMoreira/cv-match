import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ResumeUpload } from "./resume-upload";

afterEach(cleanup);

function createFile(
  name: string,
  size: number,
  type = "application/pdf"
): File {
  const buffer = new ArrayBuffer(size);
  return new File([buffer], name, { type });
}

describe("ResumeUpload", () => {
  it("renders upload area when no file is selected", () => {
    render(<ResumeUpload file={null} onFileChange={vi.fn()} />);

    expect(screen.getByText("Currículo")).toBeInTheDocument();
    expect(
      screen.getByText("Arraste e solte ou clique para selecionar")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Formatos aceitos: .pdf, .tex (máx. 10 MB)")
    ).toBeInTheDocument();
  });

  it("shows file name and size when a file is selected", () => {
    const file = createFile("resume.pdf", 1024 * 500);

    render(<ResumeUpload file={file} onFileChange={vi.fn()} />);

    expect(screen.getByText("resume.pdf")).toBeInTheDocument();
    expect(screen.getByText("500.0 KB")).toBeInTheDocument();
  });

  it("shows remove button when file is selected", () => {
    const file = createFile("resume.pdf", 1024);

    render(<ResumeUpload file={file} onFileChange={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Remover arquivo" })
    ).toBeInTheDocument();
  });

  it("calls onFileChange(null) when remove button is clicked", async () => {
    const user = userEvent.setup();
    const onFileChange = vi.fn();
    const file = createFile("resume.pdf", 1024);

    render(<ResumeUpload file={file} onFileChange={onFileChange} />);

    await user.click(screen.getByRole("button", { name: "Remover arquivo" }));

    expect(onFileChange).toHaveBeenCalledWith(null);
  });

  it("accepts a valid PDF via file input", () => {
    const onFileChange = vi.fn();

    render(<ResumeUpload file={null} onFileChange={onFileChange} />);

    const input = screen.getByLabelText(
      "Upload de currículo"
    ) as HTMLInputElement;
    const file = createFile("resume.pdf", 1024);

    fireEvent.change(input, { target: { files: [file] } });

    expect(onFileChange).toHaveBeenCalledWith(file);
  });

  it("accepts a valid .tex file", () => {
    const onFileChange = vi.fn();

    render(<ResumeUpload file={null} onFileChange={onFileChange} />);

    const input = screen.getByLabelText(
      "Upload de currículo"
    ) as HTMLInputElement;
    const file = createFile("resume.tex", 512, "application/x-tex");

    fireEvent.change(input, { target: { files: [file] } });

    expect(onFileChange).toHaveBeenCalledWith(file);
  });

  it("shows error for invalid file extension", () => {
    const onFileChange = vi.fn();

    render(<ResumeUpload file={null} onFileChange={onFileChange} />);

    const input = screen.getByLabelText(
      "Upload de currículo"
    ) as HTMLInputElement;
    const file = createFile("resume.docx", 1024, "application/msword");

    fireEvent.change(input, { target: { files: [file] } });

    expect(
      screen.getByText("Formato inválido. Aceitos: .pdf, .tex")
    ).toBeInTheDocument();
    expect(onFileChange).toHaveBeenCalledWith(null);
  });

  it("shows error for oversized file", () => {
    const onFileChange = vi.fn();

    render(<ResumeUpload file={null} onFileChange={onFileChange} />);

    const input = screen.getByLabelText(
      "Upload de currículo"
    ) as HTMLInputElement;
    const file = createFile("resume.pdf", 11 * 1024 * 1024);

    fireEvent.change(input, { target: { files: [file] } });

    expect(
      screen.getByText("Arquivo excede o limite de 10 MB")
    ).toBeInTheDocument();
    expect(onFileChange).toHaveBeenCalledWith(null);
  });

  it("shows error for empty file", () => {
    const onFileChange = vi.fn();

    render(<ResumeUpload file={null} onFileChange={onFileChange} />);

    const input = screen.getByLabelText(
      "Upload de currículo"
    ) as HTMLInputElement;
    const file = createFile("resume.pdf", 0);

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText("Arquivo está vazio")).toBeInTheDocument();
    expect(onFileChange).toHaveBeenCalledWith(null);
  });
});
