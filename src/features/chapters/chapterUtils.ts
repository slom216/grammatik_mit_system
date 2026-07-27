import type { ChapterDefinition } from '../../schemas/chapterSchema';
import type { Exercise, SingleChoiceExercise } from '../../schemas/exerciseSchema';

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

export function exerciseCounts(chapter: ChapterDefinition): {
  total: number;
  singleChoice: number;
  textInput: number;
} {
  return {
    total: chapter.exercises.length,
    singleChoice: chapter.exercises.filter((e) => e.type === 'singleChoice').length,
    textInput: chapter.exercises.filter((e) => e.type === 'textInput').length,
  };
}
