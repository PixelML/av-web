# SEA Broadcast ASR freeze, gold, and publication contract v0

Status: implemented contract; two source families rights-approved, acquisition and human gold pending

Public home: `https://agentic.video/bench`

## Purpose

This contract closes the gap between a source review and a reproducible public table. Source approval and acquisition use a separate metadata-only source-pool contract; this contract makes later execution impossible to validate unless the exact rights, split, gold, run, and publication gates pass in order.

The locked sequence is:

1. source review;
2. private evaluator-only source freeze;
3. local asset digest verification;
4. append-only transcription, independent review, and adjudication;
5. source-family-disjoint public-development/private-test validation;
6. bounded calibration and one frozen full run per unique baseline;
7. aggregate-only baseline export;
8. separate controlled-model and end-to-end public tables.

No customer/GMA data, FineVideo asset, credential-gated source, training/post-training material, model weight, hidden-test identifier, transcript, reference, or private failure history may cross the public boundary.

## Contracts

| Contract | Version | Fail-closed requirement |
|---|---|---|
| Source pool | `sea-broadcast-asr-source-pool-v0.1` | A complete-work provider licence, completed item-level licence review, immutable Commons page/file identity, explicit split/visibility, and zero customer/credential/blocked-source flags must pass before acquisition. Live metadata is rechecked before an atomic download and private SHA-256 receipt. |
| Source freeze | `sea-broadcast-asr-source-freeze-v0.1` | Every source family and item is explicitly rights-approved; public dev and fixed private test use disjoint families; no source is credentialed, acquisition-blocked, or customer-derived. The manifest is private evaluator-only and embeds no media or transcript. |
| Gold ledger | `sea-broadcast-asr-gold-ledger-v0.1` | Reference revisions form one append-only parent chain. The final digest requires an author, an independent reviewer, and an adjudicator; it must match the frozen item exactly. |
| Public aggregate | `sea-broadcast-asr-public-aggregate-v0.1` | Every run is full, frozen, dated, denominator-complete, and paired-bootstrap controlled. Unknown or overlapping contamination may publish only as an explicitly unranked `public_table` row. A fair-ranked row still requires clean contamination. |
| Public release | `sea-broadcast-asr-public-release-v0.1` | At least six unique model/adapter configurations, non-empty physically separate track tables, one frozen evaluation-set identity, no duplicate configurations, and an aggregate-only allowlist. |

Exact schemas live under `benchmarks/sea_broadcast_asr/schemas/`.

## Rights decision and selected pair

Primary-source review found a lower-risk pair that does not require the unresolved SLR24 or VOA judgments:

- **Public development:** three Indonesian Presidential Secretariat broadcast files, 688.963 seconds total. The official publisher channel, whole-work CC BY 3.0 grant, completed Commons `YouTubeReview`, archived source page, page revision, asset SHA-1, size, duration, and attribution are frozen in `source-pool.public-dev.json`.
- **Private test:** seven independently published Indonesian broadcast-news files, 519.287 seconds total. The distinct publisher/channel and the same item-level licence evidence are frozen only in an evaluator-local manifest. The publisher identity, item IDs, paths, source locators, and later references do not enter the repository or public artifacts.

Both pools pass the strict schema and live Commons identity gate, so the rights/provenance stage is complete and explicit acquisition may begin. SLR24 and VOA remain blocked metadata and are not part of the selected pair. No media or transcript was downloaded during the rights review itself.

The primary-source decision table is in `benchmarks/sea_broadcast_asr/sources/README.md`.

## Append-only and idempotent behavior

The source freeze is immutable. Gold corrections append a new revision whose parent is the current latest revision; an identical revision replay is a no-op, while reuse of an existing revision ID with different content fails. Model attempts retain the existing per-utterance append-only history and explicit refusal, empty output, timeout, malformed result, runtime error, and duplicate states.

These mechanics carry forward the useful operational patterns reviewed in Vercel Labs DeepSec at commit `8779666b2b0715f66e254f5f0308dd8a65c8820b`. The benchmark still supplies the scientific controls DeepSec does not: source-family-disjoint partitions, fixed hidden test, human gold, contamination evidence, complete WER/CER/MER denominators, paired uncertainty, and six immutable baseline rows.

## Commands

Validate freeze metadata only:

```bash
PYTHONPATH=src python -m av.cli.app bench sea-asr freeze-check \
  --source-freeze /private/evaluator/source-freeze.json
```

Validate the public source pool against live Commons metadata without acquiring it:

```bash
PYTHONPATH=src python -m av.cli.app bench sea-asr source-pool-check \
  --manifest benchmarks/sea_broadcast_asr/sources/source-pool.public-dev.json \
  --live
```

After that gate passes, acquisition remains an explicit caller-selected operation:

```bash
PYTHONPATH=src python -m av.cli.app bench sea-asr source-pool-acquire \
  --manifest benchmarks/sea_broadcast_asr/sources/source-pool.public-dev.json \
  --out-dir /private/evaluator/assets \
  --receipt /private/evaluator/receipts/public-dev.json
```

The private-test manifest uses the same commands from its evaluator-local path. The status envelope exposes only counts and pool identity; detailed item records remain in the named private receipt.

Validate exact gold and already-acquired local files after rights approval:

```bash
PYTHONPATH=src python -m av.cli.app bench sea-asr freeze-check \
  --source-freeze /private/evaluator/source-freeze.json \
  --gold-ledger /private/evaluator/gold-ledger.json \
  --asset-root /private/evaluator/assets \
  --require-execution-ready
```

The command performs no acquisition. It reads only the named private root and reports counts, never paths, item IDs, reference text, or source locators. `--require-execution-ready` also rejects contract fixtures and fails unless the real-audio freeze, complete gold, and all asset digests pass together.

After six valid run-level aggregate exports exist, write the public release by repeating `--aggregate` once for each unique row:

```bash
PYTHONPATH=src python -m av.cli.app bench sea-asr table-export \
  --aggregate /private/exports/baseline-01.json \
  --aggregate /private/exports/baseline-02.json \
  --aggregate /private/exports/baseline-03.json \
  --aggregate /private/exports/baseline-04.json \
  --aggregate /private/exports/baseline-05.json \
  --aggregate /private/exports/baseline-06.json \
  --release-id sea-broadcast-asr-v0-2026-09-30 \
  --generated-at 2026-09-30T00:00:00Z \
  --out-dir /public/release
```

The outputs are `release.json` and `tables.md`. Ranking is disabled independently in both tables by default. It can be enabled per table only when every row in that table is clean and fair-rank eligible; the tracks are never blended.

## Verification

```bash
PYTHONPATH=src PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 python -m pytest -q \
  tests/test_sea_broadcast_asr_release.py \
  tests/test_sea_broadcast_asr_source_pool.py \
  tests/test_av_bench_pipeline.py \
  tests/test_av_bench_compat.py
python -m ruff check \
  src/av/eval/sea_broadcast_asr_release.py \
  src/av/eval/sea_broadcast_asr_source_pool.py \
  src/av/eval/sea_broadcast_asr_pipeline.py \
  src/av/cli/benchmark_cmd.py \
  tests/test_sea_broadcast_asr_release.py
git diff --check
```
