import { create } from 'zustand';
import type { ChapterDefinition } from '../../schemas/chapterSchema';
import type {
  Exercise,
  SingleChoiceExercise,
  TextInputExercise,
} from '../../schemas/exerciseSchema';
import {
  SESSION_SCHEMA_VERSION,
  persistedSessionV1Schema,
  type AttemptOutcome,
  type ExerciseAttemptRecord,
  type PersistedSessionV1,
  type PracticeMode,
} from '../../schemas/progressSchema';
import { optionOrderFor, sortedExercises } from '../chapters/chapterUtils';
import { createJsonStore } from '../progress/progressPersistence';
import { useProgressStore } from '../progress/progressStore';
import {
  checkSingleChoiceAnswer,
  checkTextAnswer,
  primaryAcceptedAnswer,
} from './answerNormalization';
import {
  MAX_ATTEMPTS,
  outcomeForAttempt,
  scoreForOutcome,
  summarizeSession,
} from './scoring';
import type { SessionSummary } from './scoring';

export const SESSION_STORAGE_KEY = 'grammatik-mit-system:session';

const sessionStore = createJsonStore(SESSION_STORAGE_KEY, persistedSessionV1Schema);

export type PracticeStatus = 'idle' | 'active' | 'finished';

export type FeedbackKind = 'correct' | 'incorrect' | 'revealed';

export interface FeedbackState {
  exerciseId: string;
  kind: FeedbackKind;
  attempts: number;
  /** True when the learner may try the same exercise once more. */
  canRetry: boolean;
  submittedAnswer: string;
  /** Filled once the answer is resolved and may be shown to the learner. */
  expectedAnswer?: string;
  chosenOptionId?: string;
  /** Additional targeted note, e.g. about capitalisation. */
  note?: string;
}

export interface PracticeState {
  status: PracticeStatus;
  mode: PracticeMode;
  chapterNumber: number | null;
  exerciseIds: string[];
  optionOrder: Record<string, string[]>;
  currentIndex: number;
  results: Record<string, ExerciseAttemptRecord>;
  attempts: Record<string, number>;
  feedback: FeedbackState | null;
  startedAt: string | null;
  summary: SessionSummary | null;

  startSession: (
    chapter: ChapterDefinition,
    options?: { mode?: PracticeMode; exerciseIds?: string[]; shuffleOptions?: boolean },
  ) => void;
  resumeSession: (chapter: ChapterDefinition) => boolean;
  hasStoredSession: (chapterNumber: number) => boolean;
  submitSingleChoice: (exercise: SingleChoiceExercise, optionId: string) => FeedbackState;
  submitTextAnswer: (exercise: TextInputExercise, value: string) => FeedbackState;
  revealAnswer: (exercise: Exercise) => FeedbackState;
  goToNext: () => void;
  finish: (chapter: ChapterDefinition) => SessionSummary;
  /** Leaves the session but keeps it stored so it can be resumed. */
  pauseSession: () => void;
  /** Discards the session, including the stored copy. */
  exitSession: () => void;
}

function expectedAnswerFor(exercise: Exercise): string {
  return exercise.type === 'textInput'
    ? primaryAcceptedAnswer(exercise)
    : (exercise.options.find((option) => option.id === exercise.correctOptionId)?.text ??
        '');
}

