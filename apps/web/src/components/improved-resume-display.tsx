"use client";

import { FileText, ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ImproveResult } from "@/services/api";

interface ImprovedResumeDisplayProps {
  result: ImproveResult;
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
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5 text-green-600 dark:text-green-400" />
            CV melhorado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted whitespace-pre-wrap rounded-lg p-4 font-mono text-sm leading-relaxed">
            {result.improvedResume}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
