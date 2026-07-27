import type { MasteryRule } from '../../schemas/chapterSchema';
import type { Exercise } from '../../schemas/exerciseSchema';
import type { AttemptOutcome, ExerciseAttemptRecord } from '../../schemas/progressSchema';

export const MAX_ATTEMPTS = 2;

export const SCORE_BY_OUTCOME: Record<AttemptOutcome, number> = {
  correctFirstAttempt: 1,
  correctSecondAttempt: 0.5,
  incorrect: 0,
  revealed: 0,
};

export function scoreForOutcome(outcome: AttemptOutcome): number {
  return SCORE_BY_OUTCOME[outcome];
}

export function isCorrectOutcome(outcome: AttemptOutcome): boolean {
  return outcome === 'correctFirstAttempt' || outcome === 'correctSecondAttempt';
}

/**
 * Determines the outcome of an exercise from the attempt that was just made.
 *
 * @param attemptNumber 1 for the first submission, 2 for the second.
 */
export function outcomeForAttempt(
  attemptNumber: number,
  correct: boolean,
): AttemptOutcome {
  if (correct) {
    return attemptNumber <= 1 ? 'correctFirstAttempt' : 'correctSecondAttempt';
  }
  return 'incorrect';
}

export interface SessionSummary {
  totalExercises: number;
  answeredCount: number;
  rawScore: number;
  maxScore: number;
  scorePercent: number;
  firstAttemptCorrect: number;
  firstAttemptAccuracy: number;
  correctCount: number;
  correctTextInputs: number;
  correctSingleChoice: number;
  incorrectExerciseIds: string[];
}

/**
 * Aggregates a practice session.
 *
 * `scorePercent` is the weighted score (1 / 0.5 / 0 points) over *all* exercises
 * in the session, so unanswered exercises count as zero.
 * `firstAttemptAccuracy` is measured over answered exercises only.
 */
export function summarizeSession(
  records: readonly ExerciseAttemptRecord[],
  totalExercises: number,
): SessionSummary {
  const answeredCount = records.length;
  const rawScore = records.reduce((total, record) => total + record.score, 0);
  const maxScore = totalExercises;
  const firstAttemptCorrect = records.filter(
    (record) => record.outcome === 'correctFirstAttempt',
  ).length;
  const correct = records.filter((record) => isCorrectOutcome(record.outcome));

  return {
    totalExercises,
    answeredCount,
    rawScore,
    maxScore,
    scorePercent: maxScore === 0 ? 0 : round((rawScore / maxScore) * 100),
    firstAttemptCorrect,
    firstAttemptAccuracy:
      answeredCount === 0 ? 0 : round((firstAttemptCorrect / answeredCount) * 100),
    correctCount: correct.length,
    correctTextInputs: correct.filter((record) => record.type === 'textInput').length,
    correctSingleChoice: correct.filter((record) => record.type === 'singleChoice')
      .length,
    incorrectExerciseIds: records
      .filter((record) => !isCorrectOutcome(record.outcome))
      .map((record) => record.exerciseId),
  };
}

export interface MasteryEvaluation {
  mastered: boolean;
  /** Human-readable reasons why mastery was not reached (empty when mastered). */
  unmetRequirements: string[];
}

export const DEFAULT_MAX_OPEN_REVIEW_FLAGS = 3;

/**
 * Applies the chapter mastery rule to a finished session.
 *
 * @param openReviewFlags exercises of this chapter that are still due for review.
 */
export function evaluateMastery(
  summary: SessionSummary,
  rule: MasteryRule,
  openReviewFlags = 0,
): MasteryEvaluation {
  const unmetRequirements: string[] = [];

  if (summary.scorePercent < rule.passingPercent) {
    unmetRequirements.push(
      `Score ${summary.scorePercent}% is below the required ${rule.passingPercent}%.`,
    );
  }
  if (summary.answeredCount < rule.minimumAnswered) {
    unmetRequirements.push(
      `${summary.answeredCount} of ${rule.minimumAnswered} required exercises answered.`,
    );
  }
  const requiredTextInputs = rule.requiredCorrectTextInputs ?? 0;
  if (summary.correctTextInputs < requiredTextInputs) {
    unmetRequirements.push(
      `${summary.correctTextInputs} of ${requiredTextInputs} required text-input exercises correct.`,
    );
  }
  const maxFlags = rule.maxOpenReviewFlags ?? DEFAULT_MAX_OPEN_REVIEW_FLAGS;
  if (openReviewFlags > maxFlags) {
    unmetRequirements.push(
      `${openReviewFlags} exercises are still flagged for review (maximum ${maxFlags}).`,
    );
  }

  return { mastered: unmetRequirements.length === 0, unmetRequirements };
}

export function exerciseTypeOf(exercise: Exercise): ExerciseAttemptRecord['type'] {
  return exercise.type;
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}
