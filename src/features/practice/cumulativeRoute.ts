import type { LoaderFunctionArgs } from 'react-router-dom';
import { loadChapter } from '../../content/chapterLoader';
import type { ChapterDefinition } from '../../schemas/chapterSchema';

/**
 * The longest checkpoint spans ten chapters. The cap keeps a hand-typed URL
 * like /review/1/99999 from firing tens of thousands of chunk requests.
 */
const MAX_RANGE = 20;

export interface CumulativeRouteResult {
  from: number;
  to: number;
  chapters: ChapterDefinition[];
  /** False when the range is invalid or any chapter in it has no content. */
  complete: boolean;
  /* The three fields below are set by the topic loader (`topicRoute.ts`), which
     drives the same page: a session built from one grammar tag rather than a
     chapter range. A chapter range leaves them undefined and the page falls
     back to its own heading and pool. */
  /** The `grammarFocus` tag this session was built from. */
  topic?: string;
  /** Heading for the session, e.g. `Ending agreement`. */
  label?: string;
  /** Prebuilt pool. When absent the page builds one from the chapter range. */
  exerciseIds?: string[];
}

/** Loads every chapter in a cumulative review range, in parallel. */
export async function cumulativeRouteLoader({
  params,
}: LoaderFunctionArgs): Promise<CumulativeRouteResult> {
  const from = Number(params.from);
  const to = Number(params.to);
  const valid =
    Number.isInteger(from) && Number.isInteger(to) && from <= to && to - from < MAX_RANGE;
  if (!valid) return { from, to, chapters: [], complete: false };

  const numbers = Array.from({ length: to - from + 1 }, (_unused, index) => from + index);
  const loaded = await Promise.all(numbers.map(loadChapter));
  const chapters = loaded.filter(
    (chapter): chapter is ChapterDefinition => chapter !== undefined,
  );

  return { from, to, chapters, complete: chapters.length === numbers.length };
}
