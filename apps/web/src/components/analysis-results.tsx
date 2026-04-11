"use client";

import { AlertCircle, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreDisplay } from "@/components/score-display";
import { StrengthsWeaknesses } from "@/components/strengths-weaknesses";
import { SuggestionsList } from "@/components/suggestions-list";
import { KeywordsAnalysis } from "@/components/keywords-analysis";
import { SectionBreakdown } from "@/components/section-breakdown";
import { FormattingWarnings } from "@/components/formatting-warnings";
import { ImprovedResumeDisplay } from "@/components/improved-resume-display";
import { ScoreComparison } from "@/components/score-comparison";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AnalysisResult, ImproveResult } from "@/services/api";

interface AnalysisResultsProps {
  result: AnalysisResult;
  onBack: () => void;
  onImprove: () => void;
  isImproving: boolean;
  improveResult?: ImproveResult | null;
  improveError?: string | null;
}

export function AnalysisResults({
  result,
  onBack,
  onImprove,
  isImproving,
  improveResult,
  improveError,
}: AnalysisResultsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          disabled={isImproving}
        >
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

      {improveError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{improveError}</AlertDescription>
        </Alert>
      )}

      {!improveResult && (
        <Button
          size="lg"
          className="w-full"
          onClick={onImprove}
          disabled={isImproving}
        >
          {isImproving ? (
            <>
              <Loader2
                className="size-4 animate-spin"
                data-icon="inline-start"
              />
              Melhorando seu CV...
            </>
          ) : (
            <>
              <Sparkles className="size-4" data-icon="inline-start" />
              Melhorar meu CV
            </>
          )}
        </Button>
      )}

      {improveResult && (
        <>
          <ScoreComparison
            originalScore={result.score}
            newScore={improveResult.newScore}
          />
          <ImprovedResumeDisplay result={improveResult} />
        </>
      )}
    </div>
  );
}
