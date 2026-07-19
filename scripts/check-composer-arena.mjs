import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";

const root = resolve(import.meta.dirname, "..");
const routeRoot = resolve(root, "src/app/bench/composer-arena");
const artifactRoot = resolve(root, "public/bench/composer-arena/v0");
const evidenceArtifactRoot = resolve(root, "public/bench/composer-arena/evidence/pilot/2026-07-19");

const release = JSON.parse(readFileSync(resolve(artifactRoot, "release.preview.json"), "utf8"));
const releaseSchema = JSON.parse(readFileSync(resolve(artifactRoot, "release.schema.json"), "utf8"));
const battleSchema = JSON.parse(readFileSync(resolve(artifactRoot, "battle.schema.json"), "utf8"));
const checksums = JSON.parse(readFileSync(resolve(artifactRoot, "checksums.json"), "utf8"));
const battles = readFileSync(resolve(artifactRoot, "battles.preview.jsonl"), "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const page = readFileSync(resolve(routeRoot, "page.tsx"), "utf8");
const client = readFileSync(resolve(routeRoot, "arena-client.tsx"), "utf8");
const data = readFileSync(resolve(routeRoot, "data.ts"), "utf8");
const benchPage = readFileSync(resolve(root, "src/app/bench/page.tsx"), "utf8");
const methodology = readFileSync(resolve(artifactRoot, "methodology.md"), "utf8");
const handoff = readFileSync(resolve(artifactRoot, "handoff.md"), "utf8");

const evidence = JSON.parse(readFileSync(resolve(evidenceArtifactRoot, "seven-family-results.json"), "utf8"));
const evidenceSchema = JSON.parse(readFileSync(resolve(evidenceArtifactRoot, "seven-family-results.schema.json"), "utf8"));
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

function requireChecksumSet(base, checksumDocument, label) {
  for (const [filename, expected] of Object.entries(checksumDocument.files)) {
    requireCondition(/^[0-9a-f]{64}$/.test(expected), `invalid ${label} checksum for ${filename}`);
    requireCondition(existsSync(resolve(base, filename)), `missing checksummed ${label} artifact: ${filename}`);
    requireCondition(sha256(base, filename) === expected, `${label} checksum mismatch for ${filename}`);
  }
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
requireChecksumSet(artifactRoot, checksums, "Composer Arena");
requireChecksumSet(evidenceArtifactRoot, evidenceChecksums, "seven-family evidence");

requireCondition(releaseSchema.$id === "https://agentic.video/bench/composer-arena/v0/release.schema.json", "release schema ID drifted");
requireCondition(releaseSchema.additionalProperties === false, "release schema must fail closed on unknown top-level fields");
validateSchema(releaseSchema, release, "preview release");
for (const battle of battles) validateSchema(battleSchema, battle, `battle ${battle.battle_id}`);

requireCondition(release.release_mode === "synthetic_non_rankable_preview", "fixtures must remain a synthetic preview");
requireCondition(release.data_class === "synthetic", "preview data class must remain synthetic");
requireCondition(release.official_ranking_enabled === false, "official ranking must remain disabled");
requireCondition(release.official_vote_backend === "not_configured", "preview must not imply a governed vote backend");
requireCondition(release.display_label === "non-rankable preview", "preview label drifted");
requireCondition(release.publication.publishable === false, "preview must not be publishable");
requireCondition(release.publication.state === "insufficient_evidence", "preview publication state must fail closed");
requireCondition(release.publication.winner === null && release.publication.rank_count === 0, "preview must have no winner or rank");
requireCondition(release.vote_provenance.real_human_votes === 0, "preview must have zero real human votes");
requireCondition(release.dataset.repo_id === "HuggingFaceFV/finevideo", "FineVideo repo drifted");
requireCondition(release.dataset.revision === "84c74091e1c6ee7a5dffabfafb5c9033e4718883", "FineVideo revision drifted");
requireCondition(release.dataset.license_claim === "CC-BY", "FineVideo licence claim drifted");
requireCondition(release.dataset.finevideo_release_sha256 === "d37cd450934c49721cb75de14353e070759c8220f1ed87567799473e8ab88926", "FineVideo release hash drifted");
requireCondition(release.dataset.split_policy.source_family_disjoint === true, "source families must remain disjoint");
requireCondition(release.dataset.split_policy.hidden_test_published === false, "hidden test must remain unpublished");

const trackIds = release.tracks.map((track) => track.id).sort();
requireCondition(
  JSON.stringify(trackIds) === JSON.stringify(["controlled-agent", "end-to-end-system"]),
  "release must contain exactly two separate Arena tracks",
);
const canonicalTrackIds = release.tracks.map((track) => track.canonical_track_id).sort();
requireCondition(
  JSON.stringify(canonicalTrackIds) === JSON.stringify(["controlled-semantic-text-evidence-v0", "end-to-end-visual-orchestration-v0"]),
  "canonical Arena track IDs drifted",
);
for (const track of release.tracks) {
  requireCondition(track.rows.length === 0, `${track.id} must publish zero standing rows`);
}
requireCondition(
  release.exploratory_capabilities.every((capability) => capability.status === "non_rankable"),
  "exploratory capabilities must remain non-rankable",
);

requireCondition(battles.length === 2, "the generic demo must contain exactly two replay fixtures");
requireCondition(new Set(battles.map((battle) => battle.track)).size === 2, "demo fixtures must cover both tracks");
for (const battle of battles) {
  requireCondition(battle.source.rankable === false, `${battle.battle_id} must remain non-rankable`);
  requireCondition(battle.left.evidence.length > 0 && battle.right.evidence.length > 0, `${battle.battle_id} lacks evidence links`);
  for (const candidate of [battle.left, battle.right]) {
    requireCondition(candidate.model.startsWith("Synthetic demo "), `${battle.battle_id} leaks a non-generic candidate identity`);
    requireCondition(candidate.provider === "Not applicable", `${battle.battle_id} leaks a provider identity`);
    requireCondition(candidate.version.startsWith("fixture-"), `${battle.battle_id} leaks a route version`);
  }
}

const serializedPreview = JSON.stringify({ release, battles }).toLowerCase();
for (const forbidden of [
  "gpt-5.6",
  "grok 4.5",
  "kimi k3",
  "sol-medium-v1",
  "grok-4.5-medium-v1",
  "kimi-k3-high-v1",
]) {
  requireCondition(!serializedPreview.includes(forbidden), `public preview contains a real-model fixture identity: ${forbidden}`);
}

for (const control of ["Swap A/B order", "A is better", "B is better", "Tie", "Both bad", "Abstain"]) {
  requireCondition(client.includes(control), `local demo is missing the ${control} control`);
}
requireCondition(client.includes("revealed={judgment !== null}"), "demo identity must reveal only after judgment");
requireCondition(client.includes("No request is sent"), "local vote exclusion must be visible");
requireCondition(data.includes("release.preview.json") && data.includes("battles.preview.jsonl"), "route must be artifact-driven");

requireCondition(methodology.includes("seven-family task-success"), "methodology is missing seven-family evidence");
requireCondition(methodology.includes("source families must remain disjoint"), "methodology is missing the source-family split");
requireCondition(methodology.includes("CC-BY"), "methodology is missing FineVideo attribution scope");
requireCondition(methodology.includes("Abstain"), "methodology is missing the abstain path");
requireCondition(methodology.includes("identity mapping remain private"), "methodology is missing the sealed-identity boundary");
requireCondition(handoff.includes("battle.schema.json"), "handoff must bind JSONL rows to the battle schema");
requireCondition(handoff.includes("governed vote backend"), "handoff is missing official vote governance");
requireCondition(handoff.includes("SEA Broadcast ASR remains a separate benchmark suite"), "handoff must preserve the SEA-ASR boundary");
requireCondition(handoff.includes("abstain"), "handoff is missing the abstain path");
requireCondition(handoff.includes("outside `public/`"), "handoff is missing the private blind-packet boundary");
requireCondition(benchPage.includes("Separate benchmark suite"), "SEA-ASR page must label Composer as a separate suite");
requireCondition(benchPage.includes("does not change SEA Broadcast ASR"), "SEA-ASR page must state that Composer cannot change its result");

requireCondition(evidenceSchema.additionalProperties === false, "seven-family evidence schema must fail closed");
validateSchema(evidenceSchema, evidence, "seven-family evidence");
requireCondition(evidence.evidence_id === "composer-arena-seven-family-task-success-2026-07-19", "evidence ID drifted");
requireCondition(evidence.publication.publishable === false, "seven-family evidence must not be publishable");
requireCondition(evidence.publication.state === "insufficient_evidence", "seven-family evidence must remain insufficient");
requireCondition(evidence.publication.leaderboard === false, "seven-family evidence must not be a leaderboard");
requireCondition(evidence.publication.winner === null && evidence.publication.rank_count === 0, "seven-family evidence must have zero ranks and no winner");
requireCondition(evidence.publication.human_preference_claims === false, "seven-family evidence must make no human preference claim");
requireCondition(
  evidence.vote_provenance.blind_battles === 0 &&
    evidence.vote_provenance.real_human_votes === 0 &&
    evidence.vote_provenance.resolved_battle_groups === 0,
  "seven-family evidence must publish zero battles and votes",
);
requireCondition(
  evidence.cohort.eligible_cells === 7 &&
    evidence.cohort.distinct_source_families === 7 &&
    evidence.cohort.favorable_selection === false &&
    evidence.cohort.source_family_disjoint === true,
  "seven-family cohort gate drifted",
);

const expectedHashes = {
  staging_manifest_sha256: "0b395b961b0de0bb6a5c54ff80b13582d23f8e3d2e729aa7e950b1df8536d2b8",
  contract_sha256: "33ca2f1b72ee9def3bd039eda69d9903ec595d860936a0353fdb045576215624",
  release_sha256: "d37cd450934c49721cb75de14353e070759c8220f1ed87567799473e8ab88926",
  case_pack_sha256: "74356b45867f492688e25a10c6e13a6fa2848f41ce00aa025d83adb7639ce203",
};
for (const [key, expected] of Object.entries(expectedHashes)) {
  requireCondition(evidence.frozen_evidence[key] === expected, `seven-family ${key} drifted`);
}

const lanes = Object.fromEntries(evidence.task_success.lanes.map((lane) => [lane.lane_id, lane]));
const expectedLanes = {
  "mechanical-control": {
    classification: "control",
    identity_state: "public_control",
    structural_passes: 6,
    structural_failures: 1,
    complete_outputs_accepted: 5,
    complete_output_failures: 2,
    model_calls: 0,
    source_summary_sha256: "3b856b8f1947b30da495b3a2fce20074270777d1f09b67b574dc318133291c57",
  },
  "evaluated-lane-a": {
    classification: "evaluated_system",
    identity_state: "sealed_pending_founder_vote",
    structural_passes: 2,
    structural_failures: 5,
    complete_outputs_accepted: 2,
    complete_output_failures: 5,
    model_calls: 7,
    source_summary_sha256: "7505dd209740beb4c5696d778982de105996a01f53043ab550ce5888ae8efa1a",
  },
  "evaluated-lane-b": {
    classification: "evaluated_system",
    identity_state: "sealed_pending_founder_vote",
    structural_passes: 4,
    structural_failures: 3,
    complete_outputs_accepted: 4,
    complete_output_failures: 3,
    model_calls: 7,
    source_summary_sha256: "adde8ddfb024bc1b1993ddc0ad72c79bfc362099c49ad6045bde9e0b1e22f456",
  },
};
requireCondition(Object.keys(lanes).length === 3, "seven-family evidence must contain exactly three lanes");
for (const [laneId, expected] of Object.entries(expectedLanes)) {
  const lane = lanes[laneId];
  requireCondition(lane?.attempted_cells === 7, `${laneId} must contain seven attempted cells`);
  for (const [key, value] of Object.entries(expected)) {
    requireCondition(lane[key] === value, `${laneId} ${key} drifted`);
  }
}

for (const flag of ["packet_public", "candidate_outputs_public", "identity_mapping_public", "founder_vote_recorded"]) {
  requireCondition(evidence.blind_review[flag] === false, `blind-review flag ${flag} must remain false`);
}

const serializedEvidence = JSON.stringify(evidence).toLowerCase();
for (const forbidden of [
  "/users/",
  "/tmp/",
  "http://",
  "https://",
  "s3://",
  "signed_url",
  "credential",
  "password",
  "secret",
  "hidden_test",
  "finevideo-f567",
  "run_id",
  "output_sha256",
  "candidate_id",
  "model_id",
  "provider",
]) {
  requireCondition(!serializedEvidence.includes(forbidden), `seven-family evidence contains forbidden public material: ${forbidden}`);
}

requireCondition(evidencePage.includes("not a leaderboard"), "evidence route must visibly reject leaderboard framing");
requireCondition(evidencePage.includes("Winner: none"), "evidence route must visibly reject a winner claim");
for (const label of ["Source families", "Blind battles", "Published ranks", "Human votes"]) {
  requireCondition(evidencePage.includes(label), `evidence route is missing the ${label} count`);
}
requireCondition(evidencePage.includes("no candidate media"), "evidence route must disclose the private packet boundary");
requireCondition(evidenceData.includes("seven-family-results.json"), "evidence route must be artifact-driven");

console.log("Composer Arena route contract check passed");
