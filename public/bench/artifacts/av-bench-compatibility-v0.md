# `av bench` compatibility contract v0

Status: implemented compatibility alias for the rights-gated SEA Broadcast ASR v0 harness

Public home: `https://agentic.video/bench`

## Scope

`av bench` is the public CLI name for versioned Agentic Video Benchmark contracts. In v0 it exposes only the existing SEA Broadcast ASR contract commands. It does not create a second scorer or validation path: both command names register the same Typer `sea-asr` application and call the same Python functions.

The legacy `av benchmark` surface remains supported for compatibility. It is not deprecated by v0 because it also contains generic local profiling commands that are intentionally absent from the public `av bench` surface.

## Command mapping

| Public command | Compatible legacy command | Input validation | Output artifacts |
|---|---|---|---|
| `av bench sea-asr schema` | `av benchmark sea-asr schema` | Strict contract/schema generation | Versioned JSON Schemas in the requested output directory |
| `av bench sea-asr source-check` | `av benchmark sea-asr source-check` | Source revision, immutable evidence, licence, review, public-mode, and customer-material gates | JSON status envelope only |
| `av bench sea-asr preview-check` | `av benchmark sea-asr preview-check` | Preview/source/contamination cross-check plus exact label and rights boundary | JSON status envelope only |
| `av bench sea-asr score` | `av benchmark sea-asr score` | Exact manifest/prediction coverage, version, track, rights, visibility, and publication approval | Deterministic `result.json` and `report.md` |
| `av bench sea-asr run-check` | `av benchmark sea-asr run-check` | Immutable run metadata, exact utterance coverage, explicit completion states, latency, cost, and token totals | JSON status envelope only |
| `av bench sea-asr freeze-check` | `av benchmark sea-asr freeze-check` | Rights-approved source families/items, disjoint frozen splits, append-only adjudicated gold, and optional already-acquired local digests | JSON status envelope only |
| `av bench sea-asr public-export` | `av benchmark sea-asr public-export` | Complete denominators, aggregate-only allowlist, contamination, uncertainty, and fair-rank gates | Versioned public aggregate JSON |
| `av bench sea-asr table-export` | `av benchmark sea-asr table-export` | At least six unique frozen aggregates, common evaluation identity, physically separate tracks, and no private fields | Aggregate-only `release.json` and `tables.md` |

For identical inputs, the two names emit byte-identical benchmark artifacts and the same JSON `data` or `error` contract. Request IDs and elapsed timing in the CLI envelope are operational metadata and may differ between invocations.

## Exit codes

| Code | Contract |
|---|---|
| `0` | Command completed and every requested validation/publication gate passed. |
| `1` | The command was parsed but input, schema, rights, provenance, contamination, publication, filesystem, or runtime validation failed. The command emits its existing structured JSON error code. |
| `2` | Typer rejected command syntax or an unknown command/option before benchmark execution. |

The alias does not translate or suppress failures. In particular, `source-check --public`, `preview-check --public`, and `score --public` retain the existing fail-closed behavior.

## Artifact and privacy boundary

- `schema` emits the existing manifest, predictions, result, source-manifest, public-preview, and contamination-ledger schemas plus the source-freeze, gold-ledger, immutable run-manifest, append-only utterance-ledger, aggregate, and two-table public-release schemas.
- `source-check` and `preview-check` validate metadata only and do not acquire assets.
- `score` consumes an already frozen manifest and predictions file; it never calls a model.
- `run-check` requires one explicit terminal state per expected utterance: `completed`, `refusal`, `empty_output`, `timeout`, `malformed_result`, `runtime_error`, or `duplicate`. No state is silently dropped from the denominator.
- `public-export` emits only approved aggregates. It cannot fetch or infer the private test set and rejects item-level transcript, reference, media, sample-metric, or private-failure-history fields.
- `freeze-check` performs no acquisition; it validates only the named private metadata/gold files and, when explicitly requested, verifies files already present under one local private root.
- `table-export` never reads the source freeze, gold ledger, media, references, or item rows. It accepts aggregate-only inputs and refuses fewer than six unique configurations or a missing track.
- `av bench run` and `av bench template` do not exist. The generic legacy profiling commands are not public-suite operations.
- No customer/GMA data, FineVideo asset, hidden-test content, failure history, credential, training/post-training recipe, or model weight belongs in this surface.

Adding a future asset fetcher, live adapter runner, or new suite requires its own reviewed contract and rights gate. This alias alone authorizes none of them.

## Pipeline architecture rationale

The append-only mechanics follow the useful operational patterns in [Vercel Labs DeepSec at `8779666`](https://github.com/vercel-labs/deepsec/tree/8779666b2b0715f66e254f5f0308dd8a65c8820b): staged cheap-to-expensive work, one atomic record with history, immutable run metadata, idempotent retry, explicit refusal/error states, schema-validated merge, read-only export, and deterministic stub-agent e2e coverage. DeepSec is Apache-2.0; this implementation is independent Python code using the pattern, not copied source.

DeepSec is an operational evaluation pipeline, not the scientific contract for this benchmark. SEA Broadcast ASR therefore adds controls that its TP/FP revalidation metrics do not supply:

- source-family-disjoint development and fixed private-test declarations;
- a versioned human-gold protocol and a digest-only adjudication queue;
- an explicit contamination/training-overlap ledger and no hidden-test tuning;
- complete WER/CER/MER denominators where refusals, empty output, timeouts, malformed results, runtime errors, and duplicates remain counted;
- paired-bootstrap uncertainty/significance as a gate for real leaderboard exports;
- immutable dated baseline runs rather than a mutable latest result;
- an aggregate-only allowlist that cannot serialize item text, references, media locations, or private failure history.

The frozen private-test manifest digest remains only in the local run manifest. Public aggregates expose an opaque evaluation-set version and the approved public source-manifest hash, never the private-test digest.

The run sequence is locked as:

1. `acquire_validate`
2. `run_adapter`
3. `score`
4. `adjudicate_revalidate`
5. `aggregate`
6. `public_export`

The checked-in `pipeline-fixture/` is a bounded calibration run over four CC0 synthetic text pairs with a deterministic no-model stub. It tests the complete CLI path but is neither broadcast evidence nor one of the six Sep 30 baselines.

## Examples

Generate the public contracts:

```bash
PYTHONPATH=src python -m av.cli.app bench sea-asr schema \
  --out-dir benchmarks/sea_broadcast_asr/schemas
```

Validate the currently approved FLEURS-only read-speech preview without acquiring it:

```bash
PYTHONPATH=src python -m av.cli.app bench sea-asr preview-check \
  --preview-manifest benchmarks/sea_broadcast_asr/public-preview/preview.json \
  --source-manifest benchmarks/sea_broadcast_asr/sources/source-manifest.public-dev.json \
  --contamination-ledger benchmarks/sea_broadcast_asr/public-preview/contamination-ledger.json \
  --public
```

The FLEURS preview remains language-control evidence only, with zero evaluated models and no broadcast, production, leaderboard, or fair-rank claim.

## Verification

```bash
PYTHONPATH=src PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 python -m pytest -q \
  tests/test_av_bench_compat.py \
  tests/test_av_bench_pipeline.py \
  tests/test_sea_broadcast_asr.py \
  tests/test_sea_broadcast_asr_sources.py \
  tests/test_sea_broadcast_asr_preview.py
python -m ruff check src/av/cli/benchmark_cmd.py src/av/eval/sea_broadcast_asr_pipeline.py \
  tests/test_av_bench_compat.py tests/test_av_bench_pipeline.py
git diff --check
```
