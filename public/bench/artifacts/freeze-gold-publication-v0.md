# SEA Broadcast ASR freeze, gold, and publication contract v0

Status: audio materialized and transcript-free gold queue initialized; human gold pending

Public home: `https://agentic.video/bench`

## Purpose

This contract closes the gap between a source review and a reproducible public table. Source approval and acquisition use a separate metadata-only source-pool contract; this contract makes later execution impossible to validate unless the exact rights, split, gold, run, and publication gates pass in order.

The locked sequence is:

1. source review;
2. private evaluator-only source freeze;
3. local asset digest verification;
4. deterministic PCM materialization and transcript-free pending-gold queue;
5. append-only transcription, independent review, and adjudication;
6. source-family-disjoint public-development/private-test validation;
7. bounded calibration and one frozen full run per unique baseline;
8. aggregate-only baseline export;
9. separate controlled-model and end-to-end public tables.

No customer/GMA data, FineVideo asset, credential-gated source, training/post-training material, model weight, hidden-test identifier, transcript, reference, or private failure history may cross the public boundary.

## Contracts

| Contract | Version | Fail-closed requirement |
|---|---|---|
| Source pool | `sea-broadcast-asr-source-pool-v0.1` | A complete-work provider licence, completed item-level licence review, immutable Commons page/file identity, explicit split/visibility, and zero customer/credential/blocked-source flags must pass before acquisition. Live metadata is rechecked before an atomic download and private SHA-256 receipt. |
| Audio materialization | `sea-broadcast-asr-audio-materialization-v0.1` | The pool and acquisition receipt must match exactly. Each local input SHA-256 is rechecked before atomic PCM s16le mono 16 kHz creation. The receipt freezes the ffmpeg version/configuration and every output digest; exact reruns reuse the immutable receipt. |
| Gold review queue | `sea-broadcast-asr-gold-review-queue-v0.1` | Two materialization receipts must cover distinct source families on the public-development and private-test sides. The queue is evaluator-private, contains no transcript/reference text, and initializes every item as `pending_transcription`. |
| Source freeze | `sea-broadcast-asr-source-freeze-v0.1` | Every source family and item is explicitly rights-approved; public dev and fixed private test use disjoint families; no source is credentialed, acquisition-blocked, or customer-derived. The manifest is private evaluator-only and embeds no media or transcript. |
| Gold ledger | `sea-broadcast-asr-gold-ledger-v0.1` | Reference revisions form one append-only parent chain. The final digest requires an author, an independent reviewer, and an adjudicator; it must match the frozen item exactly. |
| Public aggregate | `sea-broadcast-asr-public-aggregate-v0.1` | Every run is full, frozen, dated, denominator-complete, and paired-bootstrap controlled. Unknown or overlapping contamination may publish only as an explicitly unranked `public_table` row. A fair-ranked row still requires clean contamination. |
| Public release | `sea-broadcast-asr-public-release-v0.1` | At least six unique model/adapter configurations, non-empty physically separate track tables, one frozen evaluation-set identity, no duplicate configurations, and an aggregate-only allowlist. |

Exact schemas live under `benchmarks/sea_broadcast_asr/schemas/`.

## Rights decision and selected pair

Primary-source review found a lower-risk pair that does not require the unresolved SLR24 or VOA judgments:

- **Public development:** three Indonesian Presidential Secretariat broadcast files, 688.963 seconds total. The official publisher channel, whole-work CC BY 3.0 grant, completed Commons `YouTubeReview`, archived source page, page revision, asset SHA-1, size, duration, and attribution are frozen in `source-pool.public-dev.json`.
- **Private test:** seven independently published Indonesian broadcast-news files, 519.287 seconds total. The distinct publisher/channel and the same item-level licence evidence are frozen only in an evaluator-local manifest. The publisher identity, item IDs, paths, source locators, and later references do not enter the repository or public artifacts.

Both pools pass the strict schema and live Commons identity gate. The later explicit acquisition completed for every frozen item: provider byte size and SHA-1 passed, all computed acquisition SHA-256 values are unique, and no partial file remains. Fixed PCM materialization subsequently completed for all 10 items: 10 output SHA-256 values are unique, 1,208.235 seconds passed the PCM s16le mono 16 kHz inspection, and immediate reruns reused the immutable per-pool receipts. The evaluator-private pending-gold queue covers three public-development and seven private-test items across disjoint source families and contains no transcript or reference text. Detailed receipts, the queue, and the private publisher/items remain evaluator-local. SLR24 and VOA remain blocked metadata and are not part of the selected pair. No model has run.

The primary-source decision table is in `benchmarks/sea_broadcast_asr/sources/README.md`.

## Append-only and idempotent behavior

The source freeze and audio-materialization receipts are immutable. A receipt-backed audio rerun rechecks every input/output digest and returns the original receipt unchanged; an interrupted unreceipted output must reproduce byte-for-byte before it can be adopted. Gold corrections append a new revision whose parent is the current latest revision; an identical revision replay is a no-op, while reuse of an existing revision ID with different content fails. Model attempts retain the existing per-utterance append-only history and explicit refusal, empty output, timeout, malformed result, runtime error, and duplicate states.

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

Materialize the already-acquired files into the fixed evaluation profile, keeping the receipt private:

```bash
PYTHONPATH=src python -m av.cli.app bench sea-asr source-pool-materialize-audio \
  --manifest benchmarks/sea_broadcast_asr/sources/source-pool.public-dev.json \
  --acquisition-receipt /private/evaluator/receipts/public-dev.json \
  --asset-root /private/evaluator/assets \
  --audio-root /private/evaluator/audio \
  --receipt /private/evaluator/receipts/public-dev-audio.json \
  --created-at 2026-07-19T00:00:00Z \
  --created-by seanphan
```

After both sides have immutable audio receipts, initialize the private transcript-free queue:

```bash
PYTHONPATH=src python -m av.cli.app bench sea-asr gold-init \
  --public-pool benchmarks/sea_broadcast_asr/sources/source-pool.public-dev.json \
  --public-audio-receipt /private/evaluator/receipts/public-dev-audio.json \
  --private-pool /private/evaluator/source-pool.private-test.json \
  --private-audio-receipt /private/evaluator/receipts/private-test-audio.json \
  --out /private/evaluator/gold/pending-gold-queue.json \
  --created-at 2026-07-19T00:00:00Z \
  --created-by seanphan
```

These commands do not transcribe, score, call a model, or emit item details. Human reference authorship, independent review, and adjudication remain a separate gate.

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
  tests/test_sea_broadcast_asr_gold_prep.py \
  tests/test_sea_broadcast_asr_source_pool.py \
  tests/test_av_bench_pipeline.py \
  tests/test_av_bench_compat.py
python -m ruff check \
  src/av/eval/sea_broadcast_asr_release.py \
  src/av/eval/sea_broadcast_asr_gold_prep.py \
  src/av/eval/sea_broadcast_asr_source_pool.py \
  src/av/eval/sea_broadcast_asr_pipeline.py \
  src/av/cli/benchmark_cmd.py \
  tests/test_sea_broadcast_asr_release.py
git diff --check
```
