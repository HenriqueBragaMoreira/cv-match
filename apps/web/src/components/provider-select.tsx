"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type AiProvider = "openai" | "anthropic" | "google";

const providers: { value: AiProvider; label: string }[] = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "google", label: "Google" },
];

interface ProviderSelectProps {
  value: AiProvider | undefined;
  onValueChange: (value: AiProvider) => void;
}

export function ProviderSelect({ value, onValueChange }: ProviderSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="provider">Provedor de IA</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="provider" className="w-full">
          <SelectValue placeholder="Selecione um provedor" />
        </SelectTrigger>
        <SelectContent>
          {providers.map((provider) => (
            <SelectItem key={provider.value} value={provider.value}>
              {provider.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
