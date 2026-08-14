import { describe, expect, it } from 'vitest';
import {
  buildQuickExerciseIds,
  QUICK_SESSION_SIZE,
  quickMasteryRule,
} from './quickSession';
import {
  makeChapter,
  makeSingleChoice,
  makeTextInput,
} from '../../test/fixtures/chapterFixture';

/** 60 exercises: 40 single-choice, then 20 text-input. */
const chapter = makeChapter({
  mastery: { passingPercent: 80, minimumAnswered: 60, requiredCorrectTextInputs: 20 },
  exercises: [
    ...Array.from({ length: 40 }, (_unused, index) =>
      makeSingleChoice(index + 1, { id: `ch1-ex-${index + 1}` }),
    ),
    ...Array.from({ length: 20 }, (_unused, index) =>
      makeTextInput(index + 41, { id: `ch1-ex-${index + 41}` }),
    ),
  ],
});

describe('buildQuickExerciseIds', () => {
  it('picks 24 exercises and keeps them in the chapter order', () => {
    const ids = buildQuickExerciseIds(chapter);
    expect(ids).toHaveLength(QUICK_SESSION_SIZE);
    expect(new Set(ids).size).toBe(QUICK_SESSION_SIZE);

    const orderOf = (id: string) =>
      chapter.exercises.find((exercise) => exercise.id === id)?.order ?? -1;
    const orders = ids.map(orderOf);
    expect([...orders].sort((a, b) => a - b)).toEqual(orders);
  });

  it('samples a different slice on a later run', () => {
    const first = buildQuickExerciseIds(chapter);
    const second = buildQuickExerciseIds(chapter);
    expect(first).not.toEqual(second);
  });

  it('always includes the exercises that are due for review', () => {
    const due = ['ch1-ex-58', 'ch1-ex-59', 'ch1-ex-60'];
    const ids = buildQuickExerciseIds(chapter, QUICK_SESSION_SIZE, Math.random, due);

    expect(ids).toHaveLength(QUICK_SESSION_SIZE);
    for (const id of due) expect(ids).toContain(id);
  });

  it('ignores due exercises that belong to another chapter', () => {
    const ids = buildQuickExerciseIds(chapter, QUICK_SESSION_SIZE, Math.random, [
      'ch9-ex-01',
    ]);
    expect(ids).toHaveLength(QUICK_SESSION_SIZE);
    expect(ids).not.toContain('ch9-ex-01');
  });

  it('never asks for more exercises than the chapter has', () => {
    const small = makeChapter({ exercises: chapter.exercises.slice(0, 10) });
    expect(buildQuickExerciseIds(small)).toHaveLength(10);
  });
});

describe('quickMasteryRule', () => {
  it('scales the thresholds down to what the session contains', () => {
    const ids = chapter.exercises.slice(0, 24).map((exercise) => exercise.id);
    const rule = quickMasteryRule(chapter, ids);

    expect(rule.passingPercent).toBe(80);
    expect(rule.minimumAnswered).toBe(24);
    // The first 24 exercises are all single-choice, so no text inputs are required.
    expect(rule.requiredCorrectTextInputs).toBe(0);
  });

  it("keeps the chapter's own requirement when the session covers everything", () => {
    const ids = chapter.exercises.map((exercise) => exercise.id);
    expect(quickMasteryRule(chapter, ids).requiredCorrectTextInputs).toBe(20);
  });
});
