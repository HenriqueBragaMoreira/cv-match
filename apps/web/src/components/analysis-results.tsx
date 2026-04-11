"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreDisplay } from "@/components/score-display";
import { StrengthsWeaknesses } from "@/components/strengths-weaknesses";
import { SuggestionsList } from "@/components/suggestions-list";
import { KeywordsAnalysis } from "@/components/keywords-analysis";
import { SectionBreakdown } from "@/components/section-breakdown";
import { FormattingWarnings } from "@/components/formatting-warnings";
import type { AnalysisResult } from "@/services/api";

interface AnalysisResultsProps {
  result: AnalysisResult;
  onBack: () => void;
}

export function AnalysisResults({ result, onBack }: AnalysisResultsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Nova análise
        </Button>
      </div>

      <ScoreDisplay score={result.score} />

      <SectionBreakdown breakdown={result.breakdown} />

      <StrengthsWeaknesses
        strengths={result.strengths}
        weaknesses={result.weaknesses}
      />

      <KeywordsAnalysis
        present={result.keywords.present}
        missing={result.keywords.missing}
      />

      <SuggestionsList suggestions={result.suggestions} />

      <FormattingWarnings warnings={result.formattingWarnings} />
    </div>
  );
}
