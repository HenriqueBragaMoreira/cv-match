"use client";

import { useCallback, useRef, useState } from "react";
import { AnalysisForm } from "@/components/analysis-form";
import { AnalysisResults } from "@/components/analysis-results";
import type { AnalysisResult } from "@/services/api";

interface FormContext {
  file: File;
  jobDescription: string;
  provider: string;
  apiKey: string;
}

export default function Page() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isImproving, setIsImproving] = useState(false);
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
    formContextRef.current = null;
  }, []);

  const handleImprove = useCallback(() => {
    // API call will be wired in task 11.2
    setIsImproving(true);
  }, []);

  if (result) {
    return (
      <AnalysisResults
        result={result}
        onBack={handleBack}
        onImprove={handleImprove}
        isImproving={isImproving}
      />
    );
  }

  return <AnalysisForm onResult={handleResult} />;
}
