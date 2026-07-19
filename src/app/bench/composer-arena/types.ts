export type ArenaTrackId = "controlled-agent" | "end-to-end-system";

export type ArenaStanding = "ranked" | "tied" | "insufficient_evidence";

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
  canonical_track_id: "controlled-semantic-text-evidence-v0" | "end-to-end-visual-orchestration-v0";
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
  data_class: "rankable" | "exploratory" | "synthetic";
  official_ranking_enabled: boolean;
  official_vote_backend: "not_configured" | "governed_v1";
  display_label: string;
  arena_binding: {
    arena_id: "composer-archive-to-output-arena-v0";
    source_head_sha: string;
    arena_contract_sha256: string;
    parent_contract_sha256: string;
  };
  publication: {
    publishable: boolean;
    state: "ranked" | "tied" | "insufficient_evidence";
    scope: "independent_track_results_only";
    winner: string | null;
    rank_count: number;
  };
  vote_provenance: {
    collection_mode: "bounded_human_review" | "exploratory_model_review" | "synthetic_fixture" | "no_eligible_votes";
    crowdsourced: false;
    real_human_votes: number;
  };
  dataset: {
    repo_id: string;
    revision: string;
    license_claim: string;
    license_scope: string;
    attribution: string;
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
    ranking_method: "Bradley-Terry logistic maximum likelihood";
    confidence_level: 0.95;
    bootstrap_replicates: 2000;
    minimum_resolved_battles_per_pair_overall: 4;
    position_bias_decisive_presentations: 20;
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
