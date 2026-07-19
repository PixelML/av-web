# Composer Arena real-data handoff

The route reads `release.preview.json` and `battles.preview.jsonl` from this directory at build time. Real public artifacts can replace those files without changing React code when they preserve the schema and filenames below.

## Required files

1. `release.preview.json` — one release object validated against `release.schema.json`.
2. `battles.preview.jsonl` — one JSON object per replayable battle, with each line validated against `battle.schema.json`.
3. `checksums.json` — raw SHA-256 values for the schema, release, battles, methodology, and this handoff.
4. `methodology.md` — frozen methodology, estimator, vote policy, source/rights boundary, contamination policy, and limitations.

Before a rankable release, change `release_mode` to `governed_rankable_release` and `official_ranking_enabled` to `true` only after the already-green FineVideo release marker is joined by real runner records, a governed vote backend when votes are included, a frozen statistical policy, and command-room review. Synthetic or local/demo data must remain `synthetic_non_rankable_preview`.

## Release rows

Every track row must provide:

- `standing`: `ranked`, `tie`, or `insufficient_evidence`;
- `display_rank`: ordinal text, tie text such as `T1`, or `—`;
- model, provider, version, and evaluation date;
- Arena score, two-element 95% confidence interval, and battle count;
- deterministic task success and failure rate in `[0, 1]`;
- p50 latency in milliseconds;
- input, output, cache-read, and cache-write token totals;
- estimated USD cost per run;
- at least one per-task slice with task ID, label, success rate, and battle count.

`controlled-agent` and `end-to-end-system` must remain separate track objects. Exploratory capability cards must use `status: non_rankable` and cannot be folded into Arena score.

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
- Official votes, if any, come only from a governed backend with a versioned inclusion policy.
- Schema validation, checksum verification, lint, build, route contract checks, and HTTP/UI smoke are green.
