import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  GeneratedQuestion,
  PipelineJob,
  PipelineMetrics,
  ReviewStatus,
} from "./types";

type AgentStore = {
  createJob: (job: PipelineJob) => Promise<void>;
  updateJob: (job: PipelineJob) => Promise<void>;
  listJobs: () => Promise<PipelineJob[]>;
  getJob: (id: string) => Promise<PipelineJob | null>;
  saveQuestions: (questions: GeneratedQuestion[]) => Promise<void>;
  listQuestions: (reviewStatus?: ReviewStatus) => Promise<GeneratedQuestion[]>;
  updateQuestion: (question: GeneratedQuestion) => Promise<void>;
  getMetrics: () => Promise<PipelineMetrics>;
};

const inMemoryJobs = new Map<string, PipelineJob>();
const inMemoryQuestions = new Map<string, GeneratedQuestion>();

const createInMemoryStore = (): AgentStore => {
  return {
    createJob: async (job) => {
      inMemoryJobs.set(job.id, job);
    },
    updateJob: async (job) => {
      inMemoryJobs.set(job.id, job);
    },
    listJobs: async () => Array.from(inMemoryJobs.values()),
    getJob: async (id) => inMemoryJobs.get(id) || null,
    saveQuestions: async (questions) => {
      questions.forEach((question) => {
        inMemoryQuestions.set(question.id, question);
      });
    },
    listQuestions: async (reviewStatus) => {
      const all = Array.from(inMemoryQuestions.values());
      if (!reviewStatus) {
        return all;
      }
      return all.filter((question) => question.reviewStatus === reviewStatus);
    },
    updateQuestion: async (question) => {
      inMemoryQuestions.set(question.id, question);
    },
    getMetrics: async () => {
      const questions = Array.from(inMemoryQuestions.values());
      const jobs = Array.from(inMemoryJobs.values());
      return {
        totalQuestionsGenerated: questions.length,
        totalQuestionsApproved: questions.filter(
          (question) => question.reviewStatus === "approved"
        ).length,
        totalQuestionsRejected: questions.filter(
          (question) => question.reviewStatus === "rejected"
        ).length,
        totalJobsCompleted: jobs.filter((job) => job.status === "completed")
          .length,
        totalJobsFailed: jobs.filter((job) => job.status === "failed").length,
      };
    },
  };
};

const normalizeJsonArray = <T>(value: unknown, fallback: T[]): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }
  return fallback;
};

