import type { LoaderFunctionArgs } from 'react-router-dom';
import { loadChapter } from '../../content/chapterLoader';
import type { ChapterDefinition } from '../../schemas/chapterSchema';
import { sortedExercises } from '../chapters/chapterUtils';
import { useProgressStore } from '../progress/progressStore';
import { humanizeTag, selectWeakSpots } from '../progress/weakSpots';
import type { CumulativeRouteResult } from './cumulativeRoute';

/**
 * Long enough to be worth the trip, short enough to finish in one sitting.
 * A tag like `ending-agreement` runs across dozens of exercises.
 */
export const TOPIC_SESSION_SIZE = 15;

/**
 * Loads a session built from one grammar tag.
 *
 * The weak-spot list already tells the learner which grammar point they keep
 * getting wrong; until now it could only link them to a whole chapter. The tag
 * is carried by every exercise (`grammarFocus`), so the pool is just a filter —
 * the chapters worth loading are the ones the weak spot was measured from.
 */
export async function topicRouteLoader({
  params,
}: LoaderFunctionArgs): Promise<CumulativeRouteResult> {
  const tag = params.tag ?? '';
  const empty: CumulativeRouteResult = {
    from: 0,
    to: 0,
    chapters: [],
    complete: false,
    topic: tag,
    label: humanizeTag(tag),
  };

  const { exerciseHistory } = useProgressStore.getState();
  // No minimum here: the ranking floor is about what to *suggest*, not about
  // what may be practised. A link that was valid when the page rendered should
  // still work after one more answer shifts the ranking.
  const spot = selectWeakSpots(exerciseHistory, { minimumAnswers: 1 }).find(
    (candidate) => candidate.tag === tag,
  );
  if (!spot) return empty;

  const loaded = await Promise.all(spot.chapterNumbers.map(loadChapter));
  const chapters = loaded.filter(
    (chapter): chapter is ChapterDefinition => chapter !== undefined,
  );
  if (chapters.length === 0) return empty;

  const exerciseIds = topicExerciseIds(chapters, tag, exerciseHistory);
  if (exerciseIds.length === 0) return { ...empty, chapters };

  const numbers = chapters.map((chapter) => chapter.number);
  return {
    from: Math.min(...numbers),
    to: Math.max(...numbers),
    chapters,
    complete: true,
    topic: tag,
    label: spot.label,
    exerciseIds,
  };
}

/**
 * Every exercise carrying the tag, the ones not yet answered correctly first —
 * the same "cover new ground before replaying" rule chapter practice uses.
 */
export function topicExerciseIds(
  chapters: readonly ChapterDefinition[],
  tag: string,
  exerciseHistory: Record<string, { timesCorrect: number }>,
  limit: number = TOPIC_SESSION_SIZE,
): string[] {
  const tagged = chapters
    .flatMap((chapter) => sortedExercises(chapter))
    .filter((exercise) => exercise.grammarFocus.includes(tag))
    .map((exercise) => exercise.id);

  const notYetCorrect = (id: string) => (exerciseHistory[id]?.timesCorrect ?? 0) === 0;

  return [
    ...tagged.filter(notYetCorrect),
    ...tagged.filter((id) => !notYetCorrect(id)),
  ].slice(0, limit);
}
