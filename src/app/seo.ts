import { hasChapter } from '../content/registry';

const ORIGIN = 'https://grammatik.deulern.com';

/** Course content. Everything else is a personal-state screen with nothing to index. */
const INDEXABLE_PATHS = ['/', '/chapters', '/placement', '/about'];

/**
 * What a crawler should do with a route.
 *
 * Every route serves the same shell HTML, and index.html carries no canonical, so
 * Google saw ~170 identical pages and picked its own winner ("Duplicate without
 * user-selected canonical"). A personal-state screen answering 200 with nothing on
 * it reads as a soft 404. Both are decided here, from the path alone, so the shell
 * stays the only place that touches the head.
 */
export function seoForPath(pathname: string): { canonical: string; index: boolean } {
  // Neither a trailing slash nor a query string is part of a route's identity.
  const path = pathname.replace(/\/+$/u, '') || '/';
  // learn, practice and results are one chapter seen from three tabs, not three pages.
  const canonicalPath = path.replace(
    /^(\/chapter\/\d+)\/(?:learn|practice|results)$/u,
    '$1',
  );

  // A chapter number outside the outline is a bad URL: ChapterUnavailable renders at
  // status 200, which is exactly what Google reports as a soft 404.
  const chapter = /^\/chapter\/(\d+)$/u.exec(canonicalPath);
  const index = chapter
    ? hasChapter(Number(chapter[1]))
    : INDEXABLE_PATHS.includes(canonicalPath);

  return { canonical: ORIGIN + canonicalPath, index };
}
