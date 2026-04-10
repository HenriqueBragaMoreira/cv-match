"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ProviderSelect, type AiProvider } from "@/components/provider-select";
import { ApiKeyInput } from "@/components/api-key-input";
import { ResumeUpload } from "@/components/resume-upload";
import { JobDescriptionInput } from "@/components/job-description-input";

export function AnalysisForm() {
  const [provider, setProvider] = useState<AiProvider | undefined>(undefined);
  const [apiKey, setApiKey] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid =
    provider !== undefined &&
    apiKey.trim().length > 0 &&
    file !== null &&
    jobDescription.trim().length > 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    // API call will be wired in task 9.6
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise ATS de Currículo</CardTitle>
        <CardDescription>
          Cole seu currículo e a descrição da vaga para receber uma análise
          completa de compatibilidade ATS com IA.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <ProviderSelect value={provider} onValueChange={setProvider} />
            <ApiKeyInput
              provider={provider}
              value={apiKey}
              onChange={setApiKey}
            />
          </div>
          <ResumeUpload file={file} onFileChange={setFile} />
          <JobDescriptionInput
            value={jobDescription}
            onChange={setJobDescription}
          />
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            size="lg"
            disabled={!isValid || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2
                  className="size-4 animate-spin"
                  data-icon="inline-start"
                />
                Analisando...
              </>
            ) : (
              <>
                <Search className="size-4" data-icon="inline-start" />
                Analisar currículo
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
