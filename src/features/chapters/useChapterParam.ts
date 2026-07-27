import { useParams } from 'react-router-dom';
import { getChapter, getRegistryEntry } from '../../content/registry';
import type { ChapterDefinition } from '../../schemas/chapterSchema';
import type { ChapterRegistryEntry } from '../../content/registry';

export interface ChapterRouteResult {
  chapterNumber: number | null;
  chapter: ChapterDefinition | undefined;
  registryEntry: ChapterRegistryEntry | undefined;
}

/** Reads and validates the `:chapterNumber` route parameter. */
export function useChapterParam(): ChapterRouteResult {
  const { chapterNumber: raw } = useParams<{ chapterNumber: string }>();
  const parsed = raw !== undefined && /^\d+$/.test(raw) ? Number.parseInt(raw, 10) : null;

  return {
    chapterNumber: parsed,
    chapter: parsed === null ? undefined : getChapter(parsed),
    registryEntry: parsed === null ? undefined : getRegistryEntry(parsed),
  };
}
