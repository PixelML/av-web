import type { Metadata } from "next";
import Link from "next/link";

const PREVIEW_ID = "fleurs-sea-language-control-dev-preview-0.1";
const PREVIEW_LABEL =
  "Language-control developer preview — not broadcast, production, or leaderboard evidence.";
const SOURCE_COMMIT = "9275e8c46988a481ce80db1380d374d329241524";
const SOURCE_ROOT = `https://github.com/PixelML/agentic-video/tree/${SOURCE_COMMIT}/benchmarks/sea_broadcast_asr`;
const REPO_BLOB_ROOT = `https://github.com/PixelML/agentic-video/blob/${SOURCE_COMMIT}`;
const BLOB_ROOT = `https://github.com/PixelML/agentic-video/blob/${SOURCE_COMMIT}/benchmarks/sea_broadcast_asr`;
const FLEURS_REVISION = "70bb2e84b976b7e960aa89f1c648e09c59f894dd";

const controls = [
  {
    language: "Indonesian",
    locale: "id-ID",
    config: "id_id / validation",
    filename: "parquet-data/id_id/validation-00000-of-00001.parquet",
    bytes: "265,875,871",
    sha256: "d5fe4ac4679cf2687917adc235db89ae82df815c53a23850f6ba8e159bb4df77",
  },
  {
    language: "Filipino",
    locale: "fil-PH",
    config: "fil_ph / validation",
    filename: "parquet-data/fil_ph/validation-00000-of-00001.parquet",
    bytes: "454,686,207",
    sha256: "693d176879c83b3ce9fa86d350f2351237e41e4f5e85bad1d8d7c0b7137d9f43",
  },
  {
    language: "Vietnamese",
    locale: "vi-VN",
    config: "vi_vn / validation",
    filename: "parquet-data/vi_vn/validation-00000-of-00001.parquet",
    bytes: "274,630,187",
    sha256: "a6d7cf5fd0711ba5437e6f59f244e72207616aaa6b721f5f7bb2efb98eed1e20",
  },
];

const artifactLinks = [
  ["Preview manifest", "/bench/preview.json"],
  ["Contamination ledger", "/bench/contamination-ledger.json"],
  ["Pinned acquisition script", `${BLOB_ROOT}/public-preview/acquire_fleurs_validation.py`],
  ["FLEURS-only source manifest", `${BLOB_ROOT}/sources/source-manifest.public-dev.json`],
  ["Methodology", `${REPO_BLOB_ROOT}/docs/33-sea-broadcast-asr-benchmark-v0.md`],
  ["Manifest schema", `${BLOB_ROOT}/schemas/public-preview-v0.1.schema.json`],
  ["Ledger schema", `${BLOB_ROOT}/schemas/contamination-ledger-v0.1.schema.json`],
];

export const metadata: Metadata = {
  title: "SEA Broadcast ASR developer preview — Agentic Video Benchmarks",
  description:
    "Rights-gated FLEURS language-control developer preview by Pixel ML. Read speech only; not broadcast, production, or leaderboard evidence.",
  alternates: { canonical: "/bench" },
  openGraph: {
    title: "Agentic Video Benchmarks by Pixel ML",
    description: PREVIEW_LABEL,
    type: "website",
    url: "https://agentic.video/bench",
  },
};

function SectionHeading({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">{eyebrow}</p>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{children}</h2>
    </div>
  );
}

