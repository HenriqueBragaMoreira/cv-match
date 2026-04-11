"use client";

import { useState } from "react";
import { AnalysisForm } from "@/components/analysis-form";
import { AnalysisResults } from "@/components/analysis-results";
import type { AnalysisResult } from "@/services/api";

export default function Page() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  if (result) {
    return <AnalysisResults result={result} onBack={() => setResult(null)} />;
  }

  return <AnalysisForm onResult={setResult} />;
}
