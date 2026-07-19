# SEA Broadcast ASR Benchmark v0.1

Status: FLEURS language-control preview live; broadcast pools acquired and digest-verified, human gold pending

Public brand: **Agentic Video Benchmarks by Pixel ML**

Public home: `https://agentic.video/bench`

> **Language-control developer preview — not broadcast, production, or leaderboard evidence.**

## What v0.1 proves

The harness validates versioned manifests and frozen predictions, computes deterministic ASR metrics offline, applies a fail-closed publication gate, and renders track-separated JSON/Markdown artifacts. It does not call a model, upload media, spend API/GPU budget, or claim production model quality.

The checked-in `dev-preview-0.1` fixture contains four Pixel ML-authored synthetic transcript/prediction pairs for English (Singapore), Indonesian, Filipino, and Vietnamese. Its asset type is `scoring_contract_only`; it exercises schemas, normalization, metrics, language/slice aggregation, rights metadata, and reporting. It is not an audio dataset.

## Contracts

| Contract | Version | Purpose |
|---|---|---|
| Source manifest | `sea-broadcast-asr-source-manifest-v0.2` | Metadata-only provider revision, immutable package/member evidence, package-supplied licence identity, attribution, public mode, transcript provenance, review decision, and unresolved rights questions. |
| Source pool | `sea-broadcast-asr-source-pool-v0.1` | Complete-work licence approval, item-level Commons licence review, immutable page/file identity, explicit public/private visibility, and fail-closed live revalidation before acquisition. |
| Public preview | `sea-broadcast-asr-public-preview-v0.1` | Exact visible label, FLEURS-only composition, pinned validation packages, attribution, approval evidence, and blocked-domain boundaries. |
| Contamination ledger | `sea-broadcast-asr-contamination-ledger-v0.1` | Per-model FLEURS training-overlap status and fail-closed fair-rank eligibility. |
| Manifest | `sea-broadcast-asr-manifest-v0.1` | Frozen suite/split metadata, asset digest, reference, language/slices, and item-level rights review. |
| Predictions | `sea-broadcast-asr-predictions-v0.1` | One exact-coverage frozen submission with explicit track, components/configuration, region or hardware, latency, failures, and cost basis. |
| Result | `sea-broadcast-asr-result-v0.1` | Input digests, publication decision, overall/language/slice metrics, and sample-level dev evidence. |
| Run manifest | `sea-broadcast-asr-run-manifest-v0.1` | Immutable source/model/adapter/config/hardware/date/cost metadata, stage history, fixed-test declarations, and complete terminal-state counts. |
| Utterance ledger | `sea-broadcast-asr-utterance-ledger-v0.1` | Append-only digest records, idempotent attempts, explicit failure classes, and a private digest-only adjudication queue. |
| Public aggregate | `sea-broadcast-asr-public-aggregate-v0.1` | Aggregate-only metrics, failures, latency, cost, contamination, and uncertainty with no item text, reference, media URI, or private history. |
| Source freeze | `sea-broadcast-asr-source-freeze-v0.1` | Private evaluator-only rights approvals, exact local paths/digests, and source-family-disjoint frozen public-dev/private-test membership. |
| Gold ledger | `sea-broadcast-asr-gold-ledger-v0.1` | Append-only transcript/reference revisions with independent review, adjudication, and exact frozen-reference coverage. |
| Public release | `sea-broadcast-asr-public-release-v0.1` | At least six unique frozen aggregate rows in separate controlled-model and end-to-end tables, with no private identifiers or blended ranking. |

Unknown fields and mismatched versions are rejected. Prediction coverage must match the manifest exactly. Canonical SHA-256 digests make the same inputs produce the same result ID and artifacts. Generate the JSON Schemas with:

```bash
PYTHONPATH=src python -m av.cli.app benchmark sea-asr schema \
  --out-dir benchmarks/sea_broadcast_asr/schemas
```

## Candidate source provenance

The checked-in source draft covers exactly IMDA National Speech Corpus, Google FLEURS, and OpenSLR SLR24 Iban. It remains metadata-only and contains no audio or transcript text. The real broadcast pair uses the newer source-pool contract so that public-development metadata can be published while private-test item identities remain evaluator-local.

