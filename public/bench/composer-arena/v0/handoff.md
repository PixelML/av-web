# Composer Arena real-data handoff

The route reads `release.preview.json` and `battles.preview.jsonl` from this directory at build time. Real public artifacts can replace those files without changing React code when they preserve the schema and filenames below.

The canonical upstream contract binding is `composer-archive-to-output-arena-v0` at source head `824da0c1001662cb5a5a01e68c9ecc7d86a16bf7`, Arena contract SHA-256 `fb3f35346af22941d4476d390a1f2929d50653f9f50ee23cef8d7b2b1ad3ecc5`, and parent system-eval contract SHA-256 `33ca2f1b72ee9def3bd039eda69d9903ec595d860936a0353fdb045576215624`. A future adapter must fail closed if any binding drifts.

## Required files

1. `release.preview.json` — one release object validated against `release.schema.json`.
2. `battles.preview.jsonl` — one JSON object per replayable battle, with each line validated against `battle.schema.json`.
3. `checksums.json` — raw SHA-256 values for the schema, release, battles, methodology, and this handoff.
4. `methodology.md` — frozen methodology, estimator, vote policy, source/rights boundary, contamination policy, and limitations.

Before a rankable release, change `release_mode` to `governed_rankable_release` and `official_ranking_enabled` to `true` only after the already-green FineVideo release marker is joined by real runner records, a governed vote backend when votes are included, a frozen statistical policy, and command-room review. Synthetic or local/demo data must remain `synthetic_non_rankable_preview`.

The canonical upstream publication vocabulary is `ranked`, `tied`, and `insufficient_evidence`; public results have `scope: independent_track_results_only`. `controlled-semantic-text-evidence-v0` and `end-to-end-visual-orchestration-v0` remain separate, and a combined winner is forbidden.

SEA Broadcast ASR remains a separate benchmark suite with its own rights, source, scoring, and publication contracts. Composer Arena artifacts must not change, absorb, or reinterpret SEA-ASR state.

## Release rows

Every track row must provide:

- `standing`: `ranked`, `tied`, or `insufficient_evidence`;
- `display_rank`: ordinal text only for a governed publishable release; synthetic/pilot evidence uses `—`;
- model, provider, version, and evaluation date;
- Arena score, two-element 95% confidence interval, and battle count;
- deterministic task success and failure rate in `[0, 1]`;
- p50 latency in milliseconds;
- input, output, cache-read, and cache-write token totals;
- estimated USD cost per run;
- at least one per-task slice with task ID, label, success rate, and battle count.

`controlled-agent` and `end-to-end-system` must remain separate track objects bound to the exact canonical track IDs above. Exploratory capability cards must use `status: non_rankable` and cannot be folded into Arena score.

## Battle JSONL contract

Each line must be a self-contained object with:

- `battle_id`, `track`, `task_slice`, and the public-safe task prompt;
- a `source` object containing fixture/cell identity, source-family ID, immutable revision, and `rankable`;
- `left` and `right` candidates containing a stable candidate ID, hidden model/provider/version identity, public output title/summary, and one or more provenance/evidence links.

The browser may swap left/right display order. Judgment choices are exactly `left`, `right`, `tie`, and `both_bad`. The public client reveals identity only after a judgment and sends no vote request.

## Promotion gates

- FineVideo repo and revision match the frozen contract.
- Raw contract and selection-release SHA-256 values match reviewed markers.
- Rankable runner/runtime records exist and validate; a green source-release gate alone is not a model-result release.
- Public-eval and private-test source families are disjoint.
- No hidden test data, customer/GMA data, credentials, signed URLs, or raw reasoning traces enter public artifacts.
- Every model route passes exact-provider/model/version preflight with no fallback substitution.
- The statistical exporter emits ties and insufficient-evidence states rather than forcing ranks.
- Evidence/smoke partitions and pilot failures create deterministic evidence only; an incomplete required-roster stratum creates zero battles and no Bradley-Terry observation.
- Official votes, if any, come only from a governed backend with a versioned inclusion policy.
- Schema validation, checksum verification, lint, build, route contract checks, and HTTP/UI smoke are green.
