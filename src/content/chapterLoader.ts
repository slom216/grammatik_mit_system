import type { ChapterDefinition } from '../schemas/chapterSchema';

/**
 * Loads chapter bodies one at a time.
 *
 * Every chapter file becomes its own chunk (~64 KB), fetched when the learner
 * actually opens that chapter. Importing chapter modules anywhere else puts all
 * 85 of them back into the entry bundle, which an eslint rule guards against.
 */
const loaders = import.meta.glob<Record<string, ChapterDefinition>>(
  './chapters/chapter-*.ts',
);

const loaderByNumber = new Map<
  number,
  () => Promise<Record<string, ChapterDefinition>>
>();
for (const [path, load] of Object.entries(loaders)) {
  const match = /\/chapter-(\d{3})-[a-z0-9-]+\.ts$/.exec(path);
  if (match?.[1]) loaderByNumber.set(Number.parseInt(match[1], 10), load);
}

const cache = new Map<number, Promise<ChapterDefinition | undefined>>();

/**
 * Resolves to the chapter body, or to `undefined` for an unknown number or a
 * chunk that failed to download.
 */
export function loadChapter(
  chapterNumber: number,
): Promise<ChapterDefinition | undefined> {
  const cached = cache.get(chapterNumber);
  if (cached) return cached;

  const load = loaderByNumber.get(chapterNumber);
  if (!load) return Promise.resolve(undefined);

  // Each chapter file exports exactly one value, under a per-chapter name
  // (`chapter001`, `chapter042`, …), so the module's single value is the
  // chapter. A content test asserts the one-export-per-file rule.
  const promise = load()
    .then((module) => Object.values(module)[0])
    .catch((error: unknown) => {
      console.error(`[content] chapter ${chapterNumber} failed to load`, error);
      // A dropped connection must not poison the cache for the whole session.
      cache.delete(chapterNumber);
      return undefined;
    });

  cache.set(chapterNumber, promise);
  return promise;
}

/** Warms a chapter's chunk ahead of a likely navigation. */
export function prefetchChapter(chapterNumber: number): void {
  void loadChapter(chapterNumber);
}
