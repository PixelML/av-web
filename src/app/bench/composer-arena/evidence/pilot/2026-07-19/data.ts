import { readFile } from "node:fs/promises";
import path from "node:path";

export type PhaseOneOutput = {
  complete: true;
  duration_ms: number;
  bytes: number;
  video_codec: string;
  audio_codec: string;
  format: string;
  decode_passed: true;
  opening_black_ms: number;
  av_start_drift_ms: number;
  av_end_drift_ms: number;
  output_sha256: string;
  render_acceptance_sha256: string;
};

export type PhaseOneResult = {
  baseline_id: string;
  display_name: string;
  classification: "control" | "evaluated_model" | "not_applicable";
  terminal_status: "passed" | "failed" | "excluded" | "not_applicable";
  task_outcome: "pass" | "policy_task_failure" | "runtime_provider_compatibility" | "direct_perception_unavailable";
  preference_eligible: false;
  quality_loss: false;
  run_id: string | null;
  latency_ms: number | null;
  failure_code: string | null;
  reason: string;
  output: PhaseOneOutput | null;
};

export type PhaseOneEvidence = {
  evidence_id: string;
  evidence_date: string;
  status: string;
  arena_binding: {
    arena_id: string;
    source_head_sha: string;
    arena_contract_sha256: string;
    parent_contract_sha256: string;
  };
  publication: {
    publishable: false;
    state: "insufficient_evidence";
    leaderboard: false;
    winner: null;
    rank_count: 0;
    human_preference_claims: false;
    reasons: string[];
  };
  vote_provenance: {
    planned_battle_groups: 0;
    blind_battles: 0;
    real_human_votes: 0;
    resolved_battle_groups: 0;
  };
  frozen_evidence: {
    dataset_repo_id: string;
    dataset_revision: string;
    selection_sha256: string;
    release_sha256: string;
    case_pack_sha256: string;
    content_evidence_sha256: string;
    task_brief_sha256: string;
    tool_registry_sha256: string;
    runner: {
      version: string;
      head_sha: string;
      protocol_sha256: string;
      prompt_sha256: string;
    };
  };
  task_success: {
    separation_statement: string;
    results: PhaseOneResult[];
  };
  diagnostic_limitations: {
    hyperframes_version: string;
    finding: string;
    mechanical_control_diagnostic_count: number;
    grok_4_5_diagnostic_count: number;
    compatibility_treatment: string;
    auxiliary_description_step: string;
  };
  next_gate: string;
};

type Checksums = {
  algorithm: "sha256";
  files: Record<string, string>;
};

const artifactRoot = path.join(
  process.cwd(),
  "public",
  "bench",
  "composer-arena",
  "evidence",
  "pilot",
  "2026-07-19",
);

export async function loadPhaseOneEvidence() {
  const [evidence, checksums] = await Promise.all([
    readFile(path.join(artifactRoot, "phase-1-results.json"), "utf8").then(
      (raw) => JSON.parse(raw) as PhaseOneEvidence,
    ),
    readFile(path.join(artifactRoot, "checksums.json"), "utf8").then(
      (raw) => JSON.parse(raw) as Checksums,
    ),
  ]);

  return { evidence, checksums };
}
