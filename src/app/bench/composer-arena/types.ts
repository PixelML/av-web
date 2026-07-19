export type ArenaTrackId = "controlled-agent" | "end-to-end-system";

export type ArenaStanding = "ranked" | "tie" | "insufficient_evidence";

export type TokenUsage = {
  input: number;
  output: number;
  cache_read: number;
  cache_write: number;
};

export type TaskSlice = {
  task_id: string;
  label: string;
  success_rate: number;
  battle_count: number;
};

export type ArenaRow = {
  standing: ArenaStanding;
  display_rank: string;
  model: string;
  provider: string;
  version: string;
  evaluation_date: string;
  arena_score: number;
  arena_score_ci95: [number, number];
  battle_count: number;
  deterministic_task_success: number;
  failure_rate: number;
  latency_ms_p50: number;
  tokens: TokenUsage;
  estimated_cost_usd_per_run: number;
  per_task_slices: TaskSlice[];
};

export type ArenaTrack = {
  id: ArenaTrackId;
  title: string;
  description: string;
  rows: ArenaRow[];
};

export type ExploratoryCapability = {
  id: string;
  title: string;
  status: "non_rankable";
  summary: string;
  evidence_scope: string;
  limitation: string;
};

export type ArenaRelease = {
  schema_version: 1;
  contract_version: "composer-arena-public-release-v0.1";
  release_id: string;
  generated_at: string;
  release_mode: "synthetic_non_rankable_preview" | "governed_rankable_release";
  official_ranking_enabled: boolean;
  official_vote_backend: "not_configured" | "governed_v1";
  display_label: string;
  dataset: {
    repo_id: string;
    revision: string;
    license_claim: string;
    license_scope: string;
    attribution: string;
    contract_sha256: string;
    finevideo_release_sha256: string;
    selection_manifest_sha256: string;
    public_eval_source_family_count: number;
    split_policy: {
      source_family_disjoint: true;
      public_eval: string;
      private_test: string;
      hidden_test_published: false;
    };
  };
  evaluation_policy: {
    confidence_level: 0.95;
    minimum_battles_for_standing: number;
    tie_rule: string;
    insufficient_evidence_rule: string;
    local_vote_policy: string;
    contamination_limit: string;
    privacy_limit: string;
  };
  tracks: ArenaTrack[];
  exploratory_capabilities: ExploratoryCapability[];
  known_limitations: string[];
};

export type EvidenceLink = {
  label: string;
  href: string;
};

export type BattleCandidate = {
  candidate_id: string;
  model: string;
  provider: string;
  version: string;
  output_title: string;
  output_summary: string;
  evidence: EvidenceLink[];
};

export type ArenaBattle = {
  battle_id: string;
  track: ArenaTrackId;
  task_slice: string;
  prompt: string;
  source: {
    fixture_id: string;
    source_family_id: string;
    revision: string;
    rankable: boolean;
  };
  left: BattleCandidate;
  right: BattleCandidate;
};

export type ArenaChecksums = {
  algorithm: "sha256";
  files: Record<string, string>;
};
