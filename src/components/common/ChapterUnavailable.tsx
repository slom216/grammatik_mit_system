import { Link } from 'react-router-dom';

export interface ChapterUnavailableProps {
  chapterNumber: number | null;
  title?: string;
}

/** Shown when a chapter route exists in the outline but has no content yet. */
export function ChapterUnavailable({ chapterNumber, title }: ChapterUnavailableProps) {
  return (
    <div className="stack">
      <h1>
        {chapterNumber === null
          ? 'Unknown chapter'
          : `Chapter ${chapterNumber}${title ? ` · ${title}` : ''}`}
      </h1>
      <p>
        {chapterNumber === null
          ? 'That chapter number is not valid.'
          : 'The content for this chapter has not been written yet.'}
      </p>
      <p>
        <Link className="button button--primary" to="/chapters">
          Back to the catalogue
        </Link>
      </p>
    </div>
  );
}
