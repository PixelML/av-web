# SEA Broadcast ASR freeze, gold, and publication contract v0

Status: implemented contract; real source freeze remains rights-blocked

Public home: `https://agentic.video/bench`

## Purpose

This contract closes the gap between a source review and a reproducible public table. It does not approve a source, acquire media, create a reference, or execute a model. It makes those later actions impossible to validate unless the exact rights, split, gold, run, and publication gates pass in order.

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
| Source freeze | `sea-broadcast-asr-source-freeze-v0.1` | Every source family and item is explicitly rights-approved; public dev and fixed private test use disjoint families; no source is credentialed, acquisition-blocked, or customer-derived. The manifest is private evaluator-only and embeds no media or transcript. |
| Gold ledger | `sea-broadcast-asr-gold-ledger-v0.1` | Reference revisions form one append-only parent chain. The final digest requires an author, an independent reviewer, and an adjudicator; it must match the frozen item exactly. |
| Public aggregate | `sea-broadcast-asr-public-aggregate-v0.1` | Every run is full, frozen, dated, denominator-complete, and paired-bootstrap controlled. Unknown or overlapping contamination may publish only as an explicitly unranked `public_table` row. A fair-ranked row still requires clean contamination. |
| Public release | `sea-broadcast-asr-public-release-v0.1` | At least six unique model/adapter configurations, non-empty physically separate track tables, one frozen evaluation-set identity, no duplicate configurations, and an aggregate-only allowlist. |

Exact schemas live under `benchmarks/sea_broadcast_asr/schemas/`.

## Rights decision still required

Metadata-only review narrowed the only plausible two-family design:

- **SLR24/RTM Iban:** the original authors' repository at `f2147ffad2b4b044fc116284c4e05aaccbd1f070` publicly hosts the corpus under CC BY-SA 2.0 France and says RTM Sarawak supplied the news data. Sean must decide whether Pixel ML may rely on that repository-wide grant and provenance representation or must obtain authoritative clarification.
- **VOA Indonesia:** Commons page ID `110103290`, revision `1196870427`, records the candidate file as public domain, source-licence reviewed, and authored by VOA Indonesia. It lacks the separate affirmative `PD VOA (VOA)` confirmation that the full work is original VOA material rather than AP, AFP, or another third party. Sean must require that item-level confirmation before approval.

Approving only one family cannot pass the freeze: the same source family is forbidden from appearing in both public dev and private test. No media or transcript was downloaded during this review.

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
  tests/test_av_bench_pipeline.py \
  tests/test_av_bench_compat.py
python -m ruff check \
  src/av/eval/sea_broadcast_asr_release.py \
  src/av/eval/sea_broadcast_asr_pipeline.py \
  src/av/cli/benchmark_cmd.py \
  tests/test_sea_broadcast_asr_release.py
git diff --check
```
