import type { ChapterDefinition } from '../../schemas/chapterSchema';
import { sortedExercises } from '../chapters/chapterUtils';

/**
 * Orders a chapter's exercises so a repeat run covers new ground: the ones the
 * learner has not answered correctly yet come first, in the authored order,
 * then the ones already covered — also in authored order, so a full replay
 * reads the way the chapter was written.
 *
 * The whole pool is still returned. A full practice run is still a full
 * practice run; only the order it works through it changes. With nothing
 * covered the result is exactly `sortedExercises`.
 */
export function uncoveredFirst(
  chapter: ChapterDefinition,
  coveredIds: ReadonlySet<string>,
): string[] {
  const ordered = sortedExercises(chapter).map((exercise) => exercise.id);
  return [
    ...ordered.filter((id) => !coveredIds.has(id)),
    ...ordered.filter((id) => coveredIds.has(id)),
  ];
}
