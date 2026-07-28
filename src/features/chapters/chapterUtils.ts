import type { ChapterDefinition } from '../../schemas/chapterSchema';
import {
  EXERCISE_TYPES,
  type DragToSlotsExercise,
  type Exercise,
  type ExerciseType,
  type MatchingExercise,
  type SentenceOrderingExercise,
  type SingleChoiceExercise,
} from '../../schemas/exerciseSchema';

/** Human-readable label for each exercise type, used in progress/counter UI. */
export const EXERCISE_TYPE_LABELS: Record<ExerciseType, string> = {
  singleChoice: 'multiple choice',
  textInput: 'text input',
  sentenceOrdering: 'sentence ordering',
  dragToSlots: 'fill the gaps',
  matching: 'matching',
  errorSpotting: 'find the error',
};

export function formatChapterNumber(chapterNumber: number): string {
  return chapterNumber.toString().padStart(2, '0');
}

export function chapterPath(chapterNumber: number, subPath?: string): string {
  const base = `/chapter/${chapterNumber}`;
  return subPath ? `${base}/${subPath}` : base;
}

export function sortedExercises(chapter: ChapterDefinition): Exercise[] {
  return [...chapter.exercises].sort((a, b) => a.order - b.order);
}

export function findExercise(
  chapter: ChapterDefinition,
  exerciseId: string,
): Exercise | undefined {
  return chapter.exercises.find((exercise) => exercise.id === exerciseId);
}

/** Looks up an exercise across several chapters, for cumulative sessions. */
export function findExerciseAcrossChapters(
  chapters: readonly ChapterDefinition[],
  exerciseId: string,
): Exercise | undefined {
  for (const chapter of chapters) {
    const exercise = findExercise(chapter, exerciseId);
    if (exercise) return exercise;
  }
  return undefined;
}

export type RandomSource = () => number;

/** Fisher–Yates with an injectable random source so tests stay deterministic. */
export function shuffle<T>(items: readonly T[], random: RandomSource = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const a = result[index];
    const b = result[swapIndex];
    if (a === undefined || b === undefined) continue;
    result[index] = b;
    result[swapIndex] = a;
  }
  return result;
}

/** Option ids in display order. */
export function optionOrderFor(
  exercise: SingleChoiceExercise,
  shuffleOptions: boolean,
  random: RandomSource = Math.random,
): string[] {
  const ids = exercise.options.map((option) => option.id);
  return shuffleOptions ? shuffle(ids, random) : ids;
}

export function optionTextById(
  exercise: SingleChoiceExercise,
  optionId: string,
): string | undefined {
  return exercise.options.find((option) => option.id === optionId)?.text;
}

/** Segment ids in display order for a sentence-ordering exercise. */
export function segmentOrderFor(
  exercise: SentenceOrderingExercise,
  shuffleSegments: boolean,
  random: RandomSource = Math.random,
): string[] {
  const ids = exercise.segments.map((segment) => segment.id);
  return shuffleSegments ? shuffle(ids, random) : ids;
}

/** Word-bank indices in display order for a drag-to-slots exercise. */
export function wordBankOrderFor(
  exercise: DragToSlotsExercise,
  shuffleWords: boolean,
  random: RandomSource = Math.random,
): number[] {
  const indices = exercise.wordBank.map((_word, index) => index);
  return shuffleWords ? shuffle(indices, random) : indices;
}

/** Pair ids in right-column display order for a matching exercise. */
export function matchingRightOrderFor(
  exercise: MatchingExercise,
  shuffleRight: boolean,
  random: RandomSource = Math.random,
): string[] {
  const ids = exercise.pairs.map((pair) => pair.id);
  return shuffleRight ? shuffle(ids, random) : ids;
}

export function exerciseCounts(
  chapter: ChapterDefinition,
): { total: number } & Record<ExerciseType, number> {
  const counts = { total: chapter.exercises.length } as { total: number } & Record<
    ExerciseType,
    number
  >;
  for (const type of EXERCISE_TYPES) {
    counts[type] = chapter.exercises.filter((exercise) => exercise.type === type).length;
  }
  return counts;
}
