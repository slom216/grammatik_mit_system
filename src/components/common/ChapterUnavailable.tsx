import { Link, useRevalidator } from 'react-router-dom';
import { hasChapter } from '../../content/registry';
import { Button } from './Button';

export interface ChapterUnavailableProps {
  chapterNumber: number | null;
  title?: string;
}

/**
 * Shown when a chapter route resolves to no content.
 *
 * There are two ways to get here, and they need different answers. A number
 * that is not in the outline is a bad URL and nothing will fix it. A number
 * that *is* in the outline has a body that failed to download — every chapter
 * ships, so an unreachable one means the chunk request failed, which offline is
 * the usual cause. `loadChapter` drops the failed promise from its cache, so
 * re-running the route loader is a real retry rather than a repeat of the same
 * cached failure.
 */
export function ChapterUnavailable({ chapterNumber, title }: ChapterUnavailableProps) {
  const revalidator = useRevalidator();
  const known = chapterNumber !== null && hasChapter(chapterNumber);

  return (
    <div className="stack">
      <h1>
        {chapterNumber === null
          ? 'Unknown chapter'
          : `Chapter ${chapterNumber}${title ? ` · ${title}` : ''}`}
      </h1>
      <p>
        {known
          ? 'This chapter could not be downloaded. Check your connection and try again — once it has loaded, it is available offline.'
          : 'That chapter number is not valid.'}
      </p>
      <div className="row">
        {known && (
          <Button
            onClick={() => revalidator.revalidate()}
            disabled={revalidator.state === 'loading'}
          >
            {revalidator.state === 'loading' ? 'Trying again…' : 'Try again'}
          </Button>
        )}
        <Link
          className={known ? 'button button--ghost' : 'button button--primary'}
          to="/chapters"
        >
          Back to the catalogue
        </Link>
      </div>
    </div>
  );
}
