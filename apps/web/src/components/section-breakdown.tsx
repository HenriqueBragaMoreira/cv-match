"use client";

import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SectionBreakdownProps {
  breakdown: {
    experience: number;
    skills: number;
    education: number;
    certifications: number;
  };
}

const SECTIONS = [
  { key: "experience", label: "Experiência" },
  { key: "skills", label: "Habilidades" },
  { key: "education", label: "Educação" },
  { key: "certifications", label: "Certificações" },
] as const;

function getScoreColor(score: number): string {
  if (score >= 70) return "text-green-600 dark:text-green-400";
  if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function getBarColor(score: number): string {
  if (score >= 70) return "[&>[data-slot=progress-indicator]]:bg-green-500";
  if (score >= 40) return "[&>[data-slot=progress-indicator]]:bg-yellow-500";
  return "[&>[data-slot=progress-indicator]]:bg-red-500";
}

export function SectionBreakdown({ breakdown }: SectionBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="size-4" />
          Detalhamento por seção
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {SECTIONS.map(({ key, label }) => {
            const score = Math.round(
              Math.min(100, Math.max(0, breakdown[key]))
            );
            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{label}</span>
                  <span className={`tabular-nums ${getScoreColor(score)}`}>
                    {score}
                  </span>
                </div>
                <Progress
                  value={score}
                  className={getBarColor(score)}
                  aria-label={`${label}: ${score} de 100`}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
