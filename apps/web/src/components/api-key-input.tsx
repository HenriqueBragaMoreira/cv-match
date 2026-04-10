"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AiProvider } from "@/components/provider-select";

const placeholders: Record<AiProvider, string> = {
  openai: "sk-...",
  anthropic: "sk-ant-...",
  google: "AIza...",
};

interface ApiKeyInputProps {
  provider: AiProvider | undefined;
  value: string;
  onChange: (value: string) => void;
}

export function ApiKeyInput({ provider, value, onChange }: ApiKeyInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="api-key">Chave de API</Label>
      <div className="relative">
        <Input
          id="api-key"
          type={visible ? "text" : "password"}
          autoComplete="off"
          placeholder={
            provider ? placeholders[provider] : "Selecione um provedor primeiro"
          }
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!provider}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="absolute top-1/2 right-2 -translate-y-1/2"
          onClick={() => setVisible((v) => !v)}
          disabled={!provider}
          aria-label={visible ? "Ocultar chave" : "Mostrar chave"}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
