"use client";

import { ArrowRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ScoreComparisonProps {
  originalScore: number;
  newScore: number;
}

function getScoreColor(score: number) {
  if (score >= 70) return "text-green-600 dark:text-green-400";
  if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function getDeltaColor(delta: number) {
  if (delta > 0) return "text-green-600 dark:text-green-400";
  if (delta < 0) return "text-red-600 dark:text-red-400";
  return "text-muted-foreground";
}

function formatDelta(delta: number) {
  if (delta > 0) return `+${delta}`;
  return `${delta}`;
}

export function ScoreComparison({
  originalScore,
  newScore,
}: ScoreComparisonProps) {
  const clampedOriginal = Math.max(0, Math.min(100, Math.round(originalScore)));
  const clampedNew = Math.max(0, Math.min(100, Math.round(newScore)));
  const delta = clampedNew - clampedOriginal;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="size-5 text-blue-600 dark:text-blue-400" />
          Comparação de pontuações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">Original</span>
              <span
                className={cn(
                  "text-3xl font-bold tabular-nums",
                  getScoreColor(clampedOriginal)
                )}
              >
                {clampedOriginal}
              </span>
            </div>

            <ArrowRight className="size-5 text-muted-foreground" />

            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">Melhorado</span>
              <span
                className={cn(
                  "text-3xl font-bold tabular-nums",
                  getScoreColor(clampedNew)
                )}
              >
                {clampedNew}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">Diferença</span>
            <span
              className={cn(
                "text-2xl font-bold tabular-nums",
                getDeltaColor(delta)
              )}
              role="status"
            >
              {formatDelta(delta)} {delta !== 0 && "pontos"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