export default function BenchPage() {
  const deploymentCommit = process.env.VERCEL_GIT_COMMIT_SHA ?? "local-build";

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <header className="border-b border-[hsl(var(--border))]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="font-semibold tracking-tight">
            av
          </Link>
          <span className="text-xs uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]">
            Benchmarks by Pixel ML
          </span>
        </div>
      </header>

      <section className="border-b border-[hsl(var(--border))] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Agentic Video Benchmarks by Pixel ML
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">
            SEA Broadcast ASR
          </h1>
          <div className="mt-8 max-w-5xl border-l-4 border-blue-500 bg-blue-50 px-6 py-5 text-base font-semibold leading-relaxed text-slate-950 sm:text-lg">
            {PREVIEW_LABEL}
          </div>
          <p className="mt-8 max-w-3xl text-base leading-8 text-[hsl(var(--muted-foreground))]">
            This first public release is a reproducibility and rights preview for three FLEURS read-speech
            language controls. It evaluates no model, reports no quality score, and makes no claim about broadcast
            robustness.
          </p>

          <dl className="mt-12 grid gap-px border border-[hsl(var(--border))] bg-[hsl(var(--border))] sm:grid-cols-3">
            {[
              ["Preview version", PREVIEW_ID],
              ["Benchmark source commit", SOURCE_COMMIT],
              ["Web deployment commit", deploymentCommit],
            ].map(([term, value]) => (
              <div key={term} className="bg-white p-5">
                <dt className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">{term}</dt>
                <dd className="mt-2 break-all text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-[hsl(var(--border))] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Methodology">Separate domains, frozen evidence</SectionHeading>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              [
                "Language controls",
                "Indonesian, Filipino, and Vietnamese are reported as separate read-speech controls. They are never combined with broadcast-like speech into a rank.",
              ],
              [
                "Frozen acquisition",
                "Only the provider-hosted validation packages at the pinned FLEURS revision are in scope. The script verifies exact byte sizes and SHA-256 values.",
              ],
              [
                "No result claim",
                "This release carries schemas, provenance, and an acquisition path. There are zero evaluated models and fair-ranked comparison is disabled.",
              ],
            ].map(([title, text]) => (
              <article key={title} className="border border-[hsl(var(--border))] bg-white p-6">
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-[hsl(var(--muted-foreground))]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[hsl(var(--border))] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Pinned development input">FLEURS validation packages</SectionHeading>
          <div className="overflow-x-auto border border-[hsl(var(--border))] bg-white">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-white">
                <tr>
                  {['Language', 'Provider slice', 'Filename', 'Bytes', 'SHA-256'].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-xs font-medium uppercase tracking-[0.12em]">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {controls.map((control) => (
                  <tr key={control.locale} className="border-t border-[hsl(var(--border))] align-top">
                    <td className="px-4 py-4 font-semibold">
                      {control.language}
                      <span className="mt-1 block text-xs font-normal text-[hsl(var(--muted-foreground))]">
                        {control.locale}
                      </span>
                    </td>
                    <td className="px-4 py-4">{control.config}</td>
                    <td className="max-w-xs break-all px-4 py-4 text-xs">{control.filename}</td>
                    <td className="px-4 py-4 tabular-nums">{control.bytes}</td>
                    <td className="max-w-sm break-all px-4 py-4 text-xs">{control.sha256}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 break-all text-xs leading-6 text-[hsl(var(--muted-foreground))]">
            Dataset revision: <strong className="text-[hsl(var(--foreground))]">{FLEURS_REVISION}</strong>
          </p>
        </div>
      </section>

      <section className="border-b border-[hsl(var(--border))] px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Rights and provenance">CC BY 4.0 acquisition-only route</SectionHeading>
            <ul className="space-y-5 text-sm leading-7 text-[hsl(var(--muted-foreground))]">
              <li>
                <strong className="text-[hsl(var(--foreground))]">Attribution:</strong> FLEURS, Conneau et al.
                (2022),{" "}
                <a className="text-blue-600 underline underline-offset-4" href="https://arxiv.org/abs/2205.12446">
                  FLEURS: Few-shot Learning Evaluation of Universal Representations of Speech
                </a>
                . Licensed under{" "}
                <a
                  className="text-blue-600 underline underline-offset-4"
                  href="https://creativecommons.org/licenses/by/4.0/"
                >
                  CC BY 4.0
                </a>
                .
              </li>
              <li>
                <strong className="text-[hsl(var(--foreground))]">Transcript provenance:</strong> the pinned card
                describes parallel sentences sourced from the public FLoRes dev/devtest sets; the selected rows use
                the provider transcription field.
              </li>
              <li>
                <strong className="text-[hsl(var(--foreground))]">Change disclosure:</strong> Pixel ML selects three
                validation packages and publishes metadata plus an acquisition script. No FLEURS audio or transcript
                is re-hosted or modified here, and no Google endorsement is implied.
              </li>
            </ul>
          </div>

          <div>
            <SectionHeading eyebrow="Contamination ledger">No fair-ranked comparison</SectionHeading>
            <div className="border border-[hsl(var(--border))] bg-white p-6">
              <dl className="grid grid-cols-2 gap-5 text-sm">
                <div>
                  <dt className="text-[hsl(var(--muted-foreground))]">Evaluated models</dt>
                  <dd className="mt-1 text-2xl font-semibold">0</dd>
                </div>
                <div>
                  <dt className="text-[hsl(var(--muted-foreground))]">Fair rank</dt>
                  <dd className="mt-1 text-2xl font-semibold">Disabled</dd>
                </div>
              </dl>
              <p className="mt-6 border-t border-[hsl(var(--border))] pt-6 text-sm leading-7 text-[hsl(var(--muted-foreground))]">
                Models known or declared to have trained on FLEURS must be marked <code>train_overlap</code> and
                excluded from fair-ranked comparison. Unknown overlap status also fails closed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[hsl(var(--border))] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Explicit gaps">Outside this preview</SectionHeading>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["IMDA National Speech Corpus", "id_only_blocked"],
              ["OpenSLR SLR24 Iban", "id_only_blocked"],
              ["Natural Mandarin-English code-switch", "not_evaluated_rights_blocked"],
            ].map(([name, status]) => (
              <div key={name} className="border border-amber-300 bg-amber-50 p-5">
                <p className="text-sm font-semibold text-slate-950">{name}</p>
                <code className="mt-3 block break-all text-xs text-amber-900">{status}</code>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-[hsl(var(--muted-foreground))]">
            Their audio and transcripts are absent. No customer or GMA material, private tests, training or
            calibration recipes, model weights, or credential-gated assets are part of this release.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Reproducibility">Versioned public artifacts</SectionHeading>
          <div className="grid gap-3 sm:grid-cols-2">
            {artifactLinks.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="flex items-center justify-between gap-4 border border-[hsl(var(--border))] bg-white px-5 py-4 text-sm font-semibold hover:border-blue-500"
              >
                <span>{label}</span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
          <p className="mt-8 text-xs leading-6 text-[hsl(var(--muted-foreground))]">
            Source tree: <a className="break-all text-blue-600 underline underline-offset-4" href={SOURCE_ROOT}>{SOURCE_ROOT}</a>
          </p>
        </div>
      </section>
    </main>
  );
}
