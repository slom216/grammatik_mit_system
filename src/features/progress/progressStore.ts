import { create } from 'zustand';
import type { MasteryRule } from '../../schemas/chapterSchema';
import type {
  AttemptOutcome,
  ChapterProgress,
  ChapterStatus,
  DayLogEntry,
  ExerciseHistory,
  PersistedProgressV4,
} from '../../schemas/progressSchema';
import { PROGRESS_SCHEMA_VERSION } from '../../schemas/progressSchema';
import {
  countOpenReviewFlags,
  scheduleNextReview,
  selectDueExercises,
} from '../practice/reviewScheduler';
import { evaluateMastery, type SessionSummary } from '../practice/scoring';
import { toDayKey } from './dayKey';
import {
  clearProgress,
  createEmptyProgress,
  loadProgress,
  saveProgress,
} from './progressPersistence';

export interface RecordAttemptInput {
  exerciseId: string;
  chapterNumber: number;
  outcome: AttemptOutcome;
  now?: Date;
  /** The exercise's grammar tags, kept on the history entry for topic summaries. */
  grammarFocus?: readonly string[];
}

export interface RecordSessionInput {
  chapterNumber: number;
  summary: SessionSummary;
  mastery: MasteryRule;
  now?: Date;
}

export interface ProgressState {
  chapters: Record<number, ChapterProgress>;
  exerciseHistory: Record<string, ExerciseHistory>;
  /** Exercises answered per local day, `YYYY-MM-DD` → count. */
  answersByDay: Record<string, number>;
  /** Time and chapters per local day, `YYYY-MM-DD` → entry. */
  dayLog: Record<string, DayLogEntry>;
  /** Practice time not tied to one chapter (cumulative reviews). */
  otherStudyMs: number;
  lastOpenedChapter?: number;
  hydrated: boolean;
  /** True when stored progress could not be read and was reset on load. */
  recovered: boolean;

  hydrate: () => void;
  acknowledgeRecovery: () => void;
  recordAttempt: (input: RecordAttemptInput) => void;
  /** Adds practice time; `null` for a session spanning several chapters. */
  addStudyTime: (chapterNumber: number | null, ms: number, now?: Date) => void;
  recordSessionResult: (input: RecordSessionInput) => { mastered: boolean };
  setLastOpenedChapter: (chapterNumber: number) => void;
  toggleBookmark: (chapterNumber: number) => void;
  resetProgress: () => void;
  replaceProgress: (state: PersistedProgressV4) => void;
  snapshot: () => PersistedProgressV4;
}

export function createChapterProgress(chapterNumber: number): ChapterProgress {
  return {
    chapterNumber,
    status: 'notStarted',
    bestScorePercent: 0,
    latestScorePercent: 0,
    firstAttemptAccuracy: 0,
    answeredCount: 0,
    correctTextInputs: 0,
    attempts: 0,
    bookmarked: false,
    studyMs: 0,
  };
}

/**
 * Adds a day's work to the log, without mutating what is already stored. Both
 * counters are optional: answering an exercise adds one answer, the timer adds
 * milliseconds, and a cumulative review has no chapter to credit — its time
 * lands on the day total only.
 */
function bumpDay(
  dayLog: Record<string, DayLogEntry>,
  day: string,
  chapterNumber: number | null,
  work: { answers?: number; ms?: number },
): Record<string, DayLogEntry> {
  const entry = dayLog[day] ?? { ms: 0, chapters: {} };
  const next: DayLogEntry = {
    ms: entry.ms + (work.ms ?? 0),
    chapters: entry.chapters,
  };
  if (chapterNumber !== null) {
    const previous = entry.chapters[chapterNumber] ?? { answers: 0, ms: 0 };
    next.chapters = {
      ...entry.chapters,
      [chapterNumber]: {
        answers: previous.answers + (work.answers ?? 0),
        ms: previous.ms + (work.ms ?? 0),
      },
    };
  }
  return { ...dayLog, [day]: next };
}

