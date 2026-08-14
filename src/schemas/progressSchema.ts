import { z } from 'zod';
import { ANSWER_MODES, EXERCISE_TYPES } from './exerciseSchema';

/**
 * Persisted state lives in localStorage and is versioned. Every change to the
 * shape requires a bump of `PROGRESS_SCHEMA_VERSION` plus a migration in
 * `features/progress/progressPersistence.ts`.
 */
export const PROGRESS_SCHEMA_VERSION = 1;

export const CHAPTER_STATUSES = [
  'notStarted',
  'inProgress',
  'completed',
  'mastered',
] as const;
export type ChapterStatus = (typeof CHAPTER_STATUSES)[number];

export const ATTEMPT_OUTCOMES = [
  'correctFirstAttempt',
  'correctSecondAttempt',
  'incorrect',
  'revealed',
] as const;
export type AttemptOutcome = (typeof ATTEMPT_OUTCOMES)[number];

export const REVIEW_STAGES = [
  'learning',
  'review1',
  'review2',
  'review3',
  'stable',
] as const;
export type ReviewStage = (typeof REVIEW_STAGES)[number];

export interface ChapterProgress {
  chapterNumber: number;
  status: ChapterStatus;
  bestScorePercent: number;
  latestScorePercent: number;
  firstAttemptAccuracy: number;
  answeredCount: number;
  correctTextInputs: number;
  attempts: number;
  bookmarked: boolean;
  lastPracticedAt?: string;
  completedAt?: string;
}

export interface ExerciseHistory {
  exerciseId: string;
  chapterNumber: number;
  timesAnswered: number;
  timesCorrect: number;
  timesIncorrect: number;
  consecutiveCorrect: number;
  stage: ReviewStage;
  dueAt?: string;
  lastOutcome?: AttemptOutcome;
  lastAnsweredAt?: string;
}

export interface PersistedProgressV1 {
  schemaVersion: typeof PROGRESS_SCHEMA_VERSION;
  chapters: Record<number, ChapterProgress>;
  exerciseHistory: Record<string, ExerciseHistory>;
  lastOpenedChapter?: number;
}

export const chapterProgressSchema = z.object({
  chapterNumber: z.number().int().min(0),
  status: z.enum(CHAPTER_STATUSES),
  bestScorePercent: z.number().min(0).max(100),
  latestScorePercent: z.number().min(0).max(100),
  firstAttemptAccuracy: z.number().min(0).max(100),
  answeredCount: z.number().int().min(0),
  correctTextInputs: z.number().int().min(0),
  attempts: z.number().int().min(0),
  bookmarked: z.boolean(),
  lastPracticedAt: z.string().min(1).optional(),
  completedAt: z.string().min(1).optional(),
});

export const exerciseHistorySchema = z.object({
  exerciseId: z.string().min(1),
  chapterNumber: z.number().int().min(0),
  timesAnswered: z.number().int().min(0),
  timesCorrect: z.number().int().min(0),
  timesIncorrect: z.number().int().min(0),
  consecutiveCorrect: z.number().int().min(0),
  stage: z.enum(REVIEW_STAGES),
  dueAt: z.string().min(1).optional(),
  lastOutcome: z.enum(ATTEMPT_OUTCOMES).optional(),
  lastAnsweredAt: z.string().min(1).optional(),
});

export const persistedProgressV1Schema = z.object({
  schemaVersion: z.literal(PROGRESS_SCHEMA_VERSION),
  chapters: z.record(z.string(), chapterProgressSchema),
  exerciseHistory: z.record(z.string(), exerciseHistorySchema),
  lastOpenedChapter: z.number().int().min(0).optional(),
});

/* ------------------------------------------------------------------ */
/* Practice session (persisted so a refresh can resume a session)      */
/* ------------------------------------------------------------------ */

export const SESSION_SCHEMA_VERSION = 1;

export interface ExerciseAttemptRecord {
  exerciseId: string;
  type: (typeof EXERCISE_TYPES)[number];
  attempts: number;
  outcome: AttemptOutcome;
  score: number;
  submittedAnswers: string[];
}

