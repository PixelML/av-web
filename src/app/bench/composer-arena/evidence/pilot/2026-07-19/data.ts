import { readFile } from "node:fs/promises";
import path from "node:path";

export type TaskSuccessLane = {
  lane_id: "mechanical-control" | "evaluated-lane-a" | "evaluated-lane-b";
  classification: "control" | "evaluated_system";
  identity_state: "public_control" | "sealed_pending_founder_vote";
  attempted_cells: 7;
  structural_passes: number;
  structural_failures: number;
  complete_outputs_accepted: number;
  complete_output_failures: number;
  model_calls: number;
  source_summary_sha256: string;
};

export type SevenFamilyEvidence = {
  evidence_id: string;
  evidence_date: string;
  status: string;
  publication: {
    publishable: false;
    state: "insufficient_evidence";
    leaderboard: false;
    winner: null;
    rank_count: 0;
    human_preference_claims: false;
  };
  vote_provenance: {
    blind_battles: 0;
    real_human_votes: 0;
    resolved_battle_groups: 0;
  };
  frozen_evidence: {
    dataset_repo_id: string;
    dataset_revision: string;
    staging_manifest_sha256: string;
    contract_sha256: string;
    release_sha256: string;
    case_pack_sha256: string;
  };
  cohort: {
    eligible_cells: 7;
    distinct_source_families: 7;
    favorable_selection: false;
    source_family_disjoint: true;
  };
  task_success: {
    separation_statement: string;
    lanes: TaskSuccessLane[];
  };
  blind_review: {
    packet_public: false;
    candidate_outputs_public: false;
    identity_mapping_public: false;
    founder_vote_recorded: false;
    next_gate: string;
  };
  limitations: string[];
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

export async function loadSevenFamilyEvidence() {
  const [evidence, checksums] = await Promise.all([
    readFile(path.join(artifactRoot, "seven-family-results.json"), "utf8").then(
      (raw) => JSON.parse(raw) as SevenFamilyEvidence,
    ),
    readFile(path.join(artifactRoot, "checksums.json"), "utf8").then(
      (raw) => JSON.parse(raw) as Checksums,
    ),
  ]);

  return { evidence, checksums };
}
