import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const page = readFileSync(resolve(root, "src/app/bench/page.tsx"), "utf8");
const preview = JSON.parse(readFileSync(resolve(root, "public/bench/preview.json"), "utf8"));
const ledger = JSON.parse(readFileSync(resolve(root, "public/bench/contamination-ledger.json"), "utf8"));
const artifactRoot = resolve(root, "public/bench/artifacts");
const sourceManifest = JSON.parse(readFileSync(resolve(artifactRoot, "source-manifest.public-dev.json"), "utf8"));
const compatibilityDoc = readFileSync(resolve(artifactRoot, "av-bench-compatibility-v0.md"), "utf8");
const rightsGate = readFileSync(resolve(artifactRoot, "source-rights-gate-2026-07-19.md"), "utf8");

const label = "Language-control developer preview — not broadcast, production, or leaderboard evidence.";
const revision = "70bb2e84b976b7e960aa89f1c648e09c59f894dd";
const sourceCommit = "9275e8c46988a481ce80db1380d374d329241524";
const contractCommit = "02fb03e9fb975cea59e857ca42e2e8141352185d";
const publicArtifacts = [
  "acquire_fleurs_validation.py",
  "source-manifest.public-dev.json",
  "sea-broadcast-asr-methodology-v0.md",
  "av-bench-compatibility-v0.md",
  "source-rights-gate-2026-07-19.md",
  "public-preview-v0.1.schema.json",
  "contamination-ledger-v0.1.schema.json",
];

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

requireCondition(page.includes(label), "bench page is missing the exact approved visible label");
requireCondition(page.includes(revision), "bench page is missing the pinned FLEURS revision");
requireCondition(page.includes(sourceCommit), "bench page is missing the immutable benchmark source commit");
requireCondition(page.includes(contractCommit), "bench page is missing the immutable harness contract commit");
requireCondition(page.includes("id_only_blocked"), "bench page must keep NSC and SLR24 blocked");
requireCondition(
  page.includes("not_evaluated_rights_blocked"),
  "bench page must keep natural Mandarin-English code-switch rights-blocked",
);
requireCondition(preview.label === label, "public preview JSON label differs from the approved label");
requireCondition(preview.dataset_revision === revision, "public preview JSON revision drifted");
requireCondition(preview.permitted_public_mode === "acquisition_script", "public mode must remain acquisition_script");
requireCondition(preview.domain_label === "read_speech_language_control_not_broadcast", "domain label drifted");
requireCondition(preview.contains_audio === false && preview.contains_transcripts === false, "media must not be hosted");
requireCondition(preview.contains_customer_material === false, "customer material must not be hosted");
requireCondition(
  preview.source_manifest_uri === "https://agentic.video/bench/artifacts/source-manifest.public-dev.json",
  "preview must link the public source-manifest snapshot",
);
requireCondition(ledger.evaluated_model_count === 0, "this release must contain no evaluated models");
requireCondition(ledger.fair_ranked_comparison_enabled === false, "fair-ranked comparison must remain disabled");
requireCondition(
  ledger.policy.includes("train_overlap") && ledger.policy.includes("excluded"),
  "contamination policy must exclude FLEURS train overlap",
);
for (const artifact of publicArtifacts) {
  requireCondition(existsSync(resolve(artifactRoot, artifact)), `missing public Bench artifact: ${artifact}`);
  requireCondition(page.includes(`/bench/artifacts/${artifact}`), `bench page does not link artifact: ${artifact}`);
}
requireCondition(page.includes("github.com/PixelML/av-web/tree/"), "artifact source must use the public av-web repo");
requireCondition(!page.includes("github.com/PixelML/agentic-video"), "page must not link the private source repo");
requireCondition(sourceManifest.contains_audio === false, "public source manifest must not contain audio");
requireCondition(sourceManifest.contains_transcripts === false, "public source manifest must not contain transcripts");
requireCondition(
  sourceManifest.sources.every((source) => source.contains_customer_material === false),
  "public source manifest must not contain customer material",
);
requireCondition(
  compatibilityDoc.includes("`av bench sea-asr schema`"),
  "public CLI contract is missing av bench sea-asr",
);
requireCondition(
  compatibilityDoc.includes("aggregate-only allowlist"),
  "public CLI contract is missing the aggregate-only boundary",
);
requireCondition(
  rightsGate.includes("no real broadcast-domain candidate currently passes"),
  "public rights gate must remain fail-closed",
);

console.log("bench route contract check passed");
