import { describe, expect, it } from 'vitest';
import {
  PLACEMENT_EXERCISES_PER_CHAPTER,
  buildPlacementExerciseIds,
  scorePlacement,
} from './placement';
import { makeChapter } from '../../test/fixtures/chapterFixture';
import type { ChapterDefinition } from '../../schemas/chapterSchema';
import type { AttemptOutcome, ExerciseAttemptRecord } from '../../schemas/progressSchema';

function probeChapter(number: number): ChapterDefinition {
  const base = makeChapter();
  return {
    ...base,
    number,
    exercises: base.exercises.map((exercise, index) => ({
      ...exercise,
      id: `ch${number}-ex-${index + 1}`,
      chapterNumber: number,
    })),
  };
}

function record(exerciseId: string, outcome: AttemptOutcome): ExerciseAttemptRecord {
  return {
    exerciseId,
    type: 'singleChoice',
    attempts: 1,
    outcome,
    score: outcome === 'correctFirstAttempt' ? 1 : 0,
    submittedAnswers: ['x'],
  };
}

/** Answers each chapter's sampled exercises, `correctPerChapter` of them right. */
function answers(
  exerciseIds: readonly string[],
  correctPerChapter: Record<number, number>,
): Record<string, ExerciseAttemptRecord> {
  const seen = new Map<number, number>();
  const results: Record<string, ExerciseAttemptRecord> = {};
  for (const id of exerciseIds) {
    const chapterNumber = Number(/^ch(\d+)-/.exec(id)?.[1]);
    const index = seen.get(chapterNumber) ?? 0;
    seen.set(chapterNumber, index + 1);
    const correct = index < (correctPerChapter[chapterNumber] ?? 0);
    results[id] = record(id, correct ? 'correctFirstAttempt' : 'incorrect');
  }
  return results;
}

describe('buildPlacementExerciseIds', () => {
  const chapters = [probeChapter(30), probeChapter(5), probeChapter(13)];

  it('samples a fixed number from each chapter', () => {
    const ids = buildPlacementExerciseIds(chapters);
    expect(ids).toHaveLength(chapters.length * PLACEMENT_EXERCISES_PER_CHAPTER);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // The test should walk from easiest to hardest whatever order the loader
  // returned the chapters in.
  it('keeps chapters in ascending order', () => {
    const numbers = buildPlacementExerciseIds(chapters).map((id) =>
      Number(/^ch(\d+)-/.exec(id)?.[1]),
    );
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
  });
});

describe('scorePlacement', () => {
  const chapters = [probeChapter(5), probeChapter(13), probeChapter(21)];
  const ids = buildPlacementExerciseIds(chapters);

  it('recommends the first chapter the learner did not pass', () => {
    // Chapter 5 solid, chapter 13 fails, chapter 21 irrelevant after that.
    const result = scorePlacement(chapters, ids, answers(ids, { 5: 3, 13: 1, 21: 3 }));

    expect(result.recommendedChapter).toBe(13);
    expect(result.clearedEverything).toBe(false);
    expect(result.probes.map((probe) => probe.passed)).toEqual([true, false, true]);
  });

  it('recommends the very first chapter when nothing is passed', () => {
    const result = scorePlacement(chapters, ids, answers(ids, {}));

    expect(result.recommendedChapter).toBe(5);
    expect(result.probes.every((probe) => !probe.passed)).toBe(true);
  });

  it('reports a clean sweep against the last probe', () => {
    const result = scorePlacement(chapters, ids, answers(ids, { 5: 3, 13: 3, 21: 3 }));

    expect(result.clearedEverything).toBe(true);
    expect(result.recommendedChapter).toBe(21);
  });

  it('treats a 2-of-3 chapter as passed and 1-of-3 as not', () => {
    const result = scorePlacement(chapters, ids, answers(ids, { 5: 2, 13: 1, 21: 3 }));

    expect(result.probes[0]?.passed).toBe(true);
    expect(result.probes[1]?.passed).toBe(false);
  });

  // Abandoning the test halfway must not read as "everything after was fine".
  it('counts an unanswered probe as not passed', () => {
    const answered = answers(ids, { 5: 3, 13: 3, 21: 3 });
    for (const id of ids) {
      if (id.startsWith('ch21-')) delete answered[id];
    }

    const result = scorePlacement(chapters, ids, answered);

    expect(result.recommendedChapter).toBe(21);
    expect(result.clearedEverything).toBe(false);
    expect(result.probes[2]).toMatchObject({ answered: 0, correct: 0, passed: false });
  });
});