export const usePracticeStore = create<PracticeState>()((set, get) => {
  const persistSession = () => {
    const state = get();
    if (state.status !== 'active' || state.chapterNumber === null) return;
    const session: PersistedSessionV1 = {
      schemaVersion: SESSION_SCHEMA_VERSION,
      chapterNumber: state.chapterNumber,
      mode: state.mode,
      exerciseIds: state.exerciseIds,
      optionOrder: state.optionOrder,
      currentIndex: state.currentIndex,
      results: state.results,
      startedAt: state.startedAt ?? new Date().toISOString(),
    };
    sessionStore.write(session);
  };

  /** Writes the final result of an exercise and reports it to the progress store. */
  const resolveExercise = (
    exercise: Exercise,
    outcome: AttemptOutcome,
    attempts: number,
    submittedAnswer: string,
  ) => {
    const previousAnswers = get().results[exercise.id]?.submittedAnswers ?? [];
    const record: ExerciseAttemptRecord = {
      exerciseId: exercise.id,
      type: exercise.type,
      attempts,
      outcome,
      score: scoreForOutcome(outcome),
      submittedAnswers: [...previousAnswers, submittedAnswer],
    };
    set((state) => ({ results: { ...state.results, [exercise.id]: record } }));
    useProgressStore.getState().recordAttempt({
      exerciseId: exercise.id,
      chapterNumber: exercise.chapterNumber,
      outcome,
    });
    persistSession();
  };

  const setFeedback = (feedback: FeedbackState): FeedbackState => {
    set({ feedback });
    return feedback;
  };

  return {
    status: 'idle',
    mode: 'chapter',
    chapterNumber: null,
    exerciseIds: [],
    optionOrder: {},
    currentIndex: 0,
    results: {},
    attempts: {},
    feedback: null,
    startedAt: null,
    summary: null,

    startSession: (chapter, options = {}) => {
      const ordered = sortedExercises(chapter);
      const exerciseIds =
        options.exerciseIds && options.exerciseIds.length > 0
          ? ordered
              .filter((exercise) => options.exerciseIds?.includes(exercise.id))
              .map((exercise) => exercise.id)
          : ordered.map((exercise) => exercise.id);

      const shuffleOptions = options.shuffleOptions ?? true;
      const optionOrder: Record<string, string[]> = {};
      for (const exercise of ordered) {
        if (exercise.type === 'singleChoice' && exerciseIds.includes(exercise.id)) {
          optionOrder[exercise.id] = optionOrderFor(exercise, shuffleOptions);
        }
      }

      set({
        status: 'active',
        mode: options.mode ?? 'chapter',
        chapterNumber: chapter.number,
        exerciseIds,
        optionOrder,
        currentIndex: 0,
        results: {},
        attempts: {},
        feedback: null,
        startedAt: new Date().toISOString(),
        summary: null,
      });
      persistSession();
    },

    hasStoredSession: (chapterNumber) => {
      const stored = sessionStore.read();
      return stored !== null && stored.chapterNumber === chapterNumber;
    },

    resumeSession: (chapter) => {
      const stored = sessionStore.read();
      if (!stored || stored.chapterNumber !== chapter.number) return false;

      const known = new Set(chapter.exercises.map((exercise) => exercise.id));
      const exerciseIds = stored.exerciseIds.filter((id) => known.has(id));
      if (exerciseIds.length === 0) return false;

      set({
        status: 'active',
        mode: stored.mode,
        chapterNumber: stored.chapterNumber,
        exerciseIds,
        optionOrder: stored.optionOrder,
        currentIndex: Math.min(stored.currentIndex, exerciseIds.length - 1),
        results: stored.results,
        attempts: {},
        feedback: null,
        startedAt: stored.startedAt,
        summary: null,
      });
      return true;
    },

    submitSingleChoice: (exercise, optionId) => {
      const attempts = (get().attempts[exercise.id] ?? 0) + 1;
      set((state) => ({ attempts: { ...state.attempts, [exercise.id]: attempts } }));

      const correct = checkSingleChoiceAnswer(exercise, optionId);
      const chosenText =
        exercise.options.find((option) => option.id === optionId)?.text ?? '';

      if (correct) {
        const outcome = outcomeForAttempt(attempts, true);
        resolveExercise(exercise, outcome, attempts, chosenText);
        return setFeedback({
          exerciseId: exercise.id,
          kind: 'correct',
          attempts,
          canRetry: false,
          submittedAnswer: chosenText,
          chosenOptionId: optionId,
          expectedAnswer: expectedAnswerFor(exercise),
        });
      }

      const canRetry = attempts < MAX_ATTEMPTS;
      if (!canRetry) {
        resolveExercise(exercise, 'incorrect', attempts, chosenText);
      }
      return setFeedback({
        exerciseId: exercise.id,
        kind: 'incorrect',
        attempts,
        canRetry,
        submittedAnswer: chosenText,
        chosenOptionId: optionId,
        ...(canRetry ? {} : { expectedAnswer: expectedAnswerFor(exercise) }),
      });
    },

    submitTextAnswer: (exercise, value) => {
      const attempts = (get().attempts[exercise.id] ?? 0) + 1;
      set((state) => ({ attempts: { ...state.attempts, [exercise.id]: attempts } }));

      const check = checkTextAnswer(exercise, value);

      if (check.correct) {
        const outcome = outcomeForAttempt(attempts, true);
        resolveExercise(exercise, outcome, attempts, value);
        return setFeedback({
          exerciseId: exercise.id,
          kind: 'correct',
          attempts,
          canRetry: false,
          submittedAnswer: value,
          expectedAnswer: expectedAnswerFor(exercise),
        });
      }

      const canRetry = attempts < MAX_ATTEMPTS;
      if (!canRetry) {
        resolveExercise(exercise, 'incorrect', attempts, value);
      }

      const note = check.capitalisationOnlyMismatch
        ? 'Only the capitalisation is different — in German it is part of the grammar.'
        : check.missingTokens.length > 0
          ? `Your answer is missing: ${check.missingTokens.join(', ')}.`
          : undefined;

      return setFeedback({
        exerciseId: exercise.id,
        kind: 'incorrect',
        attempts,
        canRetry,
        submittedAnswer: value,
        ...(note ? { note } : {}),
        // The expected answer is shown after the second incorrect attempt.
        ...(canRetry ? {} : { expectedAnswer: expectedAnswerFor(exercise) }),
      });
    },

    revealAnswer: (exercise) => {
      const attempts = get().attempts[exercise.id] ?? 0;
      const submitted = get().feedback?.submittedAnswer ?? '';
      resolveExercise(exercise, 'revealed', attempts, submitted);
      return setFeedback({
        exerciseId: exercise.id,
        kind: 'revealed',
        attempts,
        canRetry: false,
        submittedAnswer: submitted,
        expectedAnswer: expectedAnswerFor(exercise),
      });
    },

    goToNext: () => {
      const { currentIndex, exerciseIds } = get();
      const nextIndex = Math.min(currentIndex + 1, exerciseIds.length - 1);
      set({ currentIndex: nextIndex, feedback: null });
      persistSession();
    },

    finish: (chapter) => {
      const state = get();
      const records = state.exerciseIds
        .map((id) => state.results[id])
        .filter((record): record is ExerciseAttemptRecord => record !== undefined);
      const summary = summarizeSession(records, state.exerciseIds.length);

      useProgressStore.getState().recordSessionResult({
        chapterNumber: chapter.number,
        summary,
        mastery: chapter.mastery,
      });

      sessionStore.clear();
      set({ status: 'finished', summary, feedback: null });
      return summary;
    },

    pauseSession: () => {
      persistSession();
      set({ status: 'idle', feedback: null });
    },

    exitSession: () => {
      sessionStore.clear();
      set({
        status: 'idle',
        chapterNumber: null,
        exerciseIds: [],
        optionOrder: {},
        currentIndex: 0,
        results: {},
        attempts: {},
        feedback: null,
        startedAt: null,
      });
    },
  };
});

/* ------------------------------------------------------------------ */
/* Selectors                                                           */
/* ------------------------------------------------------------------ */

export function selectCurrentExerciseId(state: PracticeState): string | undefined {
  return state.exerciseIds[state.currentIndex];
}

export function selectIsResolved(state: PracticeState, exerciseId: string): boolean {
  return state.results[exerciseId] !== undefined;
}

export function selectAnsweredCount(state: PracticeState): number {
  return Object.keys(state.results).length;
}

export function selectIsLastExercise(state: PracticeState): boolean {
  return state.currentIndex >= state.exerciseIds.length - 1;
}

export function selectSessionRecords(state: PracticeState): ExerciseAttemptRecord[] {
  return state.exerciseIds
    .map((id) => state.results[id])
    .filter((record): record is ExerciseAttemptRecord => record !== undefined);
}