export type PracticeMode = 'chapter' | 'review' | 'cumulative' | 'quick';

export interface PersistedSessionV1 {
  schemaVersion: typeof SESSION_SCHEMA_VERSION;
  chapterNumber: number;
  mode: PracticeMode;
  exerciseIds: string[];
  /** Display order of the answer options, kept stable across a page refresh. */
  optionOrder: Record<string, string[]>;
  /** Display order of segment ids for sentence-ordering exercises. */
  segmentOrder: Record<string, string[]>;
  /** Display order of word-bank indices for drag-to-slots exercises. */
  wordBankOrder: Record<string, number[]>;
  /** Display order of pair ids for the right column of matching exercises. */
  matchingRightOrder: Record<string, string[]>;
  currentIndex: number;
  results: Record<string, ExerciseAttemptRecord>;
  startedAt: string;
}

export const exerciseAttemptRecordSchema = z.object({
  exerciseId: z.string().min(1),
  type: z.enum(EXERCISE_TYPES),
  attempts: z.number().int().min(0),
  outcome: z.enum(ATTEMPT_OUTCOMES),
  score: z.number().min(0).max(1),
  submittedAnswers: z.array(z.string()),
});

export const persistedSessionV1Schema = z.object({
  schemaVersion: z.literal(SESSION_SCHEMA_VERSION),
  chapterNumber: z.number().int().min(0),
  mode: z.enum(['chapter', 'review', 'cumulative', 'quick']),
  exerciseIds: z.array(z.string().min(1)),
  optionOrder: z.record(z.string(), z.array(z.string().min(1))),
  segmentOrder: z.record(z.string(), z.array(z.string().min(1))),
  wordBankOrder: z.record(z.string(), z.array(z.number().int().min(0))),
  matchingRightOrder: z.record(z.string(), z.array(z.string().min(1))),
  currentIndex: z.number().int().min(0),
  results: z.record(z.string(), exerciseAttemptRecordSchema),
  startedAt: z.string().min(1),
});

export type SessionMatchesInterface =
  PersistedSessionV1 extends z.infer<typeof persistedSessionV1Schema> ? true : never;

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export const SETTINGS_SCHEMA_VERSION = 1;

/** `system` follows the operating system's light/dark preference. */
export const THEMES = ['system', 'light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];

export interface PersistedSettingsV1 {
  schemaVersion: typeof SETTINGS_SCHEMA_VERSION;
  shuffleOptions: boolean;
  showHints: boolean;
  showUmlautHelper: boolean;
  reducedMotion: boolean;
  autoAdvance: boolean;
  /** Default answer mode used by authoring tools and tests. */
  defaultAnswerMode: (typeof ANSWER_MODES)[number];
  theme: Theme;
}

export const persistedSettingsV1Schema = z.object({
  schemaVersion: z.literal(SETTINGS_SCHEMA_VERSION),
  shuffleOptions: z.boolean(),
  showHints: z.boolean(),
  showUmlautHelper: z.boolean(),
  reducedMotion: z.boolean(),
  autoAdvance: z.boolean(),
  defaultAnswerMode: z.enum(ANSWER_MODES),
  // `.catch` rather than `.default`: settings written before the theme existed
  // would otherwise fail the whole parse, and a failed parse resets every
  // other setting back to its default.
  theme: z.enum(THEMES).catch('system'),
});

/** Compile-time proof that the Zod schemas and the interfaces stay in sync. */
type AssertAssignable<Target, Value extends Target> = Value;
export type ChapterProgressMatchesInterface = AssertAssignable<
  ChapterProgress,
  z.infer<typeof chapterProgressSchema>
>;
export type ExerciseHistoryMatchesInterface = AssertAssignable<
  ExerciseHistory,
  z.infer<typeof exerciseHistorySchema>
>;
export type SettingsMatchesInterface = AssertAssignable<
  PersistedSettingsV1,
  z.infer<typeof persistedSettingsV1Schema>
>;
