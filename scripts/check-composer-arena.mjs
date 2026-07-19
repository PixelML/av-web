import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";

const root = resolve(import.meta.dirname, "..");
const routeRoot = resolve(root, "src/app/bench/composer-arena");
const artifactRoot = resolve(root, "public/bench/composer-arena/v0");
const evidenceArtifactRoot = resolve(root, "public/bench/composer-arena/evidence/pilot/2026-07-19");
const release = JSON.parse(readFileSync(resolve(artifactRoot, "release.preview.json"), "utf8"));
const schema = JSON.parse(readFileSync(resolve(artifactRoot, "release.schema.json"), "utf8"));
const checksums = JSON.parse(readFileSync(resolve(artifactRoot, "checksums.json"), "utf8"));
const battles = readFileSync(resolve(artifactRoot, "battles.preview.jsonl"), "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const page = readFileSync(resolve(routeRoot, "page.tsx"), "utf8");
const client = readFileSync(resolve(routeRoot, "arena-client.tsx"), "utf8");
const data = readFileSync(resolve(routeRoot, "data.ts"), "utf8");
const methodology = readFileSync(resolve(artifactRoot, "methodology.md"), "utf8");
const handoff = readFileSync(resolve(artifactRoot, "handoff.md"), "utf8");
const evidence = JSON.parse(readFileSync(resolve(evidenceArtifactRoot, "phase-1-results.json"), "utf8"));
const evidenceSchema = JSON.parse(readFileSync(resolve(evidenceArtifactRoot, "phase-1-results.schema.json"), "utf8"));
const evidenceChecksums = JSON.parse(readFileSync(resolve(evidenceArtifactRoot, "checksums.json"), "utf8"));
const evidencePage = readFileSync(resolve(routeRoot, "evidence/pilot/2026-07-19/page.tsx"), "utf8");
const evidenceData = readFileSync(resolve(routeRoot, "evidence/pilot/2026-07-19/data.ts"), "utf8");

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function validateSchema(schemaDocument, value, label) {
  const ajv = new Ajv2020({ allErrors: true, strict: false, validateFormats: false });
  const validate = ajv.compile(schemaDocument);
  requireCondition(validate(value), `${label} schema validation failed: ${ajv.errorsText(validate.errors)}`);
}

function sha256(base, filename) {
  return createHash("sha256").update(readFileSync(resolve(base, filename))).digest("hex");
}

const requiredArtifacts = [
  "release.schema.json",
  "battle.schema.json",
  "release.preview.json",
  "battles.preview.jsonl",
  "checksums.json",
  "methodology.md",
  "handoff.md",
];

for (const artifact of requiredArtifacts) {
  requireCondition(existsSync(resolve(artifactRoot, artifact)), `missing Composer Arena artifact: ${artifact}`);
  requireCondition(page.includes(artifact), `Composer Arena page does not link ${artifact}`);
}
requireCondition(page.includes('const ARTIFACT_ROOT = "/bench/composer-arena/v0"'), "Composer Arena artifact root drifted");

for (const [filename, expected] of Object.entries(checksums.files)) {
  requireCondition(/^[0-9a-f]{64}$/.test(expected), `invalid checksum for ${filename}`);
  requireCondition(sha256(artifactRoot, filename) === expected, `checksum mismatch for ${filename}`);
}

for (const [filename, expected] of Object.entries(evidenceChecksums.files)) {
  requireCondition(/^[0-9a-f]{64}$/.test(expected), `invalid pilot checksum for ${filename}`);
  requireCondition(sha256(evidenceArtifactRoot, filename) === expected, `pilot checksum mismatch for ${filename}`);
}

requireCondition(schema.$id === "https://agentic.video/bench/composer-arena/v0/release.schema.json", "schema ID drifted");
requireCondition(schema.additionalProperties === false, "release schema must fail closed on unknown top-level fields");
validateSchema(schema, release, "preview release");
const battleSchema = JSON.parse(readFileSync(resolve(artifactRoot, "battle.schema.json"), "utf8"));
for (const battle of battles) validateSchema(battleSchema, battle, `battle ${battle.battle_id}`);
requireCondition(release.release_mode === "synthetic_non_rankable_preview", "fixtures must remain a synthetic preview");
requireCondition(release.data_class === "synthetic", "preview data class must remain synthetic");
requireCondition(release.official_ranking_enabled === false, "official ranking must remain disabled for fixtures");
requireCondition(release.official_vote_backend === "not_configured", "preview must not imply a governed vote backend");
requireCondition(release.display_label === "non-rankable preview", "preview label drifted");
requireCondition(release.dataset.repo_id === "HuggingFaceFV/finevideo", "FineVideo repo drifted");
requireCondition(release.dataset.revision === "84c74091e1c6ee7a5dffabfafb5c9033e4718883", "FineVideo revision drifted");
requireCondition(release.dataset.license_claim === "CC-BY", "FineVideo licence claim drifted");
requireCondition(release.arena_binding.source_head_sha === "824da0c1001662cb5a5a01e68c9ecc7d86a16bf7", "Arena source head drifted");
requireCondition(release.arena_binding.arena_contract_sha256 === "fb3f35346af22941d4476d390a1f2929d50653f9f50ee23cef8d7b2b1ad3ecc5", "Arena contract hash drifted");
requireCondition(release.arena_binding.parent_contract_sha256 === "33ca2f1b72ee9def3bd039eda69d9903ec595d860936a0353fdb045576215624", "parent contract hash drifted");
requireCondition(release.publication.publishable === false, "synthetic preview must not be publishable");
requireCondition(release.publication.state === "insufficient_evidence", "synthetic preview publication state must fail closed");
requireCondition(release.publication.winner === null && release.publication.rank_count === 0, "synthetic preview must have no winner or rank");
requireCondition(release.vote_provenance.collection_mode === "synthetic_fixture" && release.vote_provenance.real_human_votes === 0, "synthetic preview vote provenance drifted");
requireCondition(release.dataset.finevideo_release_sha256 === "d37cd450934c49721cb75de14353e070759c8220f1ed87567799473e8ab88926", "FineVideo release hash drifted");
requireCondition(release.dataset.split_policy.source_family_disjoint === true, "source families must remain disjoint");
requireCondition(release.dataset.split_policy.hidden_test_published === false, "hidden test must remain unpublished");

const trackIds = release.tracks.map((track) => track.id).sort();
requireCondition(
  JSON.stringify(trackIds) === JSON.stringify(["controlled-agent", "end-to-end-system"]),
  "release must contain exactly the two separate Arena tracks",
);
const canonicalTrackIds = release.tracks.map((track) => track.canonical_track_id).sort();
requireCondition(
  JSON.stringify(canonicalTrackIds) === JSON.stringify(["controlled-semantic-text-evidence-v0", "end-to-end-visual-orchestration-v0"]),
  "canonical Arena track IDs drifted",
);

for (const track of release.tracks) {
  requireCondition(track.rows.length > 0, `${track.id} has no rows`);
  requireCondition(track.rows.some((row) => row.standing === "tied"), `${track.id} must show a visible tied example`);
  requireCondition(
    track.rows.some((row) => row.standing === "insufficient_evidence"),
    `${track.id} must show insufficient evidence`,
  );

  for (const row of track.rows) {
    requireCondition(row.model && row.provider && row.version && row.evaluation_date, `${track.id} row identity is incomplete`);
    requireCondition(Number.isFinite(row.arena_score) && row.arena_score >= 0 && row.arena_score <= 100, `${track.id} row has an invalid preview score`);
    requireCondition(Array.isArray(row.arena_score_ci95) && row.arena_score_ci95.length === 2, `${track.id} row CI is invalid`);
    requireCondition(Number.isInteger(row.battle_count) && row.battle_count >= 0, `${track.id} battle count is invalid`);
    requireCondition(row.deterministic_task_success >= 0 && row.deterministic_task_success <= 1, `${track.id} task success is invalid`);
    requireCondition(row.failure_rate >= 0 && row.failure_rate <= 1, `${track.id} failure rate is invalid`);
    requireCondition(row.latency_ms_p50 >= 0, `${track.id} latency is invalid`);
    requireCondition(Object.values(row.tokens).every((value) => Number.isInteger(value) && value >= 0), `${track.id} token usage is invalid`);
    requireCondition(row.estimated_cost_usd_per_run >= 0, `${track.id} cost is invalid`);
    requireCondition(row.per_task_slices.length > 0, `${track.id} per-task slices are missing`);
  }
}

requireCondition(
  release.exploratory_capabilities.every((capability) => capability.status === "non_rankable"),
  "exploratory capabilities must remain non-rankable",
);
requireCondition(battles.length >= 2, "preview needs controlled-agent and end-to-end battle replays");
requireCondition(new Set(battles.map((battle) => battle.track)).size === 2, "battle fixtures must cover both tracks");
for (const battle of battles) {
  requireCondition(battle.source.rankable === false, `${battle.battle_id} must remain non-rankable`);
  requireCondition(battle.left.evidence.length > 0 && battle.right.evidence.length > 0, `${battle.battle_id} lacks evidence links`);
}

requireCondition(client.includes("Swap A/B order"), "battle replay must support swapped order");
requireCondition(client.includes("Both bad"), "battle replay must support both-bad judgments");
requireCondition(client.includes("Tie"), "battle replay must support tie judgments");
requireCondition(client.includes("revealed={judgment !== null}"), "model identity must reveal only after judgment");
requireCondition(client.includes("No request is sent"), "local vote exclusion must be visible");
requireCondition(data.includes("release.preview.json") && data.includes("battles.preview.jsonl"), "route must be artifact-driven");
requireCondition(methodology.includes("source families must remain disjoint"), "methodology is missing the source-family split");
requireCondition(methodology.includes("CC-BY"), "methodology is missing FineVideo attribution scope");
requireCondition(methodology.includes("official release check passes for 24 cells"), "methodology must bind the green source release");
requireCondition(methodology.includes("runner/runtime"), "methodology must disclose the missing real runner records");
requireCondition(handoff.includes("without changing React code"), "handoff must preserve schema-driven replacement");
requireCondition(handoff.includes("battle.schema.json"), "handoff must bind JSONL rows to the battle schema");
requireCondition(handoff.includes("governed vote backend"), "handoff is missing official vote governance");
requireCondition(handoff.includes("fb3f35346af22941d4476d390a1f2929d50653f9f50ee23cef8d7b2b1ad3ecc5"), "handoff is not bound to the Arena contract");
requireCondition(handoff.includes("controlled-semantic-text-evidence-v0") && handoff.includes("end-to-end-visual-orchestration-v0"), "handoff is missing canonical track separation");
requireCondition(handoff.includes("SEA Broadcast ASR remains a separate benchmark suite"), "handoff must preserve the SEA-ASR boundary");
requireCondition(!page.includes("customer data") || page.includes("never"), "page must not normalize customer data use");

requireCondition(evidenceSchema.additionalProperties === false, "pilot evidence schema must fail closed");
validateSchema(evidenceSchema, evidence, "Phase 1 pilot evidence");
requireCondition(evidence.arena_binding.source_head_sha === "824da0c1001662cb5a5a01e68c9ecc7d86a16bf7", "pilot source head drifted");
requireCondition(evidence.arena_binding.arena_contract_sha256 === "fb3f35346af22941d4476d390a1f2929d50653f9f50ee23cef8d7b2b1ad3ecc5", "pilot Arena hash drifted");
requireCondition(evidence.publication.publishable === false, "pilot evidence must not be publishable");
requireCondition(evidence.publication.state === "insufficient_evidence", "pilot evidence must remain insufficient");
requireCondition(evidence.publication.leaderboard === false, "pilot evidence must not be a leaderboard");
requireCondition(evidence.publication.winner === null, "pilot evidence must not imply a winner");
requireCondition(evidence.publication.rank_count === 0, "pilot evidence must publish zero ranks");
requireCondition(evidence.publication.human_preference_claims === false, "pilot evidence must publish zero human preference claims");
requireCondition(
  evidence.vote_provenance.blind_battles === 0 &&
    evidence.vote_provenance.real_human_votes === 0 &&
    evidence.vote_provenance.resolved_battle_groups === 0,
  "pilot evidence must publish zero battles and votes",
);

const pilotResults = Object.fromEntries(evidence.task_success.results.map((result) => [result.baseline_id, result]));
requireCondition(pilotResults["chronological-mechanical-v1"].terminal_status === "passed" && pilotResults["chronological-mechanical-v1"].output?.complete === true, "mechanical control evidence drifted");
requireCondition(pilotResults["grok-4.5-medium-v1"].terminal_status === "passed" && pilotResults["grok-4.5-medium-v1"].output?.complete === true, "Grok Phase 1 evidence drifted");
requireCondition(pilotResults["sol-medium-v1"].failure_code === "tool_denied" && pilotResults["sol-medium-v1"].task_outcome === "policy_task_failure", "Sol policy/task failure drifted");
requireCondition(pilotResults["kimi-k3-high-v1"].terminal_status === "excluded" && pilotResults["kimi-k3-high-v1"].quality_loss === false, "Kimi compatibility exclusion drifted");
requireCondition(pilotResults["glm-5.2-high-v1"].terminal_status === "not_applicable" && pilotResults["glm-5.2-high-v1"].quality_loss === false, "GLM direct-vision N/A drifted");
requireCondition(evidence.diagnostic_limitations.hyperframes_version === "0.7.64", "HyperFrames diagnostic version drifted");
requireCondition(evidence.diagnostic_limitations.mechanical_control_diagnostic_count === 8 && evidence.diagnostic_limitations.grok_4_5_diagnostic_count === 6, "HyperFrames diagnostic counts drifted");

const serializedEvidence = JSON.stringify(evidence);
for (const forbidden of ["/Users/", "/tmp/", "http://", "https://", "s3://", "signed_url", "credential", "password", "secret", "hidden_test"]) {
  requireCondition(!serializedEvidence.toLowerCase().includes(forbidden.toLowerCase()), `pilot evidence contains forbidden public material: ${forbidden}`);
}
requireCondition(evidencePage.includes("not a leaderboard"), "pilot route must visibly reject leaderboard framing");
requireCondition(evidencePage.includes("Winner: none"), "pilot route must visibly reject a winner claim");
requireCondition(evidencePage.includes("Blind battles") && evidencePage.includes("Published ranks") && evidencePage.includes("Human preference claims"), "pilot route must show all zero claim counts");
requireCondition(evidencePage.includes("HyperFrames compatibility finding"), "pilot route must disclose the HyperFrames limitation");
requireCondition(evidenceData.includes("phase-1-results.json"), "pilot route must be artifact-driven");

console.log("Composer Arena route contract check passed");
