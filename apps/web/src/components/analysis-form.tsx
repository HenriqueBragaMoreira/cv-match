"use client";

import { useState } from "react";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProviderSelect, type AiProvider } from "@/components/provider-select";
import { ApiKeyInput } from "@/components/api-key-input";
import { ResumeUpload } from "@/components/resume-upload";
import { JobDescriptionInput } from "@/components/job-description-input";
import { analyzeResume, ApiError, type AnalysisResult } from "@/services/api";

interface AnalysisFormProps {
  onResult?: (
    result: AnalysisResult,
    context: {
      file: File;
      jobDescription: string;
      provider: string;
      apiKey: string;
    }
  ) => void;
}

export function AnalysisForm({ onResult }: AnalysisFormProps) {
  const [provider, setProvider] = useState<AiProvider | undefined>(undefined);
  const [apiKey, setApiKey] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid =
    provider !== undefined &&
    apiKey.trim().length > 0 &&
    file !== null &&
    jobDescription.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid || isSubmitting || !provider || !file) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await analyzeResume({
        file,
        jobDescription,
        provider,
        apiKey,
      });
      onResult?.(result, { file, jobDescription, provider, apiKey });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro inesperado. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
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
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
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

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Erro na análise</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            size="lg"
            disabled={!isValid || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Analisando...
              </>
            ) : (
              <>
                <Search className="size-4" aria-hidden="true" />
                Analisar currículo
              </>
            )}
          </Button>
          {isSubmitting && (
            <p className="text-center text-xs text-muted-foreground">
              A IA está analisando seu currículo. Isso pode levar alguns
              segundos.
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
