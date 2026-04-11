"use client";

import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SuggestionsListProps {
  suggestions: string[];
}

function getPriorityLabel(index: number): {
  label: string;
  className: string;
} {
  if (index === 0) {
    return {
      label: "Alta",
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
  }
  if (index <= 2) {
    return {
      label: "Média",
      className:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    };
  }
  return {
    label: "Baixa",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };
}

export function SuggestionsList({ suggestions }: SuggestionsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <Lightbulb className="size-4" />
          Sugestões de melhoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma sugestão de melhoria identificada.
          </p>
        ) : (
          <ol className="space-y-3">
            {suggestions.map((suggestion, index) => {
              const priority = getPriorityLabel(index);
              return (
                <li key={suggestion} className="flex gap-3 text-sm">
                  <span className="mt-0.5 flex shrink-0 items-center gap-2">
                    <span className="flex size-5 items-center justify-center rounded-full bg-muted text-xs font-medium tabular-nums">
                      {index + 1}
                    </span>
                    <Badge variant="outline" className={priority.className}>
                      {priority.label}
                    </Badge>
                  </span>
                  <span>{suggestion}</span>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
