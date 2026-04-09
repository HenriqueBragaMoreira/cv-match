/**
 * Re-scoring prompt for the /improve endpoint.
 *
 * BR-005: The improved CV must be re-scored using the exact same prompt
 * and parameters as the /analyze endpoint. This module enforces that
 * contract by re-exporting the ATS analysis prompt — any change to the
 * analysis prompt automatically applies to re-scoring as well.
 */
export {
  ATS_ANALYSIS_SYSTEM_PROMPT as RE_SCORING_SYSTEM_PROMPT,
  buildAtsAnalysisUserPrompt as buildReScoringUserPrompt,
} from "./ats-analysis.js";
