# Composer Archive-to-Output Arena v0 methodology

Status: **non-rankable preview**. The checked-in metrics and battle outputs are synthetic interface fixtures, not measured model results. This public adapter is bound to `PixelML/agentic_video_intelligence` head `824da0c1001662cb5a5a01e68c9ecc7d86a16bf7` and Arena contract SHA-256 `fb3f35346af22941d4476d390a1f2929d50653f9f50ee23cef8d7b2b1ad3ecc5`.

## Tracks

- `controlled-semantic-text-evidence-v0` / `controlled-agent` requires all four systems over one genuine, hash-identical transcript/OCR/semantic-event artifact. That artifact is unavailable, so the real v0 track is blocked and the visible rows are synthetic interface examples only.
- `end-to-end-visual-orchestration-v0` / `end-to-end-system` requires Sol, Grok 4.5, and Kimi K3 over the same visual case pack. GLM 5.2 direct perception is explicitly not applicable and remains outside that roster.
- The two tracks are reported separately and never collapsed into one leaderboard.

## Standing and uncertainty

The canonical Arena score is Bradley-Terry estimated win probability against Sol, normalized so Sol is exactly 50.0. Uncertainty uses 2,000 deterministic source-family cluster-bootstrap replicates at 95% confidence. The public preview demonstrates that presentation with synthetic numbers only.

An ordinal standing is forbidden when the frozen battle, seven-source-family, human-judge, complete-roster, connectivity, bootstrap, contamination, or position-bias gates are not met. `tied` means a pairwise 95% interval contains zero; `insufficient_evidence` means one or more gates failed. Synthetic preview rows remain `publishable=false`, `rank_count=0`, and non-rankable regardless of their illustrative state.

Deterministic task success is computed independently from preference battles. Failure rate retains explicit terminal failures in the denominator. Latency, token totals, and estimated cost use frozen run records; they never disappear because a run failed.

## Anonymous battle replay

The replay visually hides model identity until the visitor records `A is better`, `B is better`, `Tie`, or `Both bad`. A/B order can be swapped before judgment. The judgment is stored only in React state for the current browser view: there is no API request, persistence, identity, anti-abuse control, or official ranking effect. Synthetic identities are present in the downloadable fixture, so preview reveal is not a secrecy boundary; a governed backend must withhold real identity payloads until judgment.

Any future governed vote backend requires a reviewed sampling policy, replay identity, duplicate/abuse controls, immutable battle and output hashes, model reveal rules, audit export, deletion/privacy handling, and a versioned policy that says exactly which votes enter an official release.

## FineVideo source and attribution

The rankable source contract freezes `HuggingFaceFV/finevideo` at immutable revision `84c74091e1c6ee7a5dffabfafb5c9033e4718883`. The command-room-audited selection manifest contains 24 `public-eval` source families. Those selected cells carry the `CC-BY` claim from FineVideo publisher metadata and dataset terms, plus source-specific creator attribution text.

Public examples must retain the exact per-cell attribution and provenance chain. This preview fetches or re-hosts no media and contains no real evaluated output. It does not broaden a per-cell rights record into a blanket claim about unrelated FineVideo content.

Public-eval and private-test source families must remain disjoint. Hidden-test families, annotations, prompts, and failure history stay private and are never exposed through the public route or battle replay.

## Frozen evidence

- Arena source head: `824da0c1001662cb5a5a01e68c9ecc7d86a16bf7`
- Arena contract SHA-256: `fb3f35346af22941d4476d390a1f2929d50653f9f50ee23cef8d7b2b1ad3ecc5`
- System-eval contract SHA-256: `33ca2f1b72ee9def3bd039eda69d9903ec595d860936a0353fdb045576215624`
- FineVideo selection release SHA-256: `d37cd450934c49721cb75de14353e070759c8220f1ed87567799473e8ab88926`
- FineVideo selection-manifest SHA-256: `39d34f73c3708f62bf4bc0f25dae721f844821d3c75c0179e4cedcc183a71ba4`

The separate `FINEVIDEO_RELEASED` marker now exists and the official release check passes for 24 cells with the contract and release hashes above. That gate authorizes only the frozen source cells. The rankable runner/runtime has not yet produced real model records, so this public surface still publishes no measured score, output, or rank.

## Contamination and privacy boundaries

No evaluated model may judge its own or another baseline's output. Training overlap, prompt leakage, source-family reuse, hidden-test tuning, or model substitution disables official rankability. Human editorial review is blinded, uses two reviewers plus adjudication, and remains separate from deterministic scoring.

Public exports may contain aggregate metrics, public-safe artifact hashes, required FineVideo attribution, and reviewed examples only. They must never contain credentials, signed URLs, provider headers, hidden annotations, raw reasoning traces, unnecessary personal metadata, customer data, or GMA data.

## Known limitations

- All preview scores, intervals, costs, and outputs are synthetic.
- Phase 1 has one complete model output plus a mechanical control, but no complete seven-family required roster and therefore no blind battle or preference score.
- The dated Phase 1 pilot evidence is deterministic task-success evidence with zero blind battles, zero ranks, and zero human preference claims.
- The public surface does not implement an official vote backend.
- The frozen system-eval contract currently uses one repetition per real cell; reliability claims need a reviewed repeated-run extension.
- Kimi K3 uses Composer's expressible `high` effort because the runtime cannot express the provider's published `max` effort.
- Editorial preference and long-horizon recovery remain exploratory, non-rankable capability views.
