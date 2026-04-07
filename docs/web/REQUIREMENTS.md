# Requirements — Web Layer

Implementation status for the Next.js frontend.
Definitions live in `../REQUIREMENTS.md`.

## Functional Requirements

### Resume Analysis

#### FR-001: Resume file upload
- **Status**: `refined`
- **Scope (web)**: File upload component (drag-and-drop + click to browse). Accepts only `.pdf` and `.tex` files. Shows file name and size after selection. Validates file type client-side before submission. Clear error message for unsupported formats.

#### FR-002: Job description text input
- **Status**: `refined`
- **Scope (web)**: Textarea component for pasting/typing job description. Clear placeholder text. Character count indicator.

#### FR-003: API key input
- **Status**: `refined`
- **Scope (web)**: Password-type input field for API key. Toggle visibility button. Provider-specific placeholder hints. Key is only held in component state, never persisted to localStorage or cookies.

#### FR-004: AI provider selection
- **Status**: `refined`
- **Scope (web)**: Dropdown/select component listing supported providers (OpenAI, Anthropic, Google, etc.). Default selection based on most common provider.

#### FR-005: ATS analysis submission
- **Status**: `refined`
- **Scope (web)**: Submit button with loading state. Sends request to API `/analyze` endpoint. Handles errors gracefully (invalid key, rate limit, network failure).

#### FR-006: Match score display
- **Status**: `refined`
- **Scope (web)**: Prominent score display (0-100) with visual indicator (color-coded: red/yellow/green). Clear label explaining what the score means.

#### FR-007: Strengths and weaknesses
- **Status**: `refined`
- **Scope (web)**: Two-column or tabbed layout showing strengths and weaknesses as lists with clear visual distinction (icons, colors).

#### FR-008: Improvement suggestions
- **Status**: `refined`
- **Scope (web)**: Ordered list of actionable suggestions with priority indicators.

#### FR-009: Keywords matching analysis
- **Status**: `refined`
- **Scope (web)**: Visual display of matched (✓) and missing (✗) keywords with color coding.

#### FR-010: Section-by-section score breakdown
- **Status**: `refined`
- **Scope (web)**: Bar chart or progress bars showing per-category scores (experience, skills, education, certifications).

#### FR-011: ATS formatting warnings
- **Status**: `refined`
- **Scope (web)**: Warning banner or alert list highlighting formatting issues with fix suggestions.

### CV Improvement

#### FR-012: Generate improved CV
- **Status**: `refined`
- **Scope (web)**: "Improve my CV" button visible after analysis results. Loading state during generation. Display the improved CV in a readable format.

#### FR-013: Improved CV score
- **Status**: `refined`
- **Scope (web)**: Side-by-side comparison of original vs improved score. Visual delta indicator (e.g., "+25 points").

#### FR-014: Download improved CV
- **Status**: `refined`
- **Scope (web)**: Download button supporting at least plain text format. Clear file naming (e.g., "cv-improved-[date].txt").

## Non-Functional Requirements

#### NFR-002: No authentication
- **Status**: `refined`
- **Scope (web)**: No login/signup UI. No auth state management. No protected routes.

#### NFR-006: UI language (pt-BR)
- **Status**: `refined`
- **Scope (web)**: All UI labels, messages, placeholders, and error messages in Brazilian Portuguese. No i18n framework needed.

#### NFR-008: Responsive design
- **Status**: `refined`
- **Scope (web)**: Mobile-first approach with Tailwind breakpoints. All features usable on screens from 320px wide.
