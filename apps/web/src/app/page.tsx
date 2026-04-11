"use client";

import { useCallback, useRef, useState } from "react";
import { AnalysisForm } from "@/components/analysis-form";
import { AnalysisResults } from "@/components/analysis-results";
import type { AnalysisResult, ImproveResult } from "@/services/api";
import { improveResume, ApiError } from "@/services/api";

interface FormContext {
  file: File;
  jobDescription: string;
  provider: string;
  apiKey: string;
}

export default function Page() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isImproving, setIsImproving] = useState(false);
  const [improveResult, setImproveResult] = useState<ImproveResult | null>(
    null
  );
  const [improveError, setImproveError] = useState<string | null>(null);
  const formContextRef = useRef<FormContext | null>(null);

  const handleResult = useCallback(
    (analysisResult: AnalysisResult, context: FormContext) => {
      formContextRef.current = context;
      setResult(analysisResult);
    },
    []
  );

  const handleBack = useCallback(() => {
    setResult(null);
    setIsImproving(false);
    setImproveResult(null);
    setImproveError(null);
    formContextRef.current = null;
  }, []);

  const handleImprove = useCallback(async () => {
    const ctx = formContextRef.current;
    if (!ctx || !result) return;

    setIsImproving(true);
    setImproveError(null);

    try {
      const improvement = await improveResume({
        file: ctx.file,
        jobDescription: ctx.jobDescription,
        analysisResult: result,
        provider: ctx.provider,
        apiKey: ctx.apiKey,
      });
      setImproveResult(improvement);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Erro ao melhorar o CV. Tente novamente.";
      setImproveError(message);
    } finally {
      setIsImproving(false);
    }
  }, [result]);

  if (result) {
    return (
      <AnalysisResults
        result={result}
        onBack={handleBack}
        onImprove={handleImprove}
        isImproving={isImproving}
        improveResult={improveResult}
        improveError={improveError}
      />
    );
  }

  return <AnalysisForm onResult={handleResult} />;
}
