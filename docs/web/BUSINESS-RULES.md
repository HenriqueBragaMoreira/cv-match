# Business Rules — Web Layer

Enforcement status for the Next.js frontend.
Definitions live in `../BUSINESS-RULES.md`.

## Data Privacy

### BR-001: No server-side data persistence
- **Status**: `refined`
- **Scope (web)**: No localStorage, sessionStorage, or cookie usage for user data. All form state is ephemeral (React component state only). Page refresh clears everything.

### BR-002: API key handling
- **Status**: `refined`
- **Scope (web)**: API key held only in React state. Input field uses `type="password"` by default. Key is sent to API in each request, never stored client-side.

## ATS Analysis

### BR-004: Score range and type
- **Status**: `refined`
- **Scope (web)**: Display score as integer. Color coding: 0-39 red, 40-69 yellow, 70-100 green. Visual scale for intuitive understanding.

## CV Improvement

### BR-007: Improvement transparency
- **Status**: `refined`
- **Scope (web)**: Display a summary of changes alongside the improved CV. Allow the user to visually compare original vs improved content.
