import { create } from 'zustand';
import type { MasteryRule } from '../../schemas/chapterSchema';
import type {
  AttemptOutcome,
  ChapterProgress,
  ChapterStatus,
  ExerciseHistory,
  PersistedProgressV1,
} from '../../schemas/progressSchema';
import { PROGRESS_SCHEMA_VERSION } from '../../schemas/progressSchema';
import {
  countOpenReviewFlags,
  scheduleNextReview,
  selectDueExercises,
} from '../practice/reviewScheduler';
import { evaluateMastery, type SessionSummary } from '../practice/scoring';
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
  lastOpenedChapter?: number;
  hydrated: boolean;

  hydrate: () => void;
  recordAttempt: (input: RecordAttemptInput) => void;
  recordSessionResult: (input: RecordSessionInput) => { mastered: boolean };
  setLastOpenedChapter: (chapterNumber: number) => void;
  toggleBookmark: (chapterNumber: number) => void;
  resetProgress: () => void;
  replaceProgress: (state: PersistedProgressV1) => void;
  snapshot: () => PersistedProgressV1;
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
  };
}

function toPersisted(state: {
  chapters: Record<number, ChapterProgress>;
  exerciseHistory: Record<string, ExerciseHistory>;
  lastOpenedChapter?: number;
}): PersistedProgressV1 {
  const persisted: PersistedProgressV1 = {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    chapters: state.chapters,
    exerciseHistory: state.exerciseHistory,
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

    hydrate: () => {
      const { state } = loadProgress();
      set({
        chapters: state.chapters,
        exerciseHistory: state.exerciseHistory,
        lastOpenedChapter: state.lastOpenedChapter,
        hydrated: true,
      });
    },

    recordAttempt: ({ exerciseId, chapterNumber, outcome, now = new Date() }) => {
      const previous = get().exerciseHistory[exerciseId];
      const history = scheduleNextReview({
        exerciseId,
        chapterNumber,
        outcome,
        now,
        ...(previous ? { previous } : {}),
      });

      const chapter =
        get().chapters[chapterNumber] ?? createChapterProgress(chapterNumber);
      const status: ChapterStatus =
        chapter.status === 'notStarted' ? 'inProgress' : chapter.status;

      set((state) => ({
        exerciseHistory: { ...state.exerciseHistory, [exerciseId]: history },
        chapters: {
          ...state.chapters,
          [chapterNumber]: { ...chapter, status, lastPracticedAt: now.toISOString() },
        },
      }));
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
