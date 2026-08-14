import type { ChapterDefinition } from '../../schemas/chapterSchema';
import type { MasteryRule } from '../../schemas/chapterSchema';
import { shuffle, sortedExercises, type RandomSource } from '../chapters/chapterUtils';

/** How many exercises a quick practice session pulls from a chapter's pool. */
export const QUICK_SESSION_SIZE = 24;

/**
 * Picks a random subset of a chapter's exercises for a short session. Chapters
 * hold 50-100 exercises, which is a long sit-down; a quick session samples a
 * different slice each time so repeated runs still cover the whole pool.
 */
export function buildQuickExerciseIds(
  chapter: ChapterDefinition,
  size: number = QUICK_SESSION_SIZE,
  random: RandomSource = Math.random,
): string[] {
  const picked = new Set(
    shuffle(sortedExercises(chapter), random)
      .slice(0, size)
      .map((exercise) => exercise.id),
  );
  // Keep the chapter's own order within the sample: exercises are authored from
  // recognition to production, and that progression is worth preserving.
  return sortedExercises(chapter)
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
  const textInputs = exercises.filter(
    (exercise) => exercise.type === 'textInput',
  ).length;
  return {
    ...chapter.mastery,
    minimumAnswered: Math.min(chapter.mastery.minimumAnswered, exercises.length),
    requiredCorrectTextInputs: Math.min(
      chapter.mastery.requiredCorrectTextInputs ?? 0,
      textInputs,
    ),
  };
}
