import { z } from 'zod';
import { ANSWER_MODES, EXERCISE_TYPES } from './exerciseSchema';

/**
 * Persisted state lives in localStorage and is versioned. Every change to the
 * shape requires a bump of `PROGRESS_SCHEMA_VERSION` plus a migration in
 * `features/progress/progressPersistence.ts`.
 */
export const PROGRESS_SCHEMA_VERSION = 4;

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
  /**
   * Milliseconds spent practising this chapter, summed over every session and
   * counting only while the tab was focused. `attempts` counts the finished
   * sessions, so `studyMs / attempts` is the average session length.
   */
  studyMs: number;
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
  /**
   * The exercise's own `grammarFocus`, copied here when the answer is recorded.
   * Reading it off the exercise instead would mean loading chapter bodies to
   * summarise progress, which is exactly what the code split forbids.
   */
  grammarFocus: string[];
  /**
   * True once the exercise has ever been answered wrongly — including a first
   * attempt failed and then corrected, which `timesIncorrect` does not record.
   * Sticky, and the difference between the two review ladders: material the
   * learner has struggled with comes back fast, material they have only ever
   * got right comes back slowly. Only these count towards a chapter's
   * `maxOpenReviewFlags`.
   */
  hasBeenWrong: boolean;
}

export interface DayChapterWork {
  answers: number;
  ms: number;
}

/**
 * What one local day of practice consisted of: how long, and on which chapters.
 * `ms` counts every focused minute, `chapters[n].ms` only the minutes credited
 * to a chapter — a cumulative review belongs to no single one, so the
 * difference between the two is the time spent on mixed material.
 */
export interface DayLogEntry {
  ms: number;
  chapters: Record<number, DayChapterWork>;
}

export interface PersistedProgressV4 {
  schemaVersion: typeof PROGRESS_SCHEMA_VERSION;
  chapters: Record<number, ChapterProgress>;
  exerciseHistory: Record<string, ExerciseHistory>;
  /**
   * Exercises answered per local day, `YYYY-MM-DD` → count. A history entry
   * only remembers when an exercise was answered *last*, so re-answering one
   * erases the earlier day; the streak and the activity calendar need a record
   * that additions never overwrite.
   */
  answersByDay: Record<string, number>;
  /**
   * Per-day practice log, `YYYY-MM-DD` → time and chapters. `answersByDay`
   * holds the day's exercise total and stays the source of truth for streaks
   * and the heatmap; this adds the two dimensions it cannot express.
   */
  dayLog: Record<string, DayLogEntry>;
  /**
   * Study time that belongs to no single chapter — cumulative reviews mix
   * several. Counted in the course total, never in a chapter's own time.
   */
  otherStudyMs: number;
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
  // Defaulted so a chapter written before the timer existed still parses.
  studyMs: z.number().min(0).default(0),
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
  // Defaulted rather than required: entries written before this field existed
  // are still valid, and fill in again the next time the exercise is answered.
  grammarFocus: z.array(z.string()).default([]),
  hasBeenWrong: z.boolean().default(false),
});

export const dayLogEntrySchema = z.object({
  ms: z.number().min(0).default(0),
  chapters: z
    .record(
      z.string(),
      z.object({
        answers: z.number().int().min(0).default(0),
        ms: z.number().min(0).default(0),
      }),
    )
    .default({}),
});

export const persistedProgressV4Schema = z.object({
  schemaVersion: z.literal(PROGRESS_SCHEMA_VERSION),
  chapters: z.record(z.string(), chapterProgressSchema),
  exerciseHistory: z.record(z.string(), exerciseHistorySchema),
  answersByDay: z.record(z.string(), z.number().int().min(0)).default({}),
  dayLog: z.record(z.string(), dayLogEntrySchema).default({}),
  otherStudyMs: z.number().min(0).default(0),
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

export type PracticeMode = 'chapter' | 'review' | 'cumulative' | 'quick' | 'placement';

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
  mode: z.enum(['chapter', 'review', 'cumulative', 'quick', 'placement']),
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
  pronunciationAudio: boolean;
  /** Exercises to answer per day. `0` turns the goal off. */
  dailyGoal: number;
}

/** Offered in Settings; the goal is a count of exercises, not minutes. */
export const DAILY_GOAL_CHOICES = [0, 10, 20, 40, 60] as const;

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
  pronunciationAudio: z.boolean().catch(true),
  // `.catch` for the same reason as `theme`: a payload written before the goal
  // existed must not fail the parse and reset every other setting.
  dailyGoal: z.number().int().min(0).max(200).catch(20),
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
