import { Link } from 'react-router-dom';
import { prefetchChapter } from '../../content/chapterLoader';
import type { ChapterCardModel } from '../../features/chapters/chapterSelectors';
import { chapterPath, formatChapterNumber } from '../../features/chapters/chapterUtils';
import { Icon } from '../common/Icon';
import { MasteryBadge } from './MasteryBadge';

export interface ChapterProgressCardProps {
  chapter: ChapterCardModel;
}

export function ChapterProgressCard({ chapter }: ChapterProgressCardProps) {
  const title = (
    <>
      <span className="visually-hidden">
        Chapter {formatChapterNumber(chapter.number)}:{' '}
      </span>
      {chapter.title}
    </>
  );

  return (
    <article
      className={`card chapter-card${chapter.available ? ' card--interactive' : ''}`}
      // Start the ~64 KB chapter chunk on intent rather than on the click, so
      // the route loader usually has it already. A hover that goes nowhere
      // costs one chunk, and the service worker keeps it for offline use.
      onMouseEnter={() => chapter.available && prefetchChapter(chapter.number)}
      onFocus={() => chapter.available && prefetchChapter(chapter.number)}
    >
      <div className="chapter-card__header">
        <span className="chapter-card__number" aria-hidden="true">
          {formatChapterNumber(chapter.number)}
        </span>
        <span className="badge">{chapter.level}</span>
      </div>

      <h3 className="card__title">
        {chapter.available ? (
          <Link to={chapterPath(chapter.number)}>{title}</Link>
        ) : (
          title
        )}
      </h3>

      <p className="chapter-card__meta">
        <MasteryBadge
          status={chapter.status}
          bestScorePercent={chapter.bestScorePercent}
        />
        {chapter.estimatedMinutes !== undefined && (
          <span className="row row--tight">
            <Icon name="clock" />
            {chapter.estimatedMinutes} min
          </span>
        )}
        {/* Text, not a bar: the catalogue shows 85 of these at once. */}
        <span className="row row--tight">
          <Icon name="circle-check" />
          {chapter.coveredCount} / {chapter.exerciseCount} exercises
        </span>
        {chapter.reviewDue && <span className="badge badge--warning">Review due</span>}
        {chapter.bookmarked && <span className="badge">Bookmarked</span>}
      </p>

      {!chapter.available && (
        <p className="text-sm text-muted">Content for this chapter is not written yet.</p>
      )}
    </article>
  );
}
