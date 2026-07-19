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
| SLR24 Iban original corpus | [Original repository at `f2147ff`](https://github.com/sarahjuan/iban/tree/f2147ffad2b4b044fc116284c4e05aaccbd1f070), its [CC BY-SA 2.0 France licence](https://github.com/sarahjuan/iban/blob/f2147ffad2b4b044fc116284c4e05aaccbd1f070/LICENSE.html), [README provenance](https://github.com/sarahjuan/iban/blob/f2147ffad2b4b044fc116284c4e05aaccbd1f070/README), and [OpenSLR SLR24](https://www.openslr.org/24/) | The original authors publicly host about seven hours of train and one hour of test speech, identify it as radio news supplied by RTM Sarawak, and apply CC BY-SA 2.0 France to the repository. The reformatted OpenSLR page instead labels its derivative CC BY-SA 2.0 Generic. | **Blocked pending Sean's source-rights judgment.** The original repository is stronger evidence than the wrapper, but Pixel ML has not independently verified RTM's authority grant to the authors. No media was downloaded. | Sean must either approve reliance on the original authors' repository-wide CC BY-SA 2.0 France grant and RTM provenance statement, or require authoritative RTM/author clarification. Item-level freeze and human-gold review still follow; this family can occupy only one side of the source-family-disjoint partition. |
| VOA Indonesia interview candidate | [Commons file revision `1196870427`](https://commons.wikimedia.org/w/index.php?title=File:Wawancara_Kang_Danny_dengan_Kelompok_Pro-_dan_Anti-Trump.webm&oldid=1196870427), [official VOA source](https://www.voaindonesia.com/a/wawancara-kang-danny-dengan-kelompok-pro-dan-anti-trump/3685137.html), [USAGM guidance](https://www.usagm.gov/work-with-us/content-requests/voa/), and [VOA provenance rule](https://commons.wikimedia.org/wiki/Template:PD-USGov-VOA) | Immutable Commons metadata records page ID `110103290`, 6,286,338 bytes, file SHA-1 `fe1952730e41b44816ab5f9b4af5a27246d3d39e`, author VOA Indonesia, public-domain status, and a source licence review dated 2021-10-15. It is not in `PD VOA (VOA)` and therefore lacks the template's affirmative original-VOA/no-AP-or-AFP confirmation. | **Blocked pending item-level original-work confirmation.** This is now the narrowest candidate for the second source family, but a generic VOA public-domain tag plus licence review does not override USAGM's third-party-content warning. No media or transcript was downloaded. | Sean must require affirmative evidence that the full item is original VOA work with no third-party contribution, then approve item-level use. Human transcription, independent review, adjudication, immutable SHA-256 freeze, and assignment to the opposite partition from SLR24 remain mandatory. |
| VLSP Vietnamese ASR challenge data | [VLSP 2018 ASR task](https://vlsp.org.vn/index.php/vi/node/85) and [VLSP 2022 ASR task](https://vlsp.org.vn/vlsp2022/eval/asr) | News/private-test speech delivered through registration or organizers; the public task pages do not grant public redistribution rights | **Rejected under current evidence.** Do not register, request, acquire, or publish it for this suite. | Reconsider only if the organizer supplies explicit evaluation and public-result/publication terms compatible with this benchmark. |
| GigaSpeech 2 | [Official repository](https://github.com/SpeechColab/GigaSpeech2) and [official dataset card](https://huggingface.co/datasets/speechcolab/gigaspeech2/blob/main/README.md) | Thai, Indonesian, and Vietnamese YouTube speech; the card says SpeechColab does not own the audio copyright and limits use to non-commercial research/education subject to conditions | **Rejected for Pixel ML's public benchmark.** Do not download or use it. | None under the current commercial public-proof scope; only a materially different licence from the rights holders could reopen it. |
| IMDA National Speech Corpus | [IMDA National Speech Corpus](https://www.imda.gov.sg/about-imda/emerging-technologies-and-research/artificial-intelligence/national-speech-corpus) | Registered, emailed Dropbox access to read/conversational Singapore English; not demonstrated broadcast audio | **Not a broadcast-suite source.** It remains conditional metadata only and cannot satisfy the Sep 30 domain requirement. | Separate Sean approval would be required even to register; package terms and domain fit would still need review. |
| Google FLEURS SEA validation | [Pinned FLEURS dataset card](https://huggingface.co/datasets/google/fleurs/tree/70bb2e84b976b7e960aa89f1c648e09c59f894dd) | Rights-approved CC BY 4.0 read speech already used for the language-control developer preview | **Keep only as the read-speech control.** It is not broadcast/private-test evidence and cannot produce a fair leaderboard. | No scope change: preserve the live preview label and exclude it from broadcast claims and rank. |

**Gate result:** a technically viable two-family design is now concrete—SLR24/RTM on one split and the reviewed VOA Indonesia item family on the other—but neither family has Sean's final rights approval. The freeze contract forbids the same family crossing splits and accepts only `approved` family and item decisions with confirmed absence of third-party content. Acquisition, human-gold creation, live adapters, and baseline runs therefore remain stopped until both judgments pass; approving only one family is insufficient.

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
