"use client";

import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
}

function getScoreColor(score: number) {
  if (score >= 70) {
    return {
      text: "text-green-600 dark:text-green-400",
      stroke: "stroke-green-500",
      label: "Boa compatibilidade",
    };
  }
  if (score >= 40) {
    return {
      text: "text-yellow-600 dark:text-yellow-400",
      stroke: "stroke-yellow-500",
      label: "Compatibilidade parcial",
    };
  }
  return {
    text: "text-red-600 dark:text-red-400",
    stroke: "stroke-red-500",
    label: "Baixa compatibilidade",
  };
}

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const { text, stroke, label } = getScoreColor(clampedScore);
  const offset = CIRCUMFERENCE - (clampedScore / 100) * CIRCUMFERENCE;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative size-40">
        <svg className="-rotate-90" viewBox="0 0 120 120" aria-hidden="true">
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            strokeWidth="10"
            className="stroke-muted"
          />
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className={cn(
              "transition-[stroke-dashoffset] duration-700 ease-out",
              stroke
            )}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-4xl font-bold tabular-nums", text)}>
            {clampedScore}
          </span>
          <span className="text-xs text-muted-foreground">de 100</span>
        </div>
      </div>
      <p className={cn("text-sm font-medium", text)} role="status">
        {label}
      </p>
    </div>
  );
}
