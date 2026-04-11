"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const MAX_CHARS = 50_000;

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function JobDescriptionInput({
  value,
  onChange,
}: JobDescriptionInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="job-description">Descrição da vaga</Label>
      <Textarea
        id="job-description"
        placeholder="Cole aqui a descrição da vaga para a qual deseja se candidatar..."
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= MAX_CHARS) {
            onChange(e.target.value);
          }
        }}
        rows={6}
        aria-describedby="job-description-counter"
      />
      <p
        id="job-description-counter"
        className="text-xs text-muted-foreground text-right"
        aria-live="polite"
        aria-atomic="true"
      >
        {value.length.toLocaleString("pt-BR")}/
        {MAX_CHARS.toLocaleString("pt-BR")} caracteres
      </p>
    </div>
  );
}