const createSupabaseStore = (client: SupabaseClient): AgentStore => {
  return {
    createJob: async (job) => {
      const { error } = await client.from("agent_pipeline_jobs").insert({
        id: job.id,
        payload: job.payload,
        status: job.status,
        stage: job.stage,
        stages_completed: job.stagesCompleted,
        error_message: job.error,
        run_count: job.runCount,
        queued_at: job.queuedAt,
        started_at: job.startedAt,
        completed_at: job.completedAt,
        output_question_ids: job.outputQuestionIds,
      });
      if (error) {
        throw error;
      }
    },
    updateJob: async (job) => {
      const { error } = await client
        .from("agent_pipeline_jobs")
        .update({
          payload: job.payload,
          status: job.status,
          stage: job.stage,
          stages_completed: job.stagesCompleted,
          error_message: job.error,
          run_count: job.runCount,
          started_at: job.startedAt,
          completed_at: job.completedAt,
          output_question_ids: job.outputQuestionIds,
        })
        .eq("id", job.id);
      if (error) {
        throw error;
      }
    },
    listJobs: async () => {
      const { data, error } = await client
        .from("agent_pipeline_jobs")
        .select("*")
        .order("queued_at", { ascending: false });
      if (error) {
        throw error;
      }
      return (data || []).map((row: Record<string, unknown>) => ({
        id: String(row.id),
        payload: row.payload as PipelineJob["payload"],
        status: String(row.status) as PipelineJob["status"],
        stage: String(row.stage) as PipelineJob["stage"],
        stagesCompleted: normalizeJsonArray(row.stages_completed, []),
        error: row.error_message ? String(row.error_message) : null,
        runCount: Number(row.run_count || 0),
        queuedAt: String(row.queued_at),
        startedAt: row.started_at ? String(row.started_at) : null,
        completedAt: row.completed_at ? String(row.completed_at) : null,
        outputQuestionIds: normalizeJsonArray(row.output_question_ids, []),
      }));
    },
    getJob: async (id) => {
      const { data, error } = await client
        .from("agent_pipeline_jobs")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) {
        throw error;
      }
      if (!data) {
        return null;
      }

      const row = data as Record<string, unknown>;
      return {
        id: String(row.id),
        payload: row.payload as PipelineJob["payload"],
        status: String(row.status) as PipelineJob["status"],
        stage: String(row.stage) as PipelineJob["stage"],
        stagesCompleted: normalizeJsonArray(row.stages_completed, []),
        error: row.error_message ? String(row.error_message) : null,
        runCount: Number(row.run_count || 0),
        queuedAt: String(row.queued_at),
        startedAt: row.started_at ? String(row.started_at) : null,
        completedAt: row.completed_at ? String(row.completed_at) : null,
        outputQuestionIds: normalizeJsonArray(row.output_question_ids, []),
      };
    },
    saveQuestions: async (questions) => {
      if (questions.length === 0) {
        return;
      }
      const payload = questions.map((question) => ({
        id: question.id,
        certification_key: question.certificationKey,
        objective: question.objective,
        question: question.question,
        options: question.options,
        answers: question.answers,
        explanation: question.explanation,
        resources: question.resources,
        topics: question.topics,
        difficulty: question.difficulty,
        confidence_score: question.confidenceScore,
        last_verified_at: question.lastVerifiedAt,
        review_status: question.reviewStatus,
        reviewer_notes: question.reviewerNotes,
        quality_flags: question.qualityFlags,
        provenance: question.provenance,
        created_at: question.createdAt,
        updated_at: question.updatedAt,
      }));

      const { error } = await client
        .from("agent_generated_questions")
        .upsert(payload, { onConflict: "id" });
      if (error) {
        throw error;
      }
    },
    listQuestions: async (reviewStatus) => {
      let query = client
        .from("agent_generated_questions")
        .select("*")
        .order("updated_at", { ascending: false });
      if (reviewStatus) {
        query = query.eq("review_status", reviewStatus);
      }
      const { data, error } = await query;
      if (error) {
        throw error;
      }
      return (data || []).map((row: Record<string, unknown>) => ({
        id: String(row.id),
        certificationKey: String(row.certification_key),
        objective: String(row.objective),
        question: String(row.question),
        options: normalizeJsonArray(row.options, []),
        answers: normalizeJsonArray(row.answers, []),
        explanation: normalizeJsonArray(row.explanation, []),
        resources: normalizeJsonArray(row.resources, []),
        topics: normalizeJsonArray(row.topics, []),
        difficulty: String(row.difficulty) as GeneratedQuestion["difficulty"],
        confidenceScore: Number(row.confidence_score || 0),
        lastVerifiedAt: row.last_verified_at ? String(row.last_verified_at) : null,
        reviewStatus: String(row.review_status) as ReviewStatus,
        reviewerNotes: normalizeJsonArray(row.reviewer_notes, []),
        qualityFlags: normalizeJsonArray(row.quality_flags, []),
        provenance: normalizeJsonArray(row.provenance, []),
        createdAt: String(row.created_at),
        updatedAt: String(row.updated_at),
      }));
    },
    updateQuestion: async (question) => {
      const { error } = await client
        .from("agent_generated_questions")
        .update({
          objective: question.objective,
          question: question.question,
          options: question.options,
          answers: question.answers,
          explanation: question.explanation,
          resources: question.resources,
          topics: question.topics,
          difficulty: question.difficulty,
          confidence_score: question.confidenceScore,
          last_verified_at: question.lastVerifiedAt,
          review_status: question.reviewStatus,
          reviewer_notes: question.reviewerNotes,
          quality_flags: question.qualityFlags,
          provenance: question.provenance,
          updated_at: question.updatedAt,
        })
        .eq("id", question.id);
      if (error) {
        throw error;
      }
    },
    getMetrics: async () => {
      const questions = await (async () => {
        const { data, error } = await client
          .from("agent_generated_questions")
          .select("review_status", { count: "exact" });
        if (error) {
          throw error;
        }
        return data || [];
      })();

      const jobs = await (async () => {
        const { data, error } = await client
          .from("agent_pipeline_jobs")
          .select("status");
        if (error) {
          throw error;
        }
        return data || [];
      })();

      return {
        totalQuestionsGenerated: questions.length,
        totalQuestionsApproved: questions.filter(
          (row: Record<string, unknown>) => row.review_status === "approved"
        ).length,
        totalQuestionsRejected: questions.filter(
          (row: Record<string, unknown>) => row.review_status === "rejected"
        ).length,
        totalJobsCompleted: jobs.filter(
          (row: Record<string, unknown>) => row.status === "completed"
        ).length,
        totalJobsFailed: jobs.filter(
          (row: Record<string, unknown>) => row.status === "failed"
        ).length,
      };
    },
  };
};

const getSupabaseStore = (): AgentStore | null => {
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  const client = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return createSupabaseStore(client);
};

let singleton: AgentStore | null = null;

export const getAgentStore = (): AgentStore => {
  if (singleton) {
    return singleton;
  }

  const supabaseStore = getSupabaseStore();
  singleton = supabaseStore || createInMemoryStore();
  return singleton;
};
