import type { Metadata } from "next";
import Link from "next/link";

import { loadPhaseOneEvidence, type PhaseOneResult } from "./data";

const ARTIFACT_ROOT = "/bench/composer-arena/evidence/pilot/2026-07-19";

export const metadata: Metadata = {
  title: "Composer Arena Phase 1 evidence pilot — July 19, 2026",
  description:
    "Sanitized deterministic Composer Phase 1 evidence: zero blind battles, zero ranks, and no human preference claim.",
  alternates: { canonical: "/bench/composer-arena/evidence/pilot/2026-07-19" },
};

function HashValue({ children }: { children: string }) {
  return <code className="mt-2 block break-all text-xs leading-6 text-slate-700">{children}</code>;
}

function statusClasses(result: PhaseOneResult) {
  if (result.terminal_status === "passed") return "border-emerald-300 bg-emerald-50 text-emerald-950";
  if (result.terminal_status === "failed") return "border-red-300 bg-red-50 text-red-950";
  return "border-amber-300 bg-amber-50 text-amber-950";
}

export default async function PhaseOneEvidencePage() {
  const { evidence, checksums } = await loadPhaseOneEvidence();
  const completedOutputs = evidence.task_success.results.filter((result) => result.output);

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
            Evidence / pilot · 2026-07-19
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
            Phase 1 evidence pilot
          </h1>
          <p className="mt-8 max-w-4xl text-base leading-8 text-[hsl(var(--muted-foreground))] sm:text-lg">
            A sanitized, dated record of deterministic task outcomes and complete-output acceptance on one audited public-safe cell. It cannot establish model preference or an Arena winner.
          </p>

          <div className="mt-10 border-l-4 border-red-500 bg-red-50 px-6 py-5 text-sm font-semibold leading-7 text-red-950 sm:text-base">
            Winner: none. Publication state: insufficient evidence. No blind comparison exists because the required visual roster is incomplete.
          </div>

          <dl className="mt-12 grid gap-px border border-[hsl(var(--border))] bg-[hsl(var(--border))] sm:grid-cols-3">
            {[
              ["Blind battles", evidence.vote_provenance.blind_battles],
              ["Published ranks", evidence.publication.rank_count],
              ["Human preference claims", evidence.publication.human_preference_claims ? 1 : 0],
            ].map(([term, value]) => (
              <div key={term} className="bg-white p-6">
                <dt className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">{term}</dt>
                <dd className="mt-2 text-4xl font-semibold tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-[hsl(var(--border))] px-6 py-16 sm:py-20" id="task-outcomes">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Deterministic task success</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Five outcomes; no preference ordering</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">
            {evidence.task_success.separation_statement}
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {evidence.task_success.results.map((result) => (
              <article key={result.baseline_id} className={`border p-6 ${statusClasses(result)}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{result.display_name}</h3>
                    <code className="mt-1 block text-xs">{result.baseline_id}</code>
                  </div>
                  <span className="border border-current px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]">
                    {result.terminal_status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-5 text-sm leading-7">{result.reason}</p>
                <dl className="mt-5 grid gap-4 border-t border-current/20 pt-5 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="opacity-70">Scientific treatment</dt>
                    <dd className="mt-1 font-semibold">{result.task_outcome.replaceAll("_", " ")}</dd>
                  </div>
                  <div>
                    <dt className="opacity-70">Preference eligible</dt>
                    <dd className="mt-1 font-semibold">No</dd>
                  </div>
                  {result.run_id && (
                    <div className="sm:col-span-2">
                      <dt className="opacity-70">Run ID</dt>
                      <dd className="mt-1 break-all font-semibold">{result.run_id}</dd>
                    </div>
                  )}
                  {result.failure_code && (
                    <div>
                      <dt className="opacity-70">Failure code</dt>
                      <dd className="mt-1 font-semibold">{result.failure_code}</dd>
                    </div>
                  )}
                  {result.latency_ms !== null && (
                    <div>
                      <dt className="opacity-70">Elapsed</dt>
                      <dd className="mt-1 font-semibold tabular-nums">{(result.latency_ms / 1000).toFixed(3)}s</dd>
                    </div>
                  )}
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[hsl(var(--border))] px-6 py-16 sm:py-20" id="complete-outputs">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Complete-output acceptance</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Two outputs passed every acceptance gate</h2>
          <div className="mt-8 overflow-x-auto border border-[hsl(var(--border))] bg-white">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <caption className="sr-only">Accepted Phase 1 outputs</caption>
              <thead className="bg-slate-950 text-white">
                <tr>
                  {['Candidate', 'Output', 'Decode', 'Opening black', 'A/V drift', 'Output SHA-256', 'Acceptance SHA-256'].map((heading) => (
                    <th key={heading} scope="col" className="px-4 py-3 text-xs font-medium uppercase tracking-[0.1em]">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {completedOutputs.map((result) => {
                  const output = result.output!;
                  return (
                    <tr key={result.baseline_id} className="border-t border-[hsl(var(--border))] align-top">
                      <td className="px-4 py-5 font-semibold">{result.display_name}</td>
                      <td className="px-4 py-5 text-xs leading-6">{(output.duration_ms / 1000).toFixed(3)}s<br />{output.bytes.toLocaleString()} bytes<br />{output.video_codec}/{output.audio_codec} · {output.format}</td>
                      <td className="px-4 py-5 font-semibold text-emerald-700">PASS</td>
                      <td className="px-4 py-5 tabular-nums">{output.opening_black_ms}ms</td>
                      <td className="px-4 py-5 text-xs tabular-nums">{output.av_start_drift_ms}ms start<br />{output.av_end_drift_ms}ms end</td>
                      <td className="max-w-xs break-all px-4 py-5 text-xs">{output.output_sha256}</td>
                      <td className="max-w-xs break-all px-4 py-5 text-xs">{output.render_acceptance_sha256}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-[hsl(var(--border))] px-6 py-16 sm:py-20" id="diagnostics">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Disclosed diagnostic limitation</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">HyperFrames compatibility finding</h2>
          <div className="mt-8 border border-amber-300 bg-amber-50 p-6 text-amber-950 sm:p-8">
            <p className="text-sm leading-7">{evidence.diagnostic_limitations.finding}</p>
            <dl className="mt-6 grid gap-5 border-t border-amber-300 pt-6 text-sm sm:grid-cols-3">
              <div><dt className="text-xs uppercase tracking-[0.12em]">HyperFrames</dt><dd className="mt-1 font-semibold">{evidence.diagnostic_limitations.hyperframes_version}</dd></div>
              <div><dt className="text-xs uppercase tracking-[0.12em]">Control diagnostics</dt><dd className="mt-1 text-2xl font-semibold">{evidence.diagnostic_limitations.mechanical_control_diagnostic_count}</dd></div>
              <div><dt className="text-xs uppercase tracking-[0.12em]">Grok diagnostics</dt><dd className="mt-1 text-2xl font-semibold">{evidence.diagnostic_limitations.grok_4_5_diagnostic_count}</dd></div>
            </dl>
            <p className="mt-6 text-sm leading-7"><strong>Treatment:</strong> {evidence.diagnostic_limitations.compatibility_treatment}</p>
            <p className="mt-3 text-sm leading-7"><strong>Excluded auxiliary output:</strong> {evidence.diagnostic_limitations.auxiliary_description_step}</p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-20" id="provenance">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Frozen provenance</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Exact contract, runner, protocol, and output hashes</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              ["Arena contract", evidence.arena_binding.arena_contract_sha256],
              ["Parent contract", evidence.arena_binding.parent_contract_sha256],
              ["Arena source head", evidence.arena_binding.source_head_sha],
              ["Runner head", evidence.frozen_evidence.runner.head_sha],
              ["Runner protocol", evidence.frozen_evidence.runner.protocol_sha256],
              ["Runner prompt", evidence.frozen_evidence.runner.prompt_sha256],
              ["Tool registry", evidence.frozen_evidence.tool_registry_sha256],
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
              ["Evidence JSON", `${ARTIFACT_ROOT}/phase-1-results.json`],
              ["Evidence schema", `${ARTIFACT_ROOT}/phase-1-results.schema.json`],
              ["Checksums", `${ARTIFACT_ROOT}/checksums.json`],
              ["Public README", `${ARTIFACT_ROOT}/README.md`],
            ].map(([label, href]) => (
              <a key={href} href={href} download className="flex items-center justify-between gap-4 border border-[hsl(var(--border))] bg-white px-5 py-4 text-sm font-semibold hover:border-blue-500">
                <span>{label}</span><span aria-hidden="true">↓</span>
              </a>
            ))}
          </div>
          <p className="mt-6 break-all text-xs leading-6 text-[hsl(var(--muted-foreground))]">
            Evidence artifact SHA-256: <strong>{checksums.files["phase-1-results.json"]}</strong> · Next gate: <strong>{evidence.next_gate}</strong>
          </p>
        </div>
      </section>
    </main>
  );
}
