import type { Metadata } from "next";
import Link from "next/link";

import { loadSevenFamilyEvidence } from "./data";

const ARTIFACT_ROOT = "/bench/composer-arena/evidence/pilot/2026-07-19";

export const metadata: Metadata = {
  title: "Composer Arena seven-family task-success evidence — July 19, 2026",
  description:
    "Sanitized seven-family deterministic task-success evidence with sealed model identities, zero blind battles, zero ranks, and no winner.",
  alternates: { canonical: "/bench/composer-arena/evidence/pilot/2026-07-19" },
};

function HashValue({ children }: { children: string }) {
  return <code className="mt-2 block break-all text-xs leading-6 text-slate-700">{children}</code>;
}

export default async function SevenFamilyEvidencePage() {
  const { evidence, checksums } = await loadSevenFamilyEvidence();

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <header className="border-b border-[hsl(var(--border))]">
        <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-5">
            <Link href="/" className="font-semibold tracking-tight">av</Link>
            <Link href="/bench/composer-arena" className="text-sm text-[hsl(var(--muted-foreground))] hover:text-blue-600">
              Composer Arena
            </Link>
          </div>
          <span className="text-xs uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]">
            Evidence / task success · 2026-07-19
          </span>
        </div>
      </header>

      <section className="border-b border-[hsl(var(--border))] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-950">
            not a leaderboard
          </span>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Composer Archive-to-Output Arena v0
          </p>
          <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">
            Seven-family task-success evidence
          </h1>
          <p className="mt-8 max-w-4xl text-base leading-8 text-[hsl(var(--muted-foreground))] sm:text-lg">
            A sanitized aggregate over seven eligible cells from seven distinct source families. It reports deterministic system outcomes only; it cannot establish editorial preference or an Arena winner.
          </p>

          <div className="mt-10 border-l-4 border-red-500 bg-red-50 px-6 py-5 text-sm font-semibold leading-7 text-red-950 sm:text-base">
            Winner: none. Publication state: insufficient evidence. Evaluated identities and the real blind packet remain private until the founder records a vote.
          </div>

          <dl className="mt-12 grid gap-px border border-[hsl(var(--border))] bg-[hsl(var(--border))] sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Source families", evidence.cohort.distinct_source_families],
              ["Blind battles", evidence.vote_provenance.blind_battles],
              ["Published ranks", evidence.publication.rank_count],
              ["Human votes", evidence.vote_provenance.real_human_votes],
            ].map(([term, value]) => (
              <div key={term} className="bg-white p-6">
                <dt className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">{term}</dt>
                <dd className="mt-2 text-4xl font-semibold tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-[hsl(var(--border))] px-6 py-16 sm:py-20" id="task-success">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Deterministic task success</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Three lanes; no preference ordering</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">
            {evidence.task_success.separation_statement}
          </p>

          <div className="mt-8 overflow-x-auto border border-[hsl(var(--border))] bg-white">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <caption className="sr-only">Seven-family deterministic task-success lanes</caption>
              <thead className="bg-slate-950 text-white">
                <tr>
                  {[
                    "Lane",
                    "Identity",
                    "Attempted",
                    "Structural",
                    "Accepted outputs",
                    "Model calls",
                    "Source summary SHA-256",
                  ].map((heading) => (
                    <th key={heading} scope="col" className="px-4 py-3 text-xs font-medium uppercase tracking-[0.1em]">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {evidence.task_success.lanes.map((lane) => (
                  <tr key={lane.lane_id} className="border-t border-[hsl(var(--border))] align-top">
                    <td className="px-4 py-5 font-semibold">{lane.lane_id}</td>
                    <td className="px-4 py-5 text-xs leading-6">{lane.identity_state.replaceAll("_", " ")}</td>
                    <td className="px-4 py-5 tabular-nums">{lane.attempted_cells}</td>
                    <td className="px-4 py-5 tabular-nums">{lane.structural_passes} pass / {lane.structural_failures} fail</td>
                    <td className="px-4 py-5 tabular-nums">{lane.complete_outputs_accepted} / {lane.attempted_cells}</td>
                    <td className="px-4 py-5 tabular-nums">{lane.model_calls}</td>
                    <td className="max-w-xs break-all px-4 py-5 text-xs">{lane.source_summary_sha256}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-[hsl(var(--border))] px-6 py-16 sm:py-20" id="blind-boundary">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Blind-review boundary</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Commit now; reveal after the vote</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Packet public", evidence.blind_review.packet_public ? "Yes" : "No"],
              ["Candidate outputs public", evidence.blind_review.candidate_outputs_public ? "Yes" : "No"],
              ["Identity mapping public", evidence.blind_review.identity_mapping_public ? "Yes" : "No"],
            ].map(([label, value]) => (
              <article key={label} className="border border-amber-300 bg-amber-50 p-6 text-amber-950">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em]">{label}</h3>
                <p className="mt-3 text-3xl font-semibold">{value}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-4xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">
            Next gate: {evidence.blind_review.next_gate.replaceAll("_", " ")}. This page contains no candidate media, per-cell identifiers, output hashes, run IDs, prompts, private paths, or model mapping.
          </p>
        </div>
      </section>

      <section className="border-b border-[hsl(var(--border))] px-6 py-16 sm:py-20" id="provenance">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Frozen provenance</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Exact shared-input and aggregate hashes</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              ["Staging manifest", evidence.frozen_evidence.staging_manifest_sha256],
              ["System-eval contract", evidence.frozen_evidence.contract_sha256],
              ["FineVideo release", evidence.frozen_evidence.release_sha256],
              ["Case pack", evidence.frozen_evidence.case_pack_sha256],
            ].map(([label, value]) => (
              <article key={label} className="border border-[hsl(var(--border))] bg-white p-5">
                <h3 className="text-sm font-semibold">{label}</h3>
                <HashValue>{value}</HashValue>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Evidence JSON", `${ARTIFACT_ROOT}/seven-family-results.json`],
              ["Evidence schema", `${ARTIFACT_ROOT}/seven-family-results.schema.json`],
              ["Checksums", `${ARTIFACT_ROOT}/checksums.json`],
              ["Public README", `${ARTIFACT_ROOT}/README.md`],
            ].map(([label, href]) => (
              <a key={href} href={href} download className="flex items-center justify-between gap-4 border border-[hsl(var(--border))] bg-white px-5 py-4 text-sm font-semibold hover:border-blue-500">
                <span>{label}</span><span aria-hidden="true">↓</span>
              </a>
            ))}
          </div>
          <p className="mt-6 break-all text-xs leading-6 text-[hsl(var(--muted-foreground))]">
            Evidence artifact SHA-256: <strong>{checksums.files["seven-family-results.json"]}</strong>
          </p>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-20" id="limitations">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Limits</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What this evidence does not prove</h2>
          <ol className="mt-8 grid gap-4 lg:grid-cols-2">
            {evidence.limitations.map((limitation, index) => (
              <li key={limitation} className="flex gap-4 border border-amber-300 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
                <span className="font-semibold tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                <span>{limitation}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
