import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const routeRoot = resolve(root, "src/app/bench/composer-arena");
const artifactRoot = resolve(root, "public/bench/composer-arena/v0");
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

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(filename) {
  return createHash("sha256").update(readFileSync(resolve(artifactRoot, filename))).digest("hex");
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
  requireCondition(sha256(filename) === expected, `checksum mismatch for ${filename}`);
}

requireCondition(schema.$id === "https://agentic.video/bench/composer-arena/v0/release.schema.json", "schema ID drifted");
requireCondition(schema.additionalProperties === false, "release schema must fail closed on unknown top-level fields");
requireCondition(release.release_mode === "synthetic_non_rankable_preview", "fixtures must remain a synthetic preview");
requireCondition(release.official_ranking_enabled === false, "official ranking must remain disabled for fixtures");
requireCondition(release.official_vote_backend === "not_configured", "preview must not imply a governed vote backend");
requireCondition(release.display_label === "non-rankable preview", "preview label drifted");
requireCondition(release.dataset.repo_id === "HuggingFaceFV/finevideo", "FineVideo repo drifted");
requireCondition(release.dataset.revision === "84c74091e1c6ee7a5dffabfafb5c9033e4718883", "FineVideo revision drifted");
requireCondition(release.dataset.license_claim === "CC-BY", "FineVideo licence claim drifted");
requireCondition(release.dataset.contract_sha256 === "33ca2f1b72ee9def3bd039eda69d9903ec595d860936a0353fdb045576215624", "contract hash drifted");
requireCondition(release.dataset.finevideo_release_sha256 === "d37cd450934c49721cb75de14353e070759c8220f1ed87567799473e8ab88926", "FineVideo release hash drifted");
requireCondition(release.dataset.split_policy.source_family_disjoint === true, "source families must remain disjoint");
requireCondition(release.dataset.split_policy.hidden_test_published === false, "hidden test must remain unpublished");

const trackIds = release.tracks.map((track) => track.id).sort();
requireCondition(
  JSON.stringify(trackIds) === JSON.stringify(["controlled-agent", "end-to-end-system"]),
  "release must contain exactly the two separate Arena tracks",
);

for (const track of release.tracks) {
  requireCondition(track.rows.length > 0, `${track.id} has no rows`);
  requireCondition(track.rows.some((row) => row.standing === "tie"), `${track.id} must show a visible tie`);
  requireCondition(
    track.rows.some((row) => row.standing === "insufficient_evidence"),
    `${track.id} must show insufficient evidence`,
  );

  for (const row of track.rows) {
    requireCondition(row.model && row.provider && row.version && row.evaluation_date, `${track.id} row identity is incomplete`);
    requireCondition(Number.isFinite(row.arena_score), `${track.id} row is missing Arena score`);
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
requireCondition(!page.includes("customer data") || page.includes("never"), "page must not normalize customer data use");

console.log("Composer Arena route contract check passed");
