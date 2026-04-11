# Requirements

## Status Reference

| Status | Meaning |
|--------|---------|
| `refined` | Written but not yet reviewed — may be vague or incomplete |
| `refined` | Reviewed and clarified by user, ready to implement |
| `in-progress` | Actively being implemented by the agent |
| `implemented` | Code written by agent, awaiting user review |
| `verified` | User reviewed and approved — only the user sets this |
| `deferred` | Intentionally postponed, not abandoned |
| `cancelled` | No longer relevant, kept for historical context |

## Functional Requirements

### Resume Analysis

#### FR-001: Resume file upload

- **Status**: `refined`
- **Description**: User can upload their current resume as a file. Accepted formats: PDF (`.pdf`) and LaTeX (`.tex`). The system extracts the text content from the uploaded file for analysis.

#### FR-002: Job description text input

- **Status**: `refined`
- **Description**: User can paste or type the full job description into a dedicated input field.

#### FR-003: API key input

- **Status**: `refined`
- **Description**: User can enter their own AI provider API key. The key is used only for the current request and is never stored or persisted.

#### FR-004: AI provider selection

- **Status**: `refined`
- **Description**: User can select which AI provider to use (OpenAI, Anthropic, Google, etc.). The system uses a unified SDK (Vercel AI SDK) to support multiple providers transparently.

#### FR-005: ATS analysis submission

- **Status**: `refined`
- **Description**: User can submit their resume and job description for analysis. The system sends both inputs to the selected AI model with a standardized ATS evaluation prompt.

#### FR-006: Match score display

- **Status**: `refined`
- **Description**: After analysis, the system displays a match score from 0 to 100 representing the likelihood of passing ATS screening for that specific job.

#### FR-007: Strengths and weaknesses

- **Status**: `refined`
- **Description**: The analysis output includes a detailed list of strengths (what aligns well with the job) and weaknesses (gaps, missing keywords, mismatches).

#### FR-008: Improvement suggestions

- **Status**: `refined`
- **Description**: The analysis output includes actionable suggestions for improving the resume to better match the job description.

#### FR-009: Keywords matching analysis

- **Status**: `refined`
- **Description**: The analysis output shows which key terms and skills from the job description are present or absent in the resume (e.g., "Python ✓, Kubernetes ✗").

#### FR-010: Section-by-section score breakdown

- **Status**: `refined`
- **Description**: The score is broken down by categories (experience, technical skills, education, certifications) so the user understands where they score well and where they fall short.

#### FR-011: ATS formatting warnings

- **Status**: `refined`
- **Description**: The analysis flags potential formatting issues that may cause problems with real ATS systems (e.g., tables, images, non-standard section headers, special characters).

### CV Improvement

#### FR-012: Generate improved CV

- **Status**: `refined`
- **Description**: After the initial analysis, the user can request the AI to generate an improved version of their resume tailored specifically for that job, addressing all identified weaknesses.

#### FR-013: Improved CV score

- **Status**: `implemented`
- **Description**: The system automatically runs the same ATS analysis on the improved CV and displays the new score alongside the original for comparison.

#### FR-014: Download improved CV

- **Status**: `refined`
- **Description**: The user can download the AI-generated improved resume. The download format should be user-friendly (e.g., plain text, markdown, or PDF).

## Non-Functional Requirements

#### NFR-001: Stateless architecture

- **Status**: `refined`
- **Description**: The system does not persist any user data. No database, no sessions, no cookies. Each analysis is a standalone request.

#### NFR-002: No authentication

- **Status**: `refined`
- **Description**: The system has no login, signup, or user accounts. Fully anonymous usage.

#### NFR-003: BYOK (Bring Your Own Key)

- **Status**: `refined`
- **Description**: Users provide their own AI provider API key. The key is sent per-request and is never stored, cached, or logged on the server.

#### NFR-004: Multi-provider support

- **Status**: `refined`
- **Description**: The system supports multiple AI providers (OpenAI, Anthropic, Google, Mistral, etc.) through the Vercel AI SDK, allowing users to choose their preferred provider.

#### NFR-005: Open source

- **Status**: `refined`
- **Description**: The project is fully open source, allowing community contributions and transparency.

#### NFR-006: UI language (pt-BR)

- **Status**: `refined`
- **Description**: The user interface is in Brazilian Portuguese only. No internationalization support.

#### NFR-007: Edge deployment

- **Status**: `refined`
- **Description**: The API runs on Cloudflare Workers (edge runtime) for low latency and global distribution.

#### NFR-008: Responsive design

- **Status**: `refined`
- **Description**: The web interface must be fully responsive and usable on mobile devices.
