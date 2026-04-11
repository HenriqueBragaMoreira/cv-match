"use client";

import { type DragEvent, useCallback, useRef, useState } from "react";
import { FileUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ACCEPTED_EXTENSIONS = [".pdf", ".tex"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isValidFile(file: File): string | null {
  const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
  if (!ACCEPTED_EXTENSIONS.includes(ext)) {
    return "Formato inválido. Aceitos: .pdf, .tex";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Arquivo excede o limite de 10 MB";
  }
  if (file.size === 0) {
    return "Arquivo está vazio";
  }
  return null;
}

interface ResumeUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function ResumeUpload({ file, onFileChange }: ResumeUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (selected: File) => {
      const validationError = isValidFile(selected);
      if (validationError) {
        setError(validationError);
        onFileChange(null);
        return;
      }
      setError(null);
      onFileChange(selected);
    },
    [onFileChange]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleRemove = useCallback(() => {
    setError(null);
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [onFileChange]);

  return (
    <div className="space-y-2">
      <Label>Currículo</Label>

      {file ? (
        <div className="flex items-center justify-between rounded-3xl border border-border bg-input/50 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <FileUp
              className="size-5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handleRemove}
            aria-label="Remover arquivo"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          aria-label="Selecionar arquivo de currículo (.pdf ou .tex, máx. 10 MB)"
          className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed px-4 py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
            dragOver
              ? "border-ring bg-ring/10"
              : "border-border hover:border-ring/50 hover:bg-input/30"
          }`}
        >
          <FileUp className="size-8 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium">
              Arraste e solte ou clique para selecionar
            </p>
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: .pdf, .tex (máx. 10 MB)
            </p>
          </div>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.tex"
        className="sr-only"
        aria-label="Upload de currículo"
        tabIndex={-1}
        onChange={(e) => {
          const selected = e.target.files?.[0];
          if (selected) handleFile(selected);
        }}
      />

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