- **FLEURS — `acquisition_script`:** approved for public dev as read-speech language controls only. Revision `70bb2e84b976b7e960aa89f1c648e09c59f894dd` pins the exact `id_id`, `fil_ph`, and `vi_vn` validation Parquet filenames, byte sizes, and provider LFS SHA-256 object IDs. The pinned dataset card supplies `CC-BY-4.0`, transcript-field provenance, attribution, and the explicit read-speech limitation.
- **IMDA NSC — `id_only`:** conditional. The official page requires registration, a Dropbox account, and an emailed shared-folder invitation for the approximately 1.2 TB six-part corpus. No registration or credentials were used, so exact package filenames/checksums and package-supplied terms remain unavailable.
- **OpenSLR SLR24 — `id_only`:** conditional. `iban.tar.gz` is pinned at 913,314,644 bytes and SHA-256 `7e22a45276268ef0aa8c1934c4a42ddf521587226c289768fba095da70159400`; its dev transcript/audio indexes are also checksummed. The public OpenSLR page says CC BY-SA 2.0 Generic, while the bundled `LICENSE.html` says CC BY-SA 2.0 France. No audio or transcript member may be re-hosted until Sean explicitly resolves that conflict and the RTM-derived rights chain.

The selected real broadcast pair avoids those unresolved sources:

- **Public development:** three Indonesian Presidential Secretariat files, 688.963 seconds total, published as complete works by the official channel under CC BY 3.0 and recorded by item-level Commons `YouTubeReview`. Exact public page revisions, file SHA-1 values, byte sizes, durations, archived source pages, and attribution live in `sources/source-pool.public-dev.json`.
- **Private test:** seven independently published Indonesian broadcast-news files, 519.287 seconds total, from a distinct evaluator-private publisher/channel, with the same completed item-level whole-work licence evidence. The publisher identity, manifest, item IDs, locators, local paths, future references, and detailed acquisition receipt remain evaluator-private.

Both pools passed strict schema validation and live Commons identity checks. SLR24 and VOA stay excluded. The explicit acquisition stage subsequently completed for every frozen item: all files match the provider byte size and SHA-1, every SHA-256 is unique, no partial file remains, and detailed receipts stay evaluator-local. Model execution remains blocked until disjoint membership and independently reviewed/adjudicated gold pass `freeze-check --require-execution-ready`.

```bash
PYTHONPATH=src python -m av.cli.app benchmark sea-asr source-check \
  --manifest benchmarks/sea_broadcast_asr/sources/source-manifest.draft.json
```

`source-check --public` fails if any source is conditional, lacks checksummed package evidence or a package-supplied licence record, contains a provider/package licence conflict, has unresolved rights questions, lacks reviewer/date metadata, or contains customer material. Approval of a source row still does not approve individual media; every future audio sample requires its own immutable digest and item-level rights review.

The approved publication input is `sources/source-manifest.public-dev.json`, containing only the pinned FLEURS record. The full three-source draft stays blocked. `public-preview/preview.json` cross-checks the source revision, three validation package hashes, CC BY 4.0 attribution, read-speech domain label, explicit approval, excluded sources, and contamination ledger before publication:

```bash
PYTHONPATH=src python -m av.cli.app benchmark sea-asr preview-check \
  --preview-manifest benchmarks/sea_broadcast_asr/public-preview/preview.json \
  --source-manifest benchmarks/sea_broadcast_asr/sources/source-manifest.public-dev.json \
  --contamination-ledger benchmarks/sea_broadcast_asr/public-preview/contamination-ledger.json \
  --public
```

This release publishes no model result or rank. Future evaluated model revisions known or declared to have trained on FLEURS must be marked `train_overlap` and excluded from fair-ranked comparison. An unknown overlap status also fails closed.

## Scoring

Normalization policy `sea-broadcast-asr-normalization-v0.1` applies:

1. Unicode NFKC.
2. Unicode case-folding.
3. Unicode punctuation replaced with spaces.
4. Whitespace collapse and trim.
5. Diacritics and written numbers preserved; no transliteration or number verbalization.

