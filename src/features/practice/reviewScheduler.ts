import type {
  AttemptOutcome,
  ExerciseHistory,
  ReviewStage,
} from '../../schemas/progressSchema';
import { isCorrectOutcome } from './scoring';

/**
 * Spaced-repetition scheduling for exercises the learner got wrong.
 *
 * Intervals follow the course specification:
 *  - first wrong answer  → review tomorrow (1 day)
 *  - wrong again         → review in 1 day
 *  - correct once        → review in 3 days
 *  - correct twice       → review in 7 days
 *  - correct three times → stable, no further review
 */
export const REVIEW_INTERVAL_DAYS = {
  wrong: 1,
  firstCorrect: 3,
  secondCorrect: 7,
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

function intervalFor(consecutiveCorrect: number): number | null {
  if (consecutiveCorrect <= 0) return REVIEW_INTERVAL_DAYS.wrong;
  if (consecutiveCorrect === 1) return REVIEW_INTERVAL_DAYS.firstCorrect;
  if (consecutiveCorrect === 2) return REVIEW_INTERVAL_DAYS.secondCorrect;
  return null; // stable
}

export function createHistory(
  exerciseId: string,
  chapterNumber: number,
): ExerciseHistory {
  return {
    exerciseId,
    chapterNumber,
    timesAnswered: 0,
    timesCorrect: 0,
    timesIncorrect: 0,
    consecutiveCorrect: 0,
    stage: 'learning',
  };
}

export interface ScheduleInput {
  exerciseId: string;
  chapterNumber: number;
  outcome: AttemptOutcome;
  now: Date;
  previous?: ExerciseHistory;
}

/**
 * Returns the updated history for an exercise after an answer.
 *
 * An exercise that has never been answered incorrectly and is answered
 * correctly on the first attempt does not enter the review queue at all.
 */
export function scheduleNextReview({
  exerciseId,
  chapterNumber,
  outcome,
  now,
  previous,
}: ScheduleInput): ExerciseHistory {
  const history = previous ?? createHistory(exerciseId, chapterNumber);
  const correct = isCorrectOutcome(outcome);

  const consecutiveCorrect = correct ? history.consecutiveCorrect + 1 : 0;
  // An exercise enters the queue as soon as the learner has answered it
  // wrongly at least once — including a first attempt that failed inside the
  // session that was then corrected on the second attempt.
  const enteredQueue =
    history.timesIncorrect > 0 || !correct || outcome === 'correctSecondAttempt';

  const next: ExerciseHistory = {
    ...history,
    exerciseId,
    chapterNumber,
    timesAnswered: history.timesAnswered + 1,
    timesCorrect: history.timesCorrect + (correct ? 1 : 0),
    timesIncorrect: history.timesIncorrect + (correct ? 0 : 1),
    consecutiveCorrect,
    stage: enteredQueue ? stageFor(consecutiveCorrect) : 'stable',
    lastOutcome: outcome,
    lastAnsweredAt: now.toISOString(),
  };

  if (!enteredQueue) {
    delete next.dueAt;
    return next;
  }

  const days = intervalFor(consecutiveCorrect);
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

/** Number of exercises of a chapter that are currently flagged for review. */
export function countOpenReviewFlags(
  histories: readonly ExerciseHistory[],
  chapterNumber: number,
): number {
  return histories.filter(
    (history) => history.chapterNumber === chapterNumber && history.dueAt !== undefined,
  ).length;
}
