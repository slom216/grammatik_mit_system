import { describe, expect, it } from 'vitest';
import {
  evaluateMastery,
  isCorrectOutcome,
  outcomeForAttempt,
  scoreForOutcome,
  summarizeSession,
} from './scoring';
import type { ExerciseAttemptRecord } from '../../schemas/progressSchema';
import type { MasteryRule } from '../../schemas/chapterSchema';

function record(
  overrides: Partial<ExerciseAttemptRecord> & Pick<ExerciseAttemptRecord, 'exerciseId'>,
): ExerciseAttemptRecord {
  const outcome = overrides.outcome ?? 'correctFirstAttempt';
  return {
    type: 'singleChoice',
    attempts: 1,
    outcome,
    score: scoreForOutcome(outcome),
    submittedAnswers: [],
    ...overrides,
  };
}

const rule: MasteryRule = {
  passingPercent: 80,
  minimumAnswered: 24,
  requiredCorrectTextInputs: 8,
  maxOpenReviewFlags: 3,
};

describe('scoreForOutcome', () => {
  it('gives 1 point for a correct first attempt', () => {
    expect(scoreForOutcome('correctFirstAttempt')).toBe(1);
  });

  it('gives 0.5 points for a correct second attempt', () => {
    expect(scoreForOutcome('correctSecondAttempt')).toBe(0.5);
  });

  it('gives no points for an incorrect or revealed answer', () => {
    expect(scoreForOutcome('incorrect')).toBe(0);
    expect(scoreForOutcome('revealed')).toBe(0);
  });
});

describe('outcomeForAttempt', () => {
  it('distinguishes first and second attempt successes', () => {
    expect(outcomeForAttempt(1, true)).toBe('correctFirstAttempt');
    expect(outcomeForAttempt(2, true)).toBe('correctSecondAttempt');
    expect(outcomeForAttempt(2, false)).toBe('incorrect');
  });

  it('treats both correct outcomes as correct', () => {
    expect(isCorrectOutcome('correctFirstAttempt')).toBe(true);
    expect(isCorrectOutcome('correctSecondAttempt')).toBe(true);
    expect(isCorrectOutcome('revealed')).toBe(false);
  });
});

describe('summarizeSession', () => {
  it('stores both the raw score and the first-attempt accuracy', () => {
    const records = [
      record({ exerciseId: 'a' }),
      record({ exerciseId: 'b', outcome: 'correctSecondAttempt', attempts: 2 }),
      record({ exerciseId: 'c', outcome: 'incorrect', attempts: 2 }),
      record({ exerciseId: 'd', type: 'textInput' }),
    ];

    const summary = summarizeSession(records, 4);

    expect(summary.rawScore).toBe(2.5);
    expect(summary.maxScore).toBe(4);
    expect(summary.scorePercent).toBe(62.5);
    expect(summary.firstAttemptCorrect).toBe(2);
    expect(summary.firstAttemptAccuracy).toBe(50);
    expect(summary.correctTextInputs).toBe(1);
    expect(summary.correctSingleChoice).toBe(2);
    expect(summary.incorrectExerciseIds).toEqual(['c']);
  });

  it('counts unanswered exercises as zero points', () => {
    const summary = summarizeSession([record({ exerciseId: 'a' })], 4);
    expect(summary.answeredCount).toBe(1);
    expect(summary.scorePercent).toBe(25);
    expect(summary.firstAttemptAccuracy).toBe(100);
  });

  it('handles an empty session', () => {
    const summary = summarizeSession([], 0);
    expect(summary.scorePercent).toBe(0);
    expect(summary.firstAttemptAccuracy).toBe(0);
  });
});

describe('evaluateMastery', () => {
  const fullSession = (overrides: Partial<ReturnType<typeof summarizeSession>> = {}) => ({
    ...summarizeSession(
      Array.from({ length: 24 }, (_unused, index) =>
        record({
          exerciseId: `e-${index}`,
          type: index < 12 ? 'singleChoice' : 'textInput',
        }),
      ),
      24,
    ),
    ...overrides,
  });

  it('passes when every requirement is met', () => {
    expect(evaluateMastery(fullSession(), rule, 0)).toEqual({
      mastered: true,
      unmetRequirements: [],
    });
  });

  it('fails below the passing percentage', () => {
    const evaluation = evaluateMastery(fullSession({ scorePercent: 70 }), rule, 0);
    expect(evaluation.mastered).toBe(false);
    expect(evaluation.unmetRequirements[0]).toContain('70%');
  });

  it('fails when not enough exercises were answered', () => {
    const evaluation = evaluateMastery(fullSession({ answeredCount: 20 }), rule, 0);
    expect(evaluation.mastered).toBe(false);
    expect(evaluation.unmetRequirements.join(' ')).toContain('20 of 24');
  });

  it('fails when too few text inputs are correct', () => {
    const evaluation = evaluateMastery(fullSession({ correctTextInputs: 5 }), rule, 0);
    expect(evaluation.mastered).toBe(false);
    expect(evaluation.unmetRequirements.join(' ')).toContain('5 of 8');
  });

  it('fails with more than three open review flags', () => {
    const evaluation = evaluateMastery(fullSession(), rule, 4);
    expect(evaluation.mastered).toBe(false);
    expect(evaluation.unmetRequirements.join(' ')).toContain('flagged for review');
  });

  it('uses the default flag limit when the chapter does not set one', () => {
    const looseRule: MasteryRule = { passingPercent: 80, minimumAnswered: 24 };
    expect(evaluateMastery(fullSession(), looseRule, 3).mastered).toBe(true);
    expect(evaluateMastery(fullSession(), looseRule, 4).mastered).toBe(false);
  });
});
