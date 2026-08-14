import type {
  AttemptOutcome,
  ExerciseHistory,
  ReviewStage,
} from '../../schemas/progressSchema';
import { isCorrectOutcome } from './scoring';

/**
 * Spaced repetition on two ladders, chosen by whether the exercise has ever
 * been answered wrongly.
 *
 * Remedial — anything the learner has got wrong, on the course specification's
 * intervals:
 *  - wrong answer        → review tomorrow (1 day)
 *  - correct once        → review in 3 days
 *  - correct twice       → review in 7 days
 *  - correct three times → stable, no further review
 *
 * Retention — material answered correctly first time, every time. It used to
 * leave the queue immediately and never return, so anything learned cleanly
 * quietly faded. It now comes back, but on a much longer ladder so the queue
 * stays a short list rather than the whole course:
 *  - correct once        → review in 7 days
 *  - correct twice       → review in 21 days
 *  - correct three times → stable, no further review
 *
 * Only remedial exercises count towards a chapter's `maxOpenReviewFlags`;
 * retention scheduling must never make mastery unreachable.
 */
export const REVIEW_INTERVAL_DAYS = {
  wrong: 1,
  firstCorrect: 3,
  secondCorrect: 7,
} as const;

export const RETENTION_INTERVAL_DAYS = {
  firstCorrect: 7,
  secondCorrect: 21,
} as const;

export const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function addDays(from: Date, days: number): Date {
  return new Date(from.getTime() + days * DAY_IN_MS);
}

function stageFor(consecutiveCorrect: number): ReviewStage {
  if (consecutiveCorrect <= 0) return 'learning';
  if (consecutiveCorrect === 1) return 'review1';
  if (consecutiveCorrect === 2) return 'review2';
  return 'stable';
}

function intervalFor(consecutiveCorrect: number, hasBeenWrong: boolean): number | null {
  if (!hasBeenWrong) {
    // A clean exercise is only ever here after a correct answer.
    if (consecutiveCorrect === 1) return RETENTION_INTERVAL_DAYS.firstCorrect;
    if (consecutiveCorrect === 2) return RETENTION_INTERVAL_DAYS.secondCorrect;
    return null; // stable
  }
  if (consecutiveCorrect <= 0) return REVIEW_INTERVAL_DAYS.wrong;
  if (consecutiveCorrect === 1) return REVIEW_INTERVAL_DAYS.firstCorrect;
  if (consecutiveCorrect === 2) return REVIEW_INTERVAL_DAYS.secondCorrect;
  return null; // stable
}

export function createHistory(
  exerciseId: string,
  chapterNumber: number,
  grammarFocus: readonly string[] = [],
): ExerciseHistory {
  return {
    exerciseId,
    chapterNumber,
    timesAnswered: 0,
    timesCorrect: 0,
    timesIncorrect: 0,
    consecutiveCorrect: 0,
    stage: 'learning',
    grammarFocus: [...grammarFocus],
    hasBeenWrong: false,
  };
}

export interface ScheduleInput {
  exerciseId: string;
  chapterNumber: number;
  outcome: AttemptOutcome;
  now: Date;
  previous?: ExerciseHistory;
  /** The exercise's grammar tags, stored so progress can be summarised by topic. */
  grammarFocus?: readonly string[];
}

/**
 * Returns the updated history for an exercise after an answer. Every answered
 * exercise is scheduled; which ladder it lands on depends on whether it has
 * ever been wrong.
 */
export function scheduleNextReview({
  exerciseId,
  chapterNumber,
  outcome,
  now,
  previous,
  grammarFocus,
}: ScheduleInput): ExerciseHistory {
  const history = previous ?? createHistory(exerciseId, chapterNumber, grammarFocus);
  const correct = isCorrectOutcome(outcome);

  const consecutiveCorrect = correct ? history.consecutiveCorrect + 1 : 0;
  // Sticky: once an exercise has been answered wrongly it stays on the fast
  // ladder for good. `correctSecondAttempt` counts — the first attempt failed,
  // which `timesIncorrect` does not record.
  const hasBeenWrong =
    history.hasBeenWrong || !correct || outcome === 'correctSecondAttempt';

  const next: ExerciseHistory = {
    ...history,
    exerciseId,
    chapterNumber,
    timesAnswered: history.timesAnswered + 1,
    timesCorrect: history.timesCorrect + (correct ? 1 : 0),
    timesIncorrect: history.timesIncorrect + (correct ? 0 : 1),
    consecutiveCorrect,
    hasBeenWrong,
    stage: stageFor(consecutiveCorrect),
    lastOutcome: outcome,
    lastAnsweredAt: now.toISOString(),
    // Refreshed on every answer, so entries carried over from a version that
    // did not store tags fill in as the learner works through them again.
    grammarFocus: grammarFocus ? [...grammarFocus] : history.grammarFocus,
  };

  const days = intervalFor(consecutiveCorrect, hasBeenWrong);
  if (days === null) {
    delete next.dueAt;
    return next;
  }

  next.dueAt = addDays(now, days).toISOString();
  return next;
}

export function isStable(history: ExerciseHistory): boolean {
  return history.stage === 'stable';
}

export function isDue(history: ExerciseHistory, now: Date): boolean {
  if (history.dueAt === undefined) return false;
  return new Date(history.dueAt).getTime() <= now.getTime();
}

/** Exercises that are in the queue but not due yet. */
export function isPending(history: ExerciseHistory, now: Date): boolean {
  return history.dueAt !== undefined && !isDue(history, now);
}

/**
 * Due exercises, oldest due date first, but interleaved across chapters so a
 * review session mixes topics instead of replaying one chapter.
 */
export function selectDueExercises(
  histories: readonly ExerciseHistory[],
  now: Date,
  limit?: number,
): ExerciseHistory[] {
  const due = histories
    .filter((history) => isDue(history, now))
    .sort((a, b) => (a.dueAt ?? '').localeCompare(b.dueAt ?? ''));

  const byChapter = new Map<number, ExerciseHistory[]>();
  for (const history of due) {
    const bucket = byChapter.get(history.chapterNumber);
    if (bucket) {
      bucket.push(history);
    } else {
      byChapter.set(history.chapterNumber, [history]);
    }
  }

  const buckets = [...byChapter.values()];
  const mixed: ExerciseHistory[] = [];
  let index = 0;
  while (mixed.length < due.length) {
    let pushedInRound = false;
    for (const bucket of buckets) {
      const item = bucket[index];
      if (item) {
        mixed.push(item);
        pushedInRound = true;
      }
    }
    if (!pushedInRound) break;
    index += 1;
  }

  return limit === undefined ? mixed : mixed.slice(0, limit);
}

/**
 * Number of exercises of a chapter still flagged as unresolved mistakes.
 *
 * Only counts the remedial ladder. Retention reviews are scheduled for
 * everything the learner answers, so counting them here would push every
 * chapter past its `maxOpenReviewFlags` and make mastery unreachable.
 */
export function countOpenReviewFlags(
  histories: readonly ExerciseHistory[],
  chapterNumber: number,
): number {
  return histories.filter(
    (history) =>
      history.chapterNumber === chapterNumber &&
      history.dueAt !== undefined &&
      history.hasBeenWrong,
  ).length;
}
