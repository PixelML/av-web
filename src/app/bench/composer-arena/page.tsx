import type { Metadata } from "next";
import Link from "next/link";

import ArenaClient from "./arena-client";
import { loadComposerArena } from "./data";

const ARTIFACT_ROOT = "/bench/composer-arena/v0";

export const metadata: Metadata = {
  title: "Composer Archive-to-Output Arena v0 — Agentic Video Benchmarks",
  description:
    "Non-rankable, synthetic public preview of the Composer Archive-to-Output Arena v0 contract, metrics, anonymous battle replay, and real-data handoff.",
  alternates: { canonical: "/bench/composer-arena" },
  openGraph: {
    title: "Composer Archive-to-Output Arena v0",
    description: "Synthetic non-rankable preview with separate controlled-agent and end-to-end system views.",
    type: "website",
    url: "https://agentic.video/bench/composer-arena",
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

function HashValue({ children }: { children: string }) {
  return <code className="mt-2 block break-all text-xs leading-6 text-slate-700">{children}</code>;
}

export default async function ComposerArenaPage() {
  const { release, battles, checksums } = await loadComposerArena();

  const artifactLinks = [
    ["Release fixture (JSON)", `${ARTIFACT_ROOT}/release.preview.json`],
    ["Battle replay fixtures (JSONL)", `${ARTIFACT_ROOT}/battles.preview.jsonl`],
    ["Release schema (JSON Schema)", `${ARTIFACT_ROOT}/release.schema.json`],
    ["Battle schema (JSON Schema)", `${ARTIFACT_ROOT}/battle.schema.json`],
    ["Checksums", `${ARTIFACT_ROOT}/checksums.json`],
    ["Methodology", `${ARTIFACT_ROOT}/methodology.md`],
    ["Real-data handoff", `${ARTIFACT_ROOT}/handoff.md`],
  ] as const;

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <header className="border-b border-[hsl(var(--border))]">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-5">
            <Link href="/" className="font-semibold tracking-tight">av</Link>
            <Link href="/bench" className="text-sm text-[hsl(var(--muted-foreground))] hover:text-blue-600">
              Benchmarks
            </Link>
          </div>
          <span className="text-xs uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]">
            Composer Arena by Pixel ML
          </span>
        </div>
      </header>

      <section className="border-b border-[hsl(var(--border))] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-950">
            {release.display_label}
          </div>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Agentic Video Benchmarks by Pixel ML
          </p>
          <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">
            Composer Archive-to-Output Arena v0
          </h1>
          <p className="mt-8 max-w-4xl text-base leading-8 text-[hsl(var(--muted-foreground))] sm:text-lg">
            A publication-candidate surface for comparing evidence-grounded editing agents and complete Composer systems. Leaderboard-like rows remain synthetic preview examples; audited Phase 1 task evidence is published separately as a dated pilot note.
          </p>

          <div className="mt-10 border-l-4 border-amber-400 bg-amber-50 px-6 py-5 text-sm font-semibold leading-7 text-amber-950 sm:text-base">
            Official ranking is disabled. The preview table and replay are synthetic, local replay judgments are excluded, and the separate Phase 1 evidence note contains no winner or preference claim.
          </div>

          <dl className="mt-12 grid gap-px border border-[hsl(var(--border))] bg-[hsl(var(--border))] sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Release", release.release_id],
              ["Mode", release.release_mode],
              ["Generated", release.generated_at],
              ["Vote backend", release.official_vote_backend],
            ].map(([term, value]) => (
              <div key={term} className="bg-white p-5">
                <dt className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">{term}</dt>
                <dd className="mt-2 break-all text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-[hsl(var(--border))] px-6 py-12 sm:py-16" id="phase-1-evidence">
        <div className="mx-auto max-w-7xl border border-emerald-300 bg-emerald-50 p-6 sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-4xl text-emerald-950">
              <span className="inline-flex border border-emerald-400 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]">
                evidence / pilot · not a leaderboard
              </span>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight">Phase 1 deterministic evidence is available</h2>
              <p className="mt-3 text-sm leading-7">
                Mechanical control and Grok 4.5 produced complete passing outputs; Sol recorded a tool-policy task failure, Kimi K3 was excluded for runtime/provider compatibility, and GLM 5.2 direct vision is not applicable. Zero blind battles, zero ranks, and zero human preference claims.
              </p>
            </div>
            <Link
              href="/bench/composer-arena/evidence/pilot/2026-07-19"
              className="inline-flex shrink-0 items-center justify-center border border-emerald-950 bg-emerald-950 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-600 hover:text-white"
            >
              Open dated evidence
            </Link>
          </div>
        </div>
      </section>

      <ArenaClient release={release} battles={battles} />

      <section className="border-b border-[hsl(var(--border))] px-6 py-16 sm:py-20" id="methodology">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Methodology">Deterministic evidence first; preference stays bounded</SectionHeading>
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              [
                "Standing policy",
                `${release.evaluation_policy.tie_rule} ${release.evaluation_policy.insufficient_evidence_rule}`,
              ],
              [
                "Vote boundary",
                release.evaluation_policy.local_vote_policy,
              ],
              [
                "Contamination gate",
                release.evaluation_policy.contamination_limit,
              ],
            ].map(([title, body]) => (
              <article key={title} className="border border-[hsl(var(--border))] bg-white p-6">
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-[hsl(var(--muted-foreground))]">{body}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 border border-[hsl(var(--border))] bg-white p-6">
            <h3 className="text-base font-semibold">Privacy and publication boundary</h3>
            <p className="mt-4 max-w-5xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">
              {release.evaluation_policy.privacy_limit}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[hsl(var(--border))] px-6 py-16 sm:py-20" id="provenance">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="FineVideo source">Immutable revision and bounded CC-BY claim</SectionHeading>
            <p className="text-sm leading-7 text-[hsl(var(--muted-foreground))]">
              {release.dataset.license_scope}
            </p>
            <p className="mt-5 text-sm leading-7 text-[hsl(var(--muted-foreground))]">
              <strong className="text-[hsl(var(--foreground))]">Attribution:</strong> {release.dataset.attribution}
            </p>
            <a
              href={`https://huggingface.co/datasets/${release.dataset.repo_id}/tree/${release.dataset.revision}`}
              className="mt-6 inline-flex text-sm font-semibold text-blue-600 underline underline-offset-4"
            >
              View the immutable FineVideo dataset revision
            </a>
          </div>

          <div>
            <SectionHeading eyebrow="Source-family split">Public evidence is not hidden-test evidence</SectionHeading>
            <dl className="grid gap-px border border-[hsl(var(--border))] bg-[hsl(var(--border))] sm:grid-cols-2">
              <div className="bg-white p-5">
                <dt className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">Audited public-eval families</dt>
                <dd className="mt-2 text-3xl font-semibold">{release.dataset.public_eval_source_family_count}</dd>
              </div>
              <div className="bg-white p-5">
                <dt className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">Hidden test published</dt>
                <dd className="mt-2 text-3xl font-semibold">No</dd>
              </div>
            </dl>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-[hsl(var(--muted-foreground))]">
              <li><strong className="text-[hsl(var(--foreground))]">Public eval:</strong> {release.dataset.split_policy.public_eval}</li>
              <li><strong className="text-[hsl(var(--foreground))]">Private test:</strong> {release.dataset.split_policy.private_test}</li>
              <li><strong className="text-[hsl(var(--foreground))]">Disjoint:</strong> the same source family cannot cross the split.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-[hsl(var(--border))] px-6 py-16 sm:py-20" id="frozen-evidence">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Frozen evidence">Contract, source release, and public artifact hashes</SectionHeading>
          <div className="grid gap-4 lg:grid-cols-3">
            <article className="border border-[hsl(var(--border))] bg-white p-5">
              <h3 className="text-sm font-semibold">System-eval contract SHA-256</h3>
              <HashValue>{release.arena_binding.arena_contract_sha256}</HashValue>
            </article>
            <article className="border border-[hsl(var(--border))] bg-white p-5">
              <h3 className="text-sm font-semibold">Parent system-eval contract SHA-256</h3>
              <HashValue>{release.arena_binding.parent_contract_sha256}</HashValue>
            </article>
            <article className="border border-[hsl(var(--border))] bg-white p-5">
              <h3 className="text-sm font-semibold">FineVideo release SHA-256</h3>
              <HashValue>{release.dataset.finevideo_release_sha256}</HashValue>
            </article>
          </div>
          <p className="mt-4 break-all text-xs leading-6 text-[hsl(var(--muted-foreground))]">
            Public preview release SHA-256: <strong>{checksums.files["release.preview.json"]}</strong> · Arena source head: <strong>{release.arena_binding.source_head_sha}</strong>
          </p>
          <p className="mt-6 max-w-5xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">
            The command-room FineVideo selection and release marker pass for 24 cells. Phase 1 produced deterministic pilot evidence, but not a complete comparable seven-family roster or blind human review, so no official ranking exists.
          </p>
        </div>
      </section>

      <section className="border-b border-[hsl(var(--border))] px-6 py-16 sm:py-20" id="limitations">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Known limitations">What this preview does not prove</SectionHeading>
          <ol className="grid gap-4 lg:grid-cols-2">
            {release.known_limitations.map((limitation, index) => (
              <li key={limitation} className="flex gap-4 border border-amber-300 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
                <span className="font-semibold tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                <span>{limitation}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-20" id="artifacts">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Reproducibility">Downloadable, replaceable public artifacts</SectionHeading>
          <p className="max-w-4xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">
            The route reads the JSON and JSONL artifacts at build time. A governed real release replaces the files under the same schema and filenames, so the public UI does not require model-specific code changes.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {artifactLinks.map(([label, href]) => (
              <a
                key={href}
                href={href}
                download
                className="flex min-h-16 items-center justify-between gap-4 border border-[hsl(var(--border))] bg-white px-5 py-4 text-sm font-semibold hover:border-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <span>{label}</span><span aria-hidden="true">↓</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
