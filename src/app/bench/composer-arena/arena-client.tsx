"use client";

import { useMemo, useState } from "react";

import type {
  ArenaBattle,
  ArenaRelease,
  ArenaTrackId,
  BattleCandidate,
} from "./types";

type Judgment = "left" | "right" | "tie" | "both_bad" | "abstain";

const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

const integer = new Intl.NumberFormat("en-US");

function StandingBadge({ standing }: { standing: "ranked" | "tied" | "insufficient_evidence" }) {
  if (standing === "insufficient_evidence") {
    return (
      <span className="inline-flex border border-amber-300 bg-amber-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-950">
        insufficient evidence
      </span>
    );
  }

  if (standing === "tied") {
    return (
      <span className="inline-flex border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-800">
        tied example
      </span>
    );
  }

  return (
    <span className="inline-flex border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-800">
      ranked
    </span>
  );
}

function TrackTable({ release, trackId }: { release: ArenaRelease; trackId: ArenaTrackId }) {
  const track = release.tracks.find((candidate) => candidate.id === trackId);

  if (!track) return null;

  if (track.rows.length === 0) {
    return (
      <div>
        <div className="mb-6 max-w-3xl">
          <h3 className="text-xl font-semibold">{track.title}</h3>
          <p className="mt-2 text-sm leading-7 text-[hsl(var(--muted-foreground))]">{track.description}</p>
          <code className="mt-2 block text-xs text-[hsl(var(--muted-foreground))]">{track.canonical_track_id}</code>
        </div>
        <div className="border border-amber-300 bg-amber-50 p-6 text-sm leading-7 text-amber-950">
          No public standings are available. Task-success evidence stays separate from preference ranking.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 max-w-3xl">
        <h3 className="text-xl font-semibold">{track.title}</h3>
        <p className="mt-2 text-sm leading-7 text-[hsl(var(--muted-foreground))]">{track.description}</p>
        <code className="mt-2 block text-xs text-[hsl(var(--muted-foreground))]">{track.canonical_track_id}</code>
      </div>

      <div className="overflow-x-auto border border-[hsl(var(--border))] bg-white">
        <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
          <caption className="sr-only">{track.title} synthetic preview standings</caption>
          <thead className="bg-slate-950 text-white">
            <tr>
              {[
                "Standing",
                "Model / route",
                "Arena score (95% CI)",
                "Battles",
                "Task success",
                "Failure rate",
                "p50 latency",
                "Tokens",
                "Est. cost / run",
                "Per-task slices",
              ].map((heading) => (
                <th key={heading} scope="col" className="px-4 py-3 text-xs font-medium uppercase tracking-[0.1em]">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {track.rows.map((row) => (
              <tr key={`${track.id}-${row.version}`} className="border-t border-[hsl(var(--border))] align-top">
                <td className="px-4 py-5">
                  <div className="text-lg font-semibold">{row.display_rank}</div>
                  <div className="mt-2"><StandingBadge standing={row.standing} /></div>
                </td>
                <td className="px-4 py-5">
                  <div className="font-semibold">{row.model}</div>
                  <div className="mt-1 text-xs leading-5 text-[hsl(var(--muted-foreground))]">
                    {row.provider}<br />{row.version}<br />{row.evaluation_date}
                  </div>
                </td>
                <td className="px-4 py-5 tabular-nums">
                  <div className="text-lg font-semibold">{integer.format(row.arena_score)}</div>
                  <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                    {integer.format(row.arena_score_ci95[0])}–{integer.format(row.arena_score_ci95[1])}
                  </div>
                </td>
                <td className="px-4 py-5 tabular-nums">{integer.format(row.battle_count)}</td>
                <td className="px-4 py-5 tabular-nums">{percent.format(row.deterministic_task_success)}</td>
                <td className="px-4 py-5 tabular-nums">{percent.format(row.failure_rate)}</td>
                <td className="px-4 py-5 tabular-nums">{(row.latency_ms_p50 / 1000).toFixed(1)}s</td>
                <td className="px-4 py-5 text-xs leading-6 tabular-nums">
                  {integer.format(row.tokens.input)} in<br />
                  {integer.format(row.tokens.output)} out<br />
                  {integer.format(row.tokens.cache_read)} cache read
                </td>
                <td className="px-4 py-5 tabular-nums">${row.estimated_cost_usd_per_run.toFixed(2)}</td>
                <td className="px-4 py-5">
                  <ul className="space-y-3">
                    {row.per_task_slices.map((slice) => (
                      <li key={slice.task_id} className="min-w-48">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-xs font-semibold">{slice.label}</span>
                          <span className="text-xs tabular-nums">{percent.format(slice.success_rate)}</span>
                        </div>
                        <div className="mt-1 h-1.5 bg-slate-100" aria-hidden="true">
                          <div className="h-full bg-blue-500" style={{ width: `${slice.success_rate * 100}%` }} />
                        </div>
                        <div className="mt-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                          {slice.battle_count} synthetic battles
                        </div>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CandidateCard({
  label,
  candidate,
  revealed,
}: {
  label: "A" | "B";
  candidate: BattleCandidate;
  revealed: boolean;
}) {
  return (
    <article className="border border-[hsl(var(--border))] bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <span className="flex h-9 w-9 items-center justify-center bg-slate-950 text-sm font-semibold text-white" aria-hidden="true">
          {label}
        </span>
        <span className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">
          {revealed ? candidate.model : "identity hidden"}
        </span>
      </div>
      <h4 className="mt-6 text-lg font-semibold">Output {label}</h4>
      <p className="mt-3 text-sm leading-7 text-[hsl(var(--muted-foreground))]">{candidate.output_summary}</p>

      {revealed && (
        <div className="mt-6 border-t border-[hsl(var(--border))] pt-5">
          <dl className="grid gap-3 text-xs sm:grid-cols-2">
            <div>
              <dt className="text-[hsl(var(--muted-foreground))]">Provider</dt>
              <dd className="mt-1 font-semibold">{candidate.provider}</dd>
            </div>
            <div>
              <dt className="text-[hsl(var(--muted-foreground))]">Version</dt>
              <dd className="mt-1 font-semibold">{candidate.version}</dd>
            </div>
          </dl>
          <div className="mt-5 flex flex-wrap gap-3">
            {candidate.evidence.map((link) => (
              <a key={`${candidate.candidate_id}-${link.href}`} href={link.href} className="text-xs font-semibold text-blue-600 underline underline-offset-4">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function BattleReplay({ battles }: { battles: ArenaBattle[] }) {
  const [battleIndex, setBattleIndex] = useState(0);
  const [swapped, setSwapped] = useState(false);
  const [judgment, setJudgment] = useState<Judgment | null>(null);
  const battle = battles[battleIndex];

  const [candidateA, candidateB] = useMemo(
    () => (swapped ? [battle.right, battle.left] : [battle.left, battle.right]),
    [battle, swapped],
  );

  const chooseBattle = (index: number) => {
    setBattleIndex(index);
    setSwapped(false);
    setJudgment(null);
  };

  const swap = () => {
    setSwapped((value) => !value);
    setJudgment(null);
  };

  return (
    <div className="border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-5 sm:p-8">
      <div className="flex flex-col gap-5 border-b border-[hsl(var(--border))] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <label htmlFor="battle-replay" className="text-xs font-semibold uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">
            Replay fixture
          </label>
          <select
            id="battle-replay"
            value={battleIndex}
            onChange={(event) => chooseBattle(Number(event.target.value))}
            className="mt-2 block w-full border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm sm:w-auto"
          >
            {battles.map((item, index) => (
              <option key={item.battle_id} value={index}>
                {item.track} · {item.task_slice}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={swap}
          className="border border-[hsl(var(--border))] bg-white px-4 py-2 text-sm font-semibold hover:border-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Swap A/B order
        </button>
      </div>

      <div className="py-6">
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.12em] text-[hsl(var(--muted-foreground))]">
          <span>{battle.track}</span><span aria-hidden="true">/</span><span>{battle.task_slice}</span>
        </div>
        <p className="mt-4 max-w-4xl text-sm leading-7">{battle.prompt}</p>
        <p className="mt-3 text-xs text-[hsl(var(--muted-foreground))]">
          Synthetic source: {battle.source.fixture_id} · {battle.source.source_family_id} · non-rankable
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CandidateCard label="A" candidate={candidateA} revealed={judgment !== null} />
        <CandidateCard label="B" candidate={candidateB} revealed={judgment !== null} />
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold">Record a local demo judgment</legend>
        <p className="mt-2 text-xs leading-6 text-[hsl(var(--muted-foreground))]">
          This selection stays in this page only. No request is sent and official standings never change.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {([
            ["left", "A is better"],
            ["tie", "Tie"],
            ["right", "B is better"],
            ["both_bad", "Both bad"],
            ["abstain", "Abstain"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setJudgment(value)}
              aria-pressed={judgment === value}
              className={`border px-4 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                judgment === value
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-[hsl(var(--border))] bg-white hover:border-blue-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 min-h-7 text-sm" aria-live="polite">
        {judgment ? (
          <p className="font-semibold text-blue-700">
            Identity revealed. Demo judgment recorded locally as {judgment.replace("_", " ")}; excluded from official ranking.
          </p>
        ) : (
          <p className="text-[hsl(var(--muted-foreground))]">Choose only after comparing the anonymous outputs.</p>
        )}
      </div>
    </div>
  );
}

export default function ArenaClient({ release, battles }: { release: ArenaRelease; battles: ArenaBattle[] }) {
  const [trackId, setTrackId] = useState<ArenaTrackId>("controlled-agent");

  return (
    <>
      <section className="border-b border-[hsl(var(--border))] px-6 py-16 sm:py-20" id="standings">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Standings gate</p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Separate views; no forced ranks</h2>
            </div>
            <div className="inline-flex w-full border border-[hsl(var(--border))] bg-white p-1 sm:w-auto" role="group" aria-label="Arena track">
              {release.tracks.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => setTrackId(track.id)}
                  aria-pressed={trackId === track.id}
                  className={`flex-1 px-4 py-2 text-sm font-semibold sm:flex-none ${
                    trackId === track.id ? "bg-slate-950 text-white" : "hover:bg-slate-50"
                  }`}
                >
                  {track.title}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 border-l-4 border-amber-400 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-950">
            No synthetic or measured score rows are published. A real standing requires at least {release.evaluation_policy.minimum_resolved_battles_per_pair_overall} resolved battles per pair plus the full frozen gates.
          </div>

          <TrackTable release={release} trackId={trackId} />
        </div>
      </section>

      <section className="border-b border-[hsl(var(--border))] px-6 py-16 sm:py-20" id="capabilities">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Exploratory capabilities</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Observed separately; never converted into rank</h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {release.exploratory_capabilities.map((capability) => (
              <article key={capability.id} className="border border-[hsl(var(--border))] bg-white p-6">
                <span className="inline-flex border border-amber-300 bg-amber-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-950">
                  non-rankable
                </span>
                <h3 className="mt-5 text-lg font-semibold">{capability.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[hsl(var(--muted-foreground))]">{capability.summary}</p>
                <p className="mt-5 border-t border-[hsl(var(--border))] pt-5 text-xs leading-6">
                  <strong>Evidence:</strong> {capability.evidence_scope}
                </p>
                <p className="mt-3 text-xs leading-6 text-[hsl(var(--muted-foreground))]">
                  <strong>Limit:</strong> {capability.limitation}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[hsl(var(--border))] px-6 py-16 sm:py-20" id="battle-replay">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Synthetic A/B interaction demo</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Practice the judgment flow; no real packet is here</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[hsl(var(--muted-foreground))]">
            Swap order to test position sensitivity, choose a winner, tie, both-bad, or abstain, then reveal generic demo identities. The real blind packet and model mapping remain private.
          </p>
          <div className="mt-8"><BattleReplay battles={battles} /></div>
        </div>
      </section>
    </>
  );
}
