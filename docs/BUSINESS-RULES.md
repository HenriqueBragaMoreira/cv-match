# Business Rules

## Data Privacy

### BR-001: No server-side data persistence

- **Status**: `refined`
- **When**: Any user data (resume, job description, API key) reaches the server
- **Then**: The data is used only for the current request and discarded immediately after the response is sent. Nothing is written to disk, database, or logs.
- **Rationale**: Users are trusting the system with sensitive career data and API credentials. Zero persistence is a core trust promise.

### BR-002: API key handling

- **Status**: `refined`
- **When**: User submits an API key with their request
- **Then**: The key is forwarded directly to the AI provider in the same request cycle. It must never be logged, cached, stored in memory beyond the request lifecycle, or sent to any third party other than the selected AI provider.
- **Rationale**: API keys are sensitive credentials. Any leak could result in financial damage to the user.

## ATS Analysis

### BR-003: ATS evaluation criteria

- **Status**: `refined`
- **When**: The system sends the resume and job description to the AI model
- **Then**: The AI must evaluate strictly as an ATS bot would — matching keywords, required skills, experience years, education requirements, and certifications against what the job description explicitly asks for. The evaluation must not infer or assume qualifications not present in the resume.
- **Rationale**: The tool's value is in simulating a real ATS screening, not providing a generous or biased assessment.

### BR-004: Score range and type

- **Status**: `refined`
- **When**: The AI returns an analysis result
- **Then**: The match score must be an integer between 0 and 100 (inclusive). The API must validate and enforce this range before returning the response to the client.
- **Rationale**: Consistent scoring allows users to compare results across different resumes and job descriptions.

### BR-005: Consistent evaluation criteria

- **Status**: `refined`
- **When**: The improved CV is scored
- **Then**: The exact same ATS evaluation prompt and criteria must be used for both the original and improved CV scores. The only variable is the resume content.
- **Rationale**: A fair comparison requires identical evaluation conditions.

## CV Improvement

### BR-006: Improvement scope

- **Status**: `refined`
- **When**: The user requests a CV improvement
- **Then**: The AI must address all weaknesses identified in the original analysis. It must not fabricate experience, certifications, or skills that were not present in the original resume — it should only reorganize, rephrase, and optimize existing content.
- **Rationale**: An improved CV must remain truthful. Fabricating qualifications is unethical and could harm the user.

### BR-007: Improvement transparency

- **Status**: `refined`
- **When**: The improved CV is generated
- **Then**: The system should clearly indicate what was changed compared to the original, so the user can review and decide what to keep.
- **Rationale**: Users should maintain full control over their resume content.