function toPersisted(state: {
  chapters: Record<number, ChapterProgress>;
  exerciseHistory: Record<string, ExerciseHistory>;
  answersByDay: Record<string, number>;
  dayLog: Record<string, DayLogEntry>;
  otherStudyMs: number;
  lastOpenedChapter?: number;
}): PersistedProgressV4 {
  const persisted: PersistedProgressV4 = {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    chapters: state.chapters,
    exerciseHistory: state.exerciseHistory,
    answersByDay: state.answersByDay,
    dayLog: state.dayLog,
    otherStudyMs: state.otherStudyMs,
  };
  if (state.lastOpenedChapter !== undefined) {
    persisted.lastOpenedChapter = state.lastOpenedChapter;
  }
  return persisted;
}

export const useProgressStore = create<ProgressState>()((set, get) => {
  const persist = () => {
    saveProgress(toPersisted(get()));
  };

  return {
    ...createEmptyProgress(),
    hydrated: false,
    recovered: false,

    hydrate: () => {
      const { state, recovered } = loadProgress();
      set({
        chapters: state.chapters,
        exerciseHistory: state.exerciseHistory,
        answersByDay: state.answersByDay,
        dayLog: state.dayLog,
        otherStudyMs: state.otherStudyMs,
        lastOpenedChapter: state.lastOpenedChapter,
        hydrated: true,
        recovered,
      });
    },

    acknowledgeRecovery: () => set({ recovered: false }),

    recordAttempt: ({
      exerciseId,
      chapterNumber,
      outcome,
      now = new Date(),
      grammarFocus,
    }) => {
      const previous = get().exerciseHistory[exerciseId];
      const history = scheduleNextReview({
        exerciseId,
        chapterNumber,
        outcome,
        now,
        ...(previous ? { previous } : {}),
        ...(grammarFocus ? { grammarFocus } : {}),
      });

      const chapter =
        get().chapters[chapterNumber] ?? createChapterProgress(chapterNumber);
      const status: ChapterStatus =
        chapter.status === 'notStarted' ? 'inProgress' : chapter.status;

      const day = toDayKey(now);
      set((state) => ({
        exerciseHistory: { ...state.exerciseHistory, [exerciseId]: history },
        answersByDay: {
          ...state.answersByDay,
          [day]: (state.answersByDay[day] ?? 0) + 1,
        },
        dayLog: bumpDay(state.dayLog, day, chapterNumber, { answers: 1 }),
        chapters: {
          ...state.chapters,
          [chapterNumber]: { ...chapter, status, lastPracticedAt: now.toISOString() },
        },
      }));
      persist();
    },

    addStudyTime: (chapterNumber, ms, now = new Date()) => {
      if (!Number.isFinite(ms) || ms <= 0) return;
      // ponytail: a flush that straddles local midnight credits the whole chunk
      // to the day it lands on. Bounded by the timer's 15 s flush interval —
      // split the chunk at midnight only if that ever matters.
      const day = toDayKey(now);
      if (chapterNumber === null) {
        set((state) => ({
          otherStudyMs: state.otherStudyMs + ms,
          dayLog: bumpDay(state.dayLog, day, null, { ms }),
        }));
      } else {
        const chapter =
          get().chapters[chapterNumber] ?? createChapterProgress(chapterNumber);
        set((state) => ({
          chapters: {
            ...state.chapters,
            [chapterNumber]: { ...chapter, studyMs: chapter.studyMs + ms },
          },
          dayLog: bumpDay(state.dayLog, day, chapterNumber, { ms }),
        }));
      }
      persist();
    },

    recordSessionResult: ({ chapterNumber, summary, mastery, now = new Date() }) => {
      const previous =
        get().chapters[chapterNumber] ?? createChapterProgress(chapterNumber);
      const openFlags = countOpenReviewFlags(
        Object.values(get().exerciseHistory),
        chapterNumber,
      );
      const evaluation = evaluateMastery(summary, mastery, openFlags);
      const completed = summary.answeredCount >= mastery.minimumAnswered;

      const status: ChapterStatus = evaluation.mastered
        ? 'mastered'
        : completed
          ? 'completed'
          : 'inProgress';

      const next: ChapterProgress = {
        ...previous,
        chapterNumber,
        status: previous.status === 'mastered' ? 'mastered' : status,
        bestScorePercent: Math.max(previous.bestScorePercent, summary.scorePercent),
        latestScorePercent: summary.scorePercent,
        firstAttemptAccuracy: summary.firstAttemptAccuracy,
        answeredCount: summary.answeredCount,
        correctTextInputs: summary.correctTextInputs,
        attempts: previous.attempts + 1,
        lastPracticedAt: now.toISOString(),
      };
      if (completed && next.completedAt === undefined) {
        next.completedAt = now.toISOString();
      }

      set((state) => ({ chapters: { ...state.chapters, [chapterNumber]: next } }));
      persist();
      return { mastered: evaluation.mastered };
    },

    setLastOpenedChapter: (chapterNumber) => {
      set({ lastOpenedChapter: chapterNumber });
      persist();
    },

    toggleBookmark: (chapterNumber) => {
      const chapter =
        get().chapters[chapterNumber] ?? createChapterProgress(chapterNumber);
      set((state) => ({
        chapters: {
          ...state.chapters,
          [chapterNumber]: { ...chapter, bookmarked: !chapter.bookmarked },
        },
      }));
      persist();
    },

    resetProgress: () => {
      clearProgress();
      set({ ...createEmptyProgress(), lastOpenedChapter: undefined, hydrated: true });
    },

    replaceProgress: (state) => {
      set({
        chapters: state.chapters,
        exerciseHistory: state.exerciseHistory,
        answersByDay: state.answersByDay,
        dayLog: state.dayLog,
        otherStudyMs: state.otherStudyMs,
        lastOpenedChapter: state.lastOpenedChapter,
        hydrated: true,
      });
      persist();
    },

    snapshot: () => toPersisted(get()),
  };
});

