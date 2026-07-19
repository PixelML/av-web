# Composer Archive-to-Output Arena v0 methodology

Status: **non-rankable preview**. The public standings are empty. The dated evidence page contains sanitized seven-family task-success counts, while the A/B replay contains generic synthetic interaction fixtures only. This public adapter is bound to merged `PixelML/agentic_video_intelligence` `composer-mvp` head `3dceb46215e999f4a11a564ea958f845c36af215` and Arena contract SHA-256 `8ceab1529c0bca8d74419222fe5b2556bceb1b83aaa9e3337b0509557ab1dab4`.

## Tracks

- `controlled-semantic-text-evidence-v0` / `controlled-agent` requires one genuine, hash-identical transcript/OCR/semantic-event artifact. That artifact is unavailable, so the track remains blocked before model execution.
- `end-to-end-visual-orchestration-v0` / `end-to-end-system` has terminal seven-family deterministic task-success evidence for one public control and two identity-sealed evaluated lanes. It has no public preference result.
- The two tracks are reported separately and never collapsed into one leaderboard.

## Standing and uncertainty

The canonical Arena estimator is Bradley-Terry logistic maximum likelihood over governed resolved battles. Uncertainty uses 2,000 deterministic source-family cluster-bootstrap replicates at 95% confidence. A future governed release must declare its score calibration and reference baseline; this preview publishes no score, interval, or model standing.

An ordinal standing is forbidden when the frozen battle, seven-source-family, human-judge, complete-roster, connectivity, bootstrap, contamination, or position-bias gates are not met. `tied` means a pairwise 95% interval contains zero; `insufficient_evidence` means one or more gates failed. The current release has no rows and remains `publishable=false`, `rank_count=0`, `winner=null`, and non-rankable.

Deterministic task success is computed independently from preference battles. Failure rate retains explicit terminal failures in the denominator. Latency, token totals, and estimated cost use frozen run records; they never disappear because a run failed.

## Anonymous battle replay

The replay is a generic synthetic interaction demo. It records `A is better`, `B is better`, `Tie`, `Both bad`, or `Abstain`; A/B order can be swapped before judgment. The choice is stored only in React state for the current browser view: there is no API request, persistence, identity, anti-abuse control, or official ranking effect.

The real blind packet, candidate media, per-cell identifiers, output hashes, and identity mapping remain private until the founder votes. They are not represented by `battles.preview.jsonl`, and a static public artifact must never be treated as an identity-secrecy boundary.

Any future governed vote backend requires a reviewed sampling policy, replay identity, duplicate/abuse controls, immutable battle and output hashes, model reveal rules, audit export, deletion/privacy handling, and a versioned policy that says exactly which votes enter an official release.

## FineVideo source and attribution

The rankable source contract freezes `HuggingFaceFV/finevideo` at immutable revision `84c74091e1c6ee7a5dffabfafb5c9033e4718883`. The command-room-audited selection manifest contains 24 `public-eval` source families. Those selected cells carry the `CC-BY` claim from FineVideo publisher metadata and dataset terms, plus source-specific creator attribution text.

Public examples must retain the exact per-cell attribution and provenance chain. This preview fetches or re-hosts no media and contains no real evaluated output. It does not broaden a per-cell rights record into a blanket claim about unrelated FineVideo content.

Public-eval and private-test source families must remain disjoint. Hidden-test families, annotations, prompts, and failure history stay private and are never exposed through the public route or battle replay.

## Frozen evidence

- Arena source head: `3dceb46215e999f4a11a564ea958f845c36af215`
- Arena contract SHA-256: `8ceab1529c0bca8d74419222fe5b2556bceb1b83aaa9e3337b0509557ab1dab4`
- System-eval contract SHA-256: `33ca2f1b72ee9def3bd039eda69d9903ec595d860936a0353fdb045576215624`
- FineVideo selection release SHA-256: `d37cd450934c49721cb75de14353e070759c8220f1ed87567799473e8ab88926`
- FineVideo selection-manifest SHA-256: `39d34f73c3708f62bf4bc0f25dae721f844821d3c75c0179e4cedcc183a71ba4`
- Seven-family staging-manifest SHA-256: `0b395b961b0de0bb6a5c54ff80b13582d23f8e3d2e729aa7e950b1df8536d2b8`
- Seven-family case-pack SHA-256: `74356b45867f492688e25a10c6e13a6fa2848f41ce00aa025d83adb7639ce203`

The separate `FINEVIDEO_RELEASED` marker exists and the official release check passes for 24 cells with the contract and release hashes above. Seven eligible cells from seven distinct families completed the deterministic protocol with no favorable selection. The public aggregate still publishes no candidate output, preference score, identity mapping, or rank.

## Contamination and privacy boundaries

No evaluated model may judge its own or another baseline's output. Training overlap, prompt leakage, source-family reuse, hidden-test tuning, or model substitution disables official rankability. Human editorial review is blinded, uses two reviewers plus adjudication, and remains separate from deterministic scoring.

Public exports may contain aggregate metrics, public-safe artifact hashes, required FineVideo attribution, and reviewed examples only. They must never contain credentials, signed URLs, provider headers, hidden annotations, raw reasoning traces, unnecessary personal metadata, customer data, or GMA data.

## Known limitations

- No preview score, interval, cost, model rank, or winner is published.
- Seven-family task-success counts are deterministic system evidence, not editorial preference.
- Evaluated lane identities remain sealed pending the founder's blind vote.
- The public surface does not implement an official vote backend.
- The frozen system-eval contract currently uses one repetition per real cell; reliability claims need a reviewed repeated-run extension.
- Editorial preference and long-horizon recovery remain exploratory, non-rankable capability views.
