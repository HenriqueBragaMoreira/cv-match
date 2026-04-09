# Requirements — API Layer

Implementation status for the Hono + Cloudflare Workers API.
Definitions live in `../REQUIREMENTS.md`.

## Functional Requirements

### Resume Analysis

#### FR-001: Resume file upload
- **Status**: `refined`
- **Scope (api)**: Receive resume file via `multipart/form-data`. Accept only `.pdf` and `.tex` files. Extract text content from PDF (using a PDF parsing library compatible with edge runtime) and from `.tex` (strip LaTeX commands to get plain text). Reject unsupported file types with a clear error.

#### FR-003: API key input
- **Status**: `implemented`
- **Scope (api)**: Receive API key in request body. Validate format per provider (OpenAI `sk-`, Anthropic `sk-ant-`, Google `AIza`) via Zod `superRefine` in both `analyzeRequestSchema` and `improveRequestSchema`. Validation logic in `src/utils/api-key-validation.ts`. Never logged or persisted.

#### FR-004: AI provider selection
- **Status**: `refined`
- **Scope (api)**: Accept provider identifier in request. Initialize the correct Vercel AI SDK provider with the user-supplied key.

#### FR-005: ATS analysis submission
- **Status**: `refined`
- **Scope (api)**: `POST /analyze` endpoint. Receives resume file (via multipart/form-data), job description, provider, and API key. Extracts text from the uploaded file, constructs the ATS prompt and sends to the AI model. Returns structured analysis response.

#### FR-006: Match score display
- **Status**: `refined`
- **Scope (api)**: Return `score` (integer 0-100) in the analysis response JSON.

#### FR-007: Strengths and weaknesses
- **Status**: `refined`
- **Scope (api)**: Return `strengths` and `weaknesses` arrays in the analysis response.

#### FR-008: Improvement suggestions
- **Status**: `refined`
- **Scope (api)**: Return `suggestions` array in the analysis response.

#### FR-009: Keywords matching analysis
- **Status**: `refined`
- **Scope (api)**: Return `keywords` object with `present` and `missing` arrays in the analysis response.

#### FR-010: Section-by-section score breakdown
- **Status**: `refined`
- **Scope (api)**: Return `breakdown` object with category scores (experience, skills, education, certifications) in the analysis response.

#### FR-011: ATS formatting warnings
- **Status**: `refined`
- **Scope (api)**: Return `formattingWarnings` array in the analysis response.

### CV Improvement

#### FR-012: Generate improved CV
- **Status**: `in progress`
- **Scope (api)**: `POST /improve` endpoint. Receives original resume file (via multipart/form-data), job description, analysis result, provider, and API key. Extracts text from the uploaded file and returns improved resume text.

#### FR-013: Improved CV score
- **Status**: `refined`
- **Scope (api)**: After generating the improved CV, automatically run the same ATS analysis and return both the improved CV and its new score in the response.

## Non-Functional Requirements

#### NFR-001: Stateless architecture
- **Status**: `refined`
- **Scope (api)**: No database bindings, no KV storage, no session state. Pure request-response cycle.

#### NFR-003: BYOK
- **Status**: `refined`
- **Scope (api)**: API key received per-request, forwarded to AI provider, never stored or logged.

#### NFR-004: Multi-provider support
- **Status**: `refined`
- **Scope (api)**: Integrate Vercel AI SDK with provider packages (@ai-sdk/openai, @ai-sdk/anthropic, @ai-sdk/google, etc.).

#### NFR-007: Edge deployment
- **Status**: `refined`
- **Scope (api)**: Deploy on Cloudflare Workers. Ensure all dependencies are edge-compatible.
