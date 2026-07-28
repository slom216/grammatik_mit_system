import type { ChapterDefinition } from '../../schemas/chapterSchema';
import type { ExerciseHistory } from '../../schemas/progressSchema';
import { shuffle, sortedExercises, type RandomSource } from '../chapters/chapterUtils';
import { selectDueExercises } from './reviewScheduler';

export const DEFAULT_SAMPLE_PER_CHAPTER = 3;

/**
 * Builds a mixed exercise pool for a cumulative review session across
 * several chapters: every exercise from that range currently due for
 * spaced-repetition review, plus a shuffled sample of a few more exercises
 * per chapter, so the session is useful even before anything has been
 * marked wrong yet. The result is shuffled so chapters interleave instead
 * of appearing as separate blocks.
 */
export function buildCumulativeExerciseIds(
  chapters: readonly ChapterDefinition[],
  exerciseHistory: Record<string, ExerciseHistory>,
  now: Date = new Date(),
  samplePerChapter: number = DEFAULT_SAMPLE_PER_CHAPTER,
  random: RandomSource = Math.random,
): string[] {
  const chapterNumbers = new Set(chapters.map((chapter) => chapter.number));
  const histories = Object.values(exerciseHistory).filter((history) =>
    chapterNumbers.has(history.chapterNumber),
  );
  const due = selectDueExercises(histories, now).map((history) => history.exerciseId);
  const dueIds = new Set(due);

  const sampled: string[] = [];
  for (const chapter of chapters) {
    const remaining = sortedExercises(chapter).filter(
      (exercise) => !dueIds.has(exercise.id),
    );
    const picks = shuffle(remaining, random).slice(0, samplePerChapter);
    sampled.push(...picks.map((exercise) => exercise.id));
  }

  return shuffle([...due, ...sampled], random);
}
