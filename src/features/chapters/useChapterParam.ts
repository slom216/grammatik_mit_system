import { useLoaderData, type LoaderFunctionArgs } from 'react-router-dom';
import { loadChapter } from '../../content/chapterLoader';
import { getRegistryEntry } from '../../content/registry';
import type { ChapterDefinition } from '../../schemas/chapterSchema';
import type { ChapterRegistryEntry } from '../../content/registry';

export interface ChapterRouteResult {
  chapterNumber: number | null;
  chapter: ChapterDefinition | undefined;
  registryEntry: ChapterRegistryEntry | undefined;
}

/**
 * Reads the `:chapterNumber` route parameter and loads that chapter's content
 * before the page renders, so pages can treat the chapter as available.
 */
export async function chapterRouteLoader({
  params,
}: LoaderFunctionArgs): Promise<ChapterRouteResult> {
  const raw = params.chapterNumber;
  const parsed = raw !== undefined && /^\d+$/.test(raw) ? Number.parseInt(raw, 10) : null;

  return {
    chapterNumber: parsed,
    chapter: parsed === null ? undefined : await loadChapter(parsed),
    registryEntry: parsed === null ? undefined : getRegistryEntry(parsed),
  };
}

/** The chapter loaded for the current route. */
export function useChapterParam(): ChapterRouteResult {
  return useLoaderData() as ChapterRouteResult;
}
