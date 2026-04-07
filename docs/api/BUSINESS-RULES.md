# Business Rules — API Layer

Enforcement status for the Hono + Cloudflare Workers API.
Definitions live in `../BUSINESS-RULES.md`.

## Data Privacy

### BR-001: No server-side data persistence
- **Status**: `refined`
- **Scope (api)**: No database bindings configured. No filesystem writes. Request data lives only in memory during the request lifecycle.

### BR-002: API key handling
- **Status**: `refined`
- **Scope (api)**: API key extracted from request, passed directly to AI SDK provider constructor, not logged or stored. Middleware must strip API key from any error responses.

## ATS Analysis

### BR-003: ATS evaluation criteria
- **Status**: `refined`
- **Scope (api)**: Standardized system prompt enforces strict ATS evaluation. Prompt is version-controlled and consistent across all requests.

### BR-004: Score range and type
- **Status**: `refined`
- **Scope (api)**: API validates the AI response to ensure score is an integer in [0, 100]. If the AI returns an out-of-range value, clamp and log a warning.

### BR-005: Consistent evaluation criteria
- **Status**: `refined`
- **Scope (api)**: The `/improve` endpoint reuses the exact same ATS prompt and parameters as `/analyze` for the re-scoring step.

## CV Improvement

### BR-006: Improvement scope
- **Status**: `refined`
- **Scope (api)**: The improvement prompt explicitly instructs the AI not to fabricate experience or skills. The prompt includes the original resume as the source of truth for factual content.

### BR-007: Improvement transparency
- **Status**: `refined`
- **Scope (api)**: The improvement response includes a `changes` summary describing what was modified.
