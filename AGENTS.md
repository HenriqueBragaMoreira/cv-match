# CV Match

Open-source tool where users paste their resume and a job description to get an AI-powered ATS analysis with a 0-100 match score, strengths/weaknesses, keyword matching, improvement suggestions, and an option to generate an optimized CV for that specific job. Users bring their own API key (BYOK) and choose their preferred AI provider.

## Docs

- `docs/REQUIREMENTS.md` — functional and non-functional requirements (definitions + aggregated status)
- `docs/BUSINESS-RULES.md` — domain rules and constraints (definitions + aggregated status)
- `docs/api/` — API layer implementation status
- `docs/web/` — Web layer implementation status

When implementing features or fixing bugs, update the relevant requirement/rule status in the layer-specific docs. Promote root doc status only when all layers reach the same status level.

## Docs Lookup

When implementing or fixing bugs involving external libraries, consult Context7 for up-to-date documentation before writing code.

## Plan Mode

- Present detailed plans with clear step-by-step breakdown.
- At the end of each plan, list unresolved questions that need answering before proceeding.

## Communication

- Documentation and code in English.
- UI text in pt-BR only (no i18n).

## Commits

- Conventional Commits format.
- Scope indicates where the change was made: `root`, `api`, or `web`.
- Examples: `feat(api): add analysis endpoint`, `fix(web): fix score display`, `chore(root): update deps`.
