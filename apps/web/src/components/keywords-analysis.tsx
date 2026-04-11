"use client";

import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KeywordsAnalysisProps {
  present: string[];
  missing: string[];
}

export function KeywordsAnalysis({ present, missing }: KeywordsAnalysisProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <Tag className="size-4" />
            Palavras-chave encontradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {present.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma palavra-chave encontrada.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {present.map((keyword) => (
                <Badge
                  key={keyword}
                  className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                >
                  <span aria-hidden="true">&#10003;</span>
                  <span className="ml-1">{keyword}</span>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Tag className="size-4" />
            Palavras-chave ausentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {missing.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma palavra-chave ausente.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {missing.map((keyword) => (
                <Badge
                  key={keyword}
                  className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                >
                  <span aria-hidden="true">&#10007;</span>
                  <span className="ml-1">{keyword}</span>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