/* ------------------------------------------------------------------ */
/* Selectors                                                           */
/* ------------------------------------------------------------------ */

export function selectChapterProgress(
  state: ProgressState,
  chapterNumber: number,
): ChapterProgress {
  return state.chapters[chapterNumber] ?? createChapterProgress(chapterNumber);
}

export function selectDueHistories(
  state: ProgressState,
  now: Date = new Date(),
  limit?: number,
): ExerciseHistory[] {
  return selectDueExercises(Object.values(state.exerciseHistory), now, limit);
}

/**
 * The exercises of one chapter the learner has already answered correctly at
 * least once — the chapter's cumulative coverage.
 *
 * `timesCorrect` counts both `correctFirstAttempt` and `correctSecondAttempt`
 * and only ever grows, so coverage never goes backwards. An exercise that was
 * revealed or is still being failed stays outside the set, and so keeps its
 * place at the front of the next session.
 */
export function selectCoveredExerciseIds(
  exerciseHistory: Record<string, ExerciseHistory>,
  chapterNumber: number,
): Set<string> {
  const covered = new Set<string>();
  for (const history of Object.values(exerciseHistory)) {
    if (history.chapterNumber === chapterNumber && history.timesCorrect > 0) {
      covered.add(history.exerciseId);
    }
  }
  return covered;
}

export function selectMasteredChapterNumbers(state: ProgressState): number[] {
  return Object.values(state.chapters)
    .filter((chapter) => chapter.status === 'mastered')
    .map((chapter) => chapter.chapterNumber);
}

export function selectRecentlyCompleted(
  state: ProgressState,
  limit = 3,
): ChapterProgress[] {
  return Object.values(state.chapters)
    .filter((chapter) => chapter.completedAt !== undefined)
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
    .slice(0, limit);
}
