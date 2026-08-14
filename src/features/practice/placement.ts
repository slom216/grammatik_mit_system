import type { ChapterDefinition } from '../../schemas/chapterSchema';
import type { ExerciseAttemptRecord } from '../../schemas/progressSchema';
import { shuffle, sortedExercises, type RandomSource } from '../chapters/chapterUtils';
import { isCorrectOutcome } from './scoring';

/**
 * Chapters the placement test probes, spread across the course so the sample
 * spans A1 to B1. Deliberately a handful rather than a proper adaptive test:
 * each probe costs a chapter chunk to download, and the goal is only to point a
 * newcomer at a sensible starting chapter, not to grade them.
 */
export const PLACEMENT_PROBE_CHAPTERS = [5, 13, 21, 30, 40, 50, 62, 75] as const;

export const PLACEMENT_EXERCISES_PER_CHAPTER = 3;

/** The share of a probe's exercises that must be right to count as passed. */
export const PLACEMENT_PASS_RATIO = 0.6;

/**
 * A sample from each probe chapter, kept in chapter order so the test walks
 * from easiest to hardest and the learner can stop feeling out of their depth
 * at a predictable point.
 */
export function buildPlacementExerciseIds(
  chapters: readonly ChapterDefinition[],
  perChapter: number = PLACEMENT_EXERCISES_PER_CHAPTER,
  random: RandomSource = Math.random,
): string[] {
  const ordered = [...chapters].sort((a, b) => a.number - b.number);
  return ordered.flatMap((chapter) =>
    shuffle(sortedExercises(chapter), random)
      .slice(0, perChapter)
      .map((exercise) => exercise.id),
  );
}

export interface ProbeResult {
  chapterNumber: number;
  answered: number;
  correct: number;
  passed: boolean;
}

export interface PlacementResult {
  probes: ProbeResult[];
  /** The chapter to start from. */
  recommendedChapter: number;
  /** True when every probe was passed — the learner is past the course. */
  clearedEverything: boolean;
}

/**
 * Scores a finished placement test.
 *
 * The recommendation is the first probe the learner did not pass: that is where
 * their knowledge runs out, so it is where the course should start. Passing
 * everything recommends the last chapter rather than claiming there is nothing
 * left to learn.
 */
export function scorePlacement(
  chapters: readonly ChapterDefinition[],
  exerciseIds: readonly string[],
  results: Record<string, ExerciseAttemptRecord>,
  passRatio: number = PLACEMENT_PASS_RATIO,
): PlacementResult {
  const chapterOf = new Map<string, number>();
  for (const chapter of chapters) {
    for (const exercise of chapter.exercises) {
      chapterOf.set(exercise.id, chapter.number);
    }
  }

  const tally = new Map<number, { answered: number; correct: number }>();
  for (const id of exerciseIds) {
    const chapterNumber = chapterOf.get(id);
    if (chapterNumber === undefined) continue;
    const entry = tally.get(chapterNumber) ?? { answered: 0, correct: 0 };
    const record = results[id];
    if (record) {
      entry.answered += 1;
      if (isCorrectOutcome(record.outcome)) entry.correct += 1;
    }
    tally.set(chapterNumber, entry);
  }

  const probes: ProbeResult[] = [...tally.entries()]
    .sort(([a], [b]) => a - b)
    .map(([chapterNumber, entry]) => ({
      chapterNumber,
      answered: entry.answered,
      correct: entry.correct,
      // An unanswered probe counts as not passed: skipping to the end should
      // never place someone at chapter 75.
      passed: entry.answered > 0 && entry.correct / entry.answered >= passRatio,
    }));

  const firstFailed = probes.find((probe) => !probe.passed);
  const lastProbe = probes[probes.length - 1];

  return {
    probes,
    recommendedChapter: firstFailed?.chapterNumber ?? lastProbe?.chapterNumber ?? 1,
    clearedEverything: probes.length > 0 && firstFailed === undefined,
  };
}
