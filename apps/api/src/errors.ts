import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { HTTPException } from "hono/http-exception";

type ErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_API_KEY"
  | "PROVIDER_ERROR"
  | "NOT_FOUND"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly statusCode: ContentfulStatusCode,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }

  static validation(message: string): AppError {
    return new AppError("VALIDATION_ERROR", 400, message);
  }

  static invalidApiKey(message: string): AppError {
    return new AppError("INVALID_API_KEY", 401, message);
  }

  static provider(message: string): AppError {
    return new AppError("PROVIDER_ERROR", 502, message);
  }

  static notFound(message: string): AppError {
    return new AppError("NOT_FOUND", 404, message);
  }

  static internal(message: string): AppError {
    return new AppError("INTERNAL_ERROR", 500, message);
  }
}

const API_KEY_PATTERNS = [
  /sk-proj-[a-zA-Z0-9_-]{20,}/g,
  /sk-ant-[a-zA-Z0-9_-]{20,}/g,
  /sk-[a-zA-Z0-9_-]{20,}/g,
  /AIza[a-zA-Z0-9_-]{30,}/g,
];

export function sanitizeMessage(message: string): string {
  let sanitized = message;
  for (const pattern of API_KEY_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[REDACTED]");
  }
  return sanitized;
}

function isZodError(err: Error): err is Error & { issues: unknown[] } {
  return err.name === "ZodError" && "issues" in err;
}

export function handleError(err: Error, c: Context): Response {
  if (err instanceof AppError) {
    return c.json(
      {
        error: {
          code: err.code,
          message: sanitizeMessage(err.message),
        },
      },
      err.statusCode
    );
  }

  if (isZodError(err)) {
    return c.json(
      {
        error: {
          code: "VALIDATION_ERROR" as const,
          message: "Request validation failed",
          details: err.issues,
        },
      },
      400
    );
  }

  if (err instanceof HTTPException) {
    return c.json(
      {
        error: {
          code: "INTERNAL_ERROR" as const,
          message: sanitizeMessage(err.message),
        },
      },
      err.status
    );
  }

  return c.json(
    {
      error: {
        code: "INTERNAL_ERROR" as const,
        message: "An unexpected error occurred",
      },
    },
    500
  );
}

export function handleNotFound(c: Context): Response {
  return c.json(
    {
      error: {
        code: "NOT_FOUND" as const,
        message: `Route not found: ${c.req.method} ${c.req.path}`,
      },
    },
    404
  );
}
