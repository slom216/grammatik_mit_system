import type { ChapterDefinition } from '../../schemas/chapterSchema';
import type { MasteryRule } from '../../schemas/chapterSchema';
import { shuffle, sortedExercises, type RandomSource } from '../chapters/chapterUtils';

/** How many exercises a quick practice session pulls from a chapter's pool. */
export const QUICK_SESSION_SIZE = 24;

/**
 * Picks a subset of a chapter's exercises for a short session. Chapters hold
 * 50-100 exercises, which is a long sit-down; a quick session takes exercises
 * that are due for review first, then the ones the learner has never answered
 * correctly, then the rest — so repeated runs work through the whole pool
 * instead of drawing the same exercises again.
 */
export function buildQuickExerciseIds(
  chapter: ChapterDefinition,
  size: number = QUICK_SESSION_SIZE,
  random: RandomSource = Math.random,
  /** Exercises of this chapter that are due for review, which come first. */
  dueIds: readonly string[] = [],
  /** Exercises already answered correctly at least once; filled in last. */
  coveredIds: ReadonlySet<string> = new Set(),
): string[] {
  const chapterExercises = sortedExercises(chapter);
  const known = new Set(chapterExercises.map((exercise) => exercise.id));
  // Anything the learner got wrong earns its place before a random pick does,
  // but only up to half the session: uncapped, a chapter with 24+ due
  // exercises produced quick sessions that were pure review and never moved
  // the learner through the rest of the pool.
  const due = dueIds.filter((id) => known.has(id)).slice(0, Math.ceil(size / 2));

  const picked = new Set(due);
  const uncovered = chapterExercises.filter((exercise) => !coveredIds.has(exercise.id));
  const covered = chapterExercises.filter((exercise) => coveredIds.has(exercise.id));
  for (const exercise of [...shuffle(uncovered, random), ...shuffle(covered, random)]) {
    if (picked.size >= size) break;
    picked.add(exercise.id);
  }
  // Keep the chapter's own order within the sample: exercises are authored from
  // recognition to production, and that progression is worth preserving.
  return chapterExercises
    .filter((exercise) => picked.has(exercise.id))
    .map((exercise) => exercise.id);
}

/**
 * Chapter mastery thresholds are sized for the full pool, so a quick session
 * could never meet them. Scaling them down to what the session actually
 * contains keeps quick practice a real way to progress through a chapter.
 */
export function quickMasteryRule(
  chapter: ChapterDefinition,
  exerciseIds: readonly string[],
): MasteryRule {
  const included = new Set(exerciseIds);
  const exercises = chapter.exercises.filter((exercise) => included.has(exercise.id));
  const textInputs = exercises.filter((exercise) => exercise.type === 'textInput').length;
  return {
    ...chapter.mastery,
    minimumAnswered: Math.min(chapter.mastery.minimumAnswered, exercises.length),
    requiredCorrectTextInputs: Math.min(
      chapter.mastery.requiredCorrectTextInputs ?? 0,
      textInputs,
    ),
  };
}
