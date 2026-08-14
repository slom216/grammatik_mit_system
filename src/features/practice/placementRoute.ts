import { loadChapter } from '../../content/chapterLoader';
import type { ChapterDefinition } from '../../schemas/chapterSchema';
import { PLACEMENT_PROBE_CHAPTERS } from './placement';

export interface PlacementRouteResult {
  chapters: ChapterDefinition[];
  /** False when a probe chapter's chunk failed to load. */
  complete: boolean;
}

/** Loads the placement test's probe chapters, in parallel. */
export async function placementRouteLoader(): Promise<PlacementRouteResult> {
  const loaded = await Promise.all(PLACEMENT_PROBE_CHAPTERS.map(loadChapter));
  const chapters = loaded.filter(
    (chapter): chapter is ChapterDefinition => chapter !== undefined,
  );

  return { chapters, complete: chapters.length === PLACEMENT_PROBE_CHAPTERS.length };
}
