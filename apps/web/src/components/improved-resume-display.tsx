"use client";

import { Download, FileText, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ImproveResult } from "@/services/api";

interface ImprovedResumeDisplayProps {
  result: ImproveResult;
}

function formatDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function handleDownload(text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cv-melhorado-${formatDate()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ImprovedResumeDisplay({ result }: ImprovedResumeDisplayProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="size-5 text-blue-600 dark:text-blue-400" />
            Mudanças realizadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">
            {result.changes}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5 text-green-600 dark:text-green-400" />
              CV melhorado
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(result.improvedResume)}
              aria-label="Baixar CV melhorado em formato texto"
            >
              <Download className="size-4" aria-hidden="true" />
              Baixar CV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <section aria-label="Texto do currículo melhorado">
            <pre className="bg-muted overflow-x-auto whitespace-pre-wrap break-words rounded-lg p-3 font-mono text-xs leading-relaxed sm:p-4 sm:text-sm">
              {result.improvedResume}
            </pre>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
