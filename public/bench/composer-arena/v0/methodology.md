# Composer Archive-to-Output Arena v0 methodology

Status: **non-rankable preview**. The checked-in metrics and battle outputs are synthetic interface fixtures, not measured model results.

## Tracks

- `controlled-agent` compares evidence-grounded archive understanding, temporal reasoning, and executable edit planning over the same frozen evidence and brief.
- `end-to-end-system` compares complete Composer executions over the same released cell and brief. Timeline mutation must use the frozen Composer tool contract and pass structural gates.
- The two tracks are reported separately and never collapsed into one leaderboard.

## Standing and uncertainty

Arena score is a presentation field for the future governed pairwise estimator. A real release must document the estimator, seed, bootstrap procedure, tie threshold, and vote inclusion policy. The public surface shows the frozen 95% confidence interval and battle count beside every score.

An ordinal standing is forbidden when the minimum battle count is not met or required evidence is incomplete. A tie is displayed when the governed comparison cannot establish separation at 95% confidence. Synthetic preview rows remain non-rankable regardless of their displayed fixture standing.

Deterministic task success is computed independently from preference battles. Failure rate retains explicit terminal failures in the denominator. Latency, token totals, and estimated cost use frozen run records; they never disappear because a run failed.

## Anonymous battle replay

The replay visually hides model identity until the visitor records `A is better`, `B is better`, `Tie`, or `Both bad`. A/B order can be swapped before judgment. The judgment is stored only in React state for the current browser view: there is no API request, persistence, identity, anti-abuse control, or official ranking effect. Synthetic identities are present in the downloadable fixture, so preview reveal is not a secrecy boundary; a governed backend must withhold real identity payloads until judgment.

Any future governed vote backend requires a reviewed sampling policy, replay identity, duplicate/abuse controls, immutable battle and output hashes, model reveal rules, audit export, deletion/privacy handling, and a versioned policy that says exactly which votes enter an official release.

## FineVideo source and attribution

The rankable source contract freezes `HuggingFaceFV/finevideo` at immutable revision `84c74091e1c6ee7a5dffabfafb5c9033e4718883`. The command-room-audited selection manifest contains 24 `public-eval` source families. Those selected cells carry the `CC-BY` claim from FineVideo publisher metadata and dataset terms, plus source-specific creator attribution text.

Public examples must retain the exact per-cell attribution and provenance chain. This preview fetches or re-hosts no media and contains no real evaluated output. It does not broaden a per-cell rights record into a blanket claim about unrelated FineVideo content.

Public-eval and private-test source families must remain disjoint. Hidden-test families, annotations, prompts, and failure history stay private and are never exposed through the public route or battle replay.

## Frozen evidence

- System-eval contract SHA-256: `33ca2f1b72ee9def3bd039eda69d9903ec595d860936a0353fdb045576215624`
- FineVideo selection release SHA-256: `d37cd450934c49721cb75de14353e070759c8220f1ed87567799473e8ab88926`
- FineVideo selection-manifest SHA-256: `39d34f73c3708f62bf4bc0f25dae721f844821d3c75c0179e4cedcc183a71ba4`

The separate `FINEVIDEO_RELEASED` marker now exists and the official release check passes for 24 cells with the contract and release hashes above. That gate authorizes only the frozen source cells. The rankable runner/runtime has not yet produced real model records, so this public surface still publishes no measured score, output, or rank.

## Contamination and privacy boundaries

No evaluated model may judge its own or another baseline's output. Training overlap, prompt leakage, source-family reuse, hidden-test tuning, or model substitution disables official rankability. Human editorial review is blinded, uses two reviewers plus adjudication, and remains separate from deterministic scoring.

Public exports may contain aggregate metrics, public-safe artifact hashes, required FineVideo attribution, and reviewed examples only. They must never contain credentials, signed URLs, provider headers, hidden annotations, raw reasoning traces, unnecessary personal metadata, customer data, or GMA data.

## Known limitations

- All preview scores, intervals, costs, and outputs are synthetic.
- The FineVideo source release is green, but the rankable runner/runtime is still being repaired and has produced no public model records.
- The public surface does not implement an official vote backend.
- The frozen system-eval contract currently uses one repetition per real cell; reliability claims need a reviewed repeated-run extension.
- Kimi K3 uses Composer's expressible `high` effort because the runtime cannot express the provider's published `max` effort.
- Editorial preference and long-horizon recovery remain exploratory, non-rankable capability views.
