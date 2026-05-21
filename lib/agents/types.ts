export type AgentStage =
  | "source_discovery"
  | "question_generation"
  | "answer_verification"
  | "quality_policy_check"
  | "difficulty_tagging"
  | "publishing";

export type JobStatus = "queued" | "in_progress" | "completed" | "failed";

export type ReviewStatus = "draft" | "needs_review" | "approved" | "rejected";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type CertificationProvider =
  | "aws"
  | "azure"
  | "cisco"
  | "comptia"
  | "gcp"
  | "kubernetes"
  | "other";

export type SourceReference = {
  title: string;
  url: string;
  provider: CertificationProvider;
  sourceType: "official" | "community" | "training";
  discoveredAt: string;
};

export type GeneratedQuestion = {
  id: string;
  certificationKey: string;
  objective: string;
  question: string;
  options: string[];
  answers: string[];
  explanation: string[];
  resources: string[];
  topics: string[];
  difficulty: Difficulty;
  confidenceScore: number;
  lastVerifiedAt: string | null;
  reviewStatus: ReviewStatus;
  reviewerNotes: string[];
  qualityFlags: string[];
  provenance: SourceReference[];
  createdAt: string;
  updatedAt: string;
};

export type CertificationJobPayload = {
  certificationKey: string;
  provider: CertificationProvider;
  examCode: string;
  examVersion?: string;
  objectiveHints?: string[];
  sourceUrls?: string[];
  questionCount?: number;
  urgent?: boolean;
};

export type PipelineJob = {
  id: string;
  payload: CertificationJobPayload;
  status: JobStatus;
  stage: AgentStage;
  stagesCompleted: AgentStage[];
  error: string | null;
  runCount: number;
  queuedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  outputQuestionIds: string[];
};

export type PipelineResult = {
  sources: SourceReference[];
  questions: GeneratedQuestion[];
};

export type PipelineMetrics = {
  totalQuestionsGenerated: number;
  totalQuestionsApproved: number;
  totalQuestionsRejected: number;
  totalJobsCompleted: number;
  totalJobsFailed: number;
};

export type SchedulerRequest = {
  certifications: CertificationJobPayload[];
};
