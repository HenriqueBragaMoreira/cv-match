const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  keywords: {
    present: string[];
    missing: string[];
  };
  breakdown: {
    experience: number;
    skills: number;
    education: number;
    certifications: number;
  };
  formattingWarnings: string[];
}

export interface ImproveResult {
  improvedResume: string;
  changes: string;
  newScore: number;
}

interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const ERROR_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR:
    "Dados inválidos. Verifique o currículo e a descrição da vaga.",
  INVALID_API_KEY:
    "Chave de API inválida. Verifique sua chave e tente novamente.",
  PROVIDER_ERROR: "Erro no provedor de IA. Tente novamente mais tarde.",
  INTERNAL_ERROR: "Erro interno do servidor. Tente novamente mais tarde.",
};

function userFacingMessage(code: string, fallback: string): string {
  return ERROR_MESSAGES[code] ?? fallback;
}

export async function analyzeResume(params: {
  file: File;
  jobDescription: string;
  provider: string;
  apiKey: string;
}): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("resumeFile", params.file);
  formData.append("jobDescription", params.jobDescription);
  formData.append("provider", params.provider);
  formData.append("apiKey", params.apiKey);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new ApiError(
      "NETWORK_ERROR",
      0,
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente."
    );
  }

  if (!response.ok) {
    let body: ApiErrorBody | undefined;
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      // response body is not JSON
    }

    const code = body?.error?.code ?? "UNKNOWN_ERROR";
    const message = userFacingMessage(
      code,
      body?.error?.message ?? "Erro desconhecido. Tente novamente."
    );

    throw new ApiError(code, response.status, message);
  }

  return (await response.json()) as AnalysisResult;
}

export async function improveResume(params: {
  file: File;
  jobDescription: string;
  analysisResult: AnalysisResult;
  provider: string;
  apiKey: string;
}): Promise<ImproveResult> {
  const formData = new FormData();
  formData.append("resumeFile", params.file);
  formData.append("jobDescription", params.jobDescription);
  formData.append("analysisResult", JSON.stringify(params.analysisResult));
  formData.append("provider", params.provider);
  formData.append("apiKey", params.apiKey);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/improve`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new ApiError(
      "NETWORK_ERROR",
      0,
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente."
    );
  }

  if (!response.ok) {
    let body: ApiErrorBody | undefined;
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      // response body is not JSON
    }

    const code = body?.error?.code ?? "UNKNOWN_ERROR";
    const message = userFacingMessage(
      code,
      body?.error?.message ?? "Erro desconhecido. Tente novamente."
    );

    throw new ApiError(code, response.status, message);
  }

  return (await response.json()) as ImproveResult;
}