WER uses whitespace-delimited tokens. CER uses Unicode code points after normalized spaces are removed. Overall and grouped metrics are micro-averages: total edit distance divided by total reference units. v0.1 therefore reports WER only under this declared whitespace-tokenization policy; a language-specific tokenizer must be versioned before WER becomes a primary comparison for scripts without reliable whitespace word boundaries.

Speaker diarization error rate and timestamp/boundary error are intentionally absent. They become eligible only after a rights-clean fixture has human-verified speaker and timing gold plus deterministic scoring tests. Natural Mandarin-English code-switch is `not_evaluated_rights_blocked`; synthetic text may test contracts but must never be reported as quality evidence.

## Tracks

`controlled_model` receives the benchmark-defined input and may only use declared model/decoding components. `end_to_end_system` may declare preprocessing, routing, prompting, vocabulary hints, post-processing, and orchestration. Reports always render separate headings and tables; submissions from different tracks must never be blended into one rank.

## Run the dev preview

```bash
PYTHONPATH=src python -m av.cli.app benchmark sea-asr score \
  --manifest benchmarks/sea_broadcast_asr/dev/manifest.json \
  --predictions benchmarks/sea_broadcast_asr/dev/predictions.json \
  --out-dir benchmarks/sea_broadcast_asr/dev/sample-result \
  --public
```

`--public` is an explicit publication request. It fails before writing artifacts if the split is not `dev`, visibility is not `public_dev`, any item is private, pending, or marked as containing customer material/data/telemetry, or the submission lacks public-dev approval. Omit `--public` for local private evaluation; the output is then labelled not for publication.

## Public/private handling

Public dev artifacts may contain approved item references and sample metrics. The human-verified hidden test and ground truth, failure history/taxonomy, customer material/data/telemetry/corrections, and training/post-training/calibration/adjudication recipes stay outside the public tree. Because the v0 result contract contains sample-level text, it cannot publish a private-test run. The September leaderboard requires a separate reviewed aggregate-only exporter.

`source-pool-check --live` performs metadata-only preflight. `source-pool-acquire` is explicit, accepts only a frozen pool, revalidates the live page/licence/file identity, writes atomically, verifies size and SHA-1, computes SHA-256, and keeps private item details in a caller-selected local receipt. The `freeze-check` command then validates the private source freeze, disjoint source families, append-only adjudicated gold, and already-acquired local asset digests. The `public-export` command consumes local run, ledger, and scorer-result contracts, verifies complete denominators and operational totals, and writes a strict aggregate allowlist. Real unranked public-table rows require a frozen full run, fixed private test, and paired-bootstrap uncertainty; unknown or overlapping contamination remains visibly unranked. Fair leaderboard mode additionally requires clean contamination evidence. The deterministic contract fixture can exercise the path but is never rank eligible.

`table-export` refuses fewer than six unique model/adapter configurations, duplicate configurations under new run IDs, an empty track, mixed evaluation-set identities, or any contract fixture. It writes aggregate-only `release.json` and `tables.md` with physically separate track tables. See [`docs/35-sea-asr-freeze-gold-publication-v0.md`](35-sea-asr-freeze-gold-publication-v0.md).

## CLI naming contract

The public surface is `av bench sea-asr`; the existing `av benchmark sea-asr` spelling remains supported. Both names register the same command application, so `schema`, `source-check`, `source-pool-check`, `source-pool-acquire`, `preview-check`, `score`, `freeze-check`, `run-check`, `public-export`, and `table-export` preserve the same validation, artifacts, JSON envelopes, and exit codes without a second implementation path.

See [`docs/34-av-bench-compatibility-v0.md`](34-av-bench-compatibility-v0.md) for the locked mapping, exit-code contract, artifact parity, and acquisition/privacy boundary.

## Verification

```bash
PYTHONPATH=src PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 python -m pytest -q tests/test_sea_broadcast_asr.py
python -m ruff check src/av/eval/sea_broadcast_asr.py src/av/cli/benchmark_cmd.py tests/test_sea_broadcast_asr.py
git diff --check
```
