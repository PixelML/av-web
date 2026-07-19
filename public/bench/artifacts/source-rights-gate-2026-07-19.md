# SEA Broadcast ASR source provenance

`source-manifest.draft.json` is a metadata-only rights review for exactly three candidate source families: IMDA National Speech Corpus, pinned Google FLEURS SEA validation slices, and OpenSLR SLR24 Iban. It contains no audio, transcript text, customer material, credentials, or acquisition output.

`source-manifest.public-dev.json` is the separate, FLEURS-only publication input authorized for the developer preview. It preserves the same revision, package hashes, attribution, transcript provenance, and read-speech domain label. The blocked NSC and SLR24 rows are not copied into the public-release input and remain visible as blocked metadata in the draft.

The draft is intentionally not publication-eligible. The current decisions are:

| Source | Public mode | Verified package evidence | Decision |
|---|---|---|---|
| IMDA NSC | `id_only` | Unavailable without registration, a Dropbox account, and the emailed six-part package | Conditional; do not register or use credentials without Sean approval. |
| Google FLEURS | `acquisition_script` | Three pinned validation Parquet files plus the pinned dataset card, all with exact byte sizes and SHA-256 evidence | Approved for read-speech language controls only; never label as broadcast evidence. |
| OpenSLR SLR24 | `id_only` | `iban.tar.gz`, package README/licence, and dev/train index members are checksummed | Conditional; provider page says CC BY-SA 2.0 Generic but bundled licence says CC BY-SA 2.0 France. Do not re-host archive members. |

## Broadcast-source rights gate — 2026-07-19

This is the metadata-only decision table for plausible public SEA broadcast inputs. It records primary-source terms and domain fit; it is not permission to acquire media, use credentials, create references, or run a model. The checked-in source manifest remains the narrower machine-validated registry for sources with package-level evidence.

| Candidate | Primary evidence | Domain and access | Decision for the Sep 30 public suite | Exact next gate |
|---|---|---|---|---|
| OpenSLR SLR24 Iban | [OpenSLR SLR24](https://www.openslr.org/24/) and the checksummed package licence recorded in `source-manifest.draft.json` | Iban speech/news from RTM Sarawak; provider page says CC BY-SA 2.0 Generic while the package says CC BY-SA 2.0 France | **Blocked — closest domain match, but not rights-approved.** Do not acquire or publish archive members. | Sean must explicitly decide whether the jurisdiction mismatch and RTM-derived rights chain are acceptable, or obtain authoritative clarification. Then a separate item-level rights and human-gold review must pass. |
| VOA original SEA-language reports | [USAGM VOA content guidance](https://www.usagm.gov/work-with-us/content-requests/voa/) and [Wikimedia's VOA public-domain provenance rule](https://commons.wikimedia.org/wiki/Template:PD-USGov-VOA) | Potential broadcast-domain public works, but VOA programs can contain third-party material; public-domain treatment requires confirming that an item is solely original VOA work | **Blocked — no reviewed item currently proves the full rights chain.** No Commons or VOA media was downloaded. | Identify an immutable item with affirmative original-VOA provenance and no AP/Reuters/AFP/other third-party contribution, then complete item-level attribution and human-reference review. |
| VLSP Vietnamese ASR challenge data | [VLSP 2018 ASR task](https://vlsp.org.vn/index.php/vi/node/85) and [VLSP 2022 ASR task](https://vlsp.org.vn/vlsp2022/eval/asr) | News/private-test speech delivered through registration or organizers; the public task pages do not grant public redistribution rights | **Rejected under current evidence.** Do not register, request, acquire, or publish it for this suite. | Reconsider only if the organizer supplies explicit evaluation and public-result/publication terms compatible with this benchmark. |
| GigaSpeech 2 | [Official repository](https://github.com/SpeechColab/GigaSpeech2) and [official dataset card](https://huggingface.co/datasets/speechcolab/gigaspeech2/blob/main/README.md) | Thai, Indonesian, and Vietnamese YouTube speech; the card says SpeechColab does not own the audio copyright and limits use to non-commercial research/education subject to conditions | **Rejected for Pixel ML's public benchmark.** Do not download or use it. | None under the current commercial public-proof scope; only a materially different licence from the rights holders could reopen it. |
| IMDA National Speech Corpus | [IMDA National Speech Corpus](https://www.imda.gov.sg/about-imda/emerging-technologies-and-research/artificial-intelligence/national-speech-corpus) | Registered, emailed Dropbox access to read/conversational Singapore English; not demonstrated broadcast audio | **Not a broadcast-suite source.** It remains conditional metadata only and cannot satisfy the Sep 30 domain requirement. | Separate Sean approval would be required even to register; package terms and domain fit would still need review. |
| Google FLEURS SEA validation | [Pinned FLEURS dataset card](https://huggingface.co/datasets/google/fleurs/tree/70bb2e84b976b7e960aa89f1c648e09c59f894dd) | Rights-approved CC BY 4.0 read speech already used for the language-control developer preview | **Keep only as the read-speech control.** It is not broadcast/private-test evidence and cannot produce a fair leaderboard. | No scope change: preserve the live preview label and exclude it from broadcast claims and rank. |

**Gate result:** no real broadcast-domain candidate currently passes both the rights/provenance gate and the source-family-disjoint dev/private-test design. Acquisition, human-gold creation, live adapters, and baseline runs remain stopped. The narrowest decision is whether Sean accepts SLR24's documented licence/provenance mismatch; otherwise a newly reviewed original-VOA item family would still need a distinct rights-clean hidden-test family before execution can resume.

Natural Mandarin-English code-switch remains `not_evaluated_rights_blocked`. Do not replace it with customer/GMA data or turn synthetic contract examples into a quality claim.

Validate the draft without acquiring assets:

```bash
PYTHONPATH=src python -m av.cli.app benchmark sea-asr source-check \
  --manifest benchmarks/sea_broadcast_asr/sources/source-manifest.draft.json
```

Adding `--public` must fail while any rights or provenance blocker remains. Source metadata approval does not approve any individual audio asset; future audio rows still require immutable content digests and item-level review. The source manifest stores metadata and hashes only; no provider audio or transcript text belongs in this tree.

The FLEURS-only publication input is checked separately:

```bash
PYTHONPATH=src python -m av.cli.app benchmark sea-asr source-check \
  --manifest benchmarks/sea_broadcast_asr/sources/source-manifest.public-dev.json \
  --public
```
