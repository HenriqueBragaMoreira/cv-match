"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormattingWarningsProps {
  warnings: string[];
}

export function FormattingWarnings({ warnings }: FormattingWarningsProps) {
  if (warnings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="size-4" />
            Formatação ATS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhum problema de formatação detectado. Seu currículo está bem
            formatado para sistemas ATS.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
          <AlertTriangle className="size-4" />
          Alertas de formatação ATS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {warnings.map((warning) => (
          <Alert
            key={warning}
            variant="default"
            className="border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/20"
          >
            <AlertTriangle className="size-4 text-yellow-600 dark:text-yellow-400" />
            <AlertDescription className="text-sm">{warning}</AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}
