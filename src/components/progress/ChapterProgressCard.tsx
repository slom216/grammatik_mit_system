import { Link } from 'react-router-dom';
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
        {chapter.reviewDue && <span className="badge badge--warning">Review due</span>}
        {chapter.bookmarked && <span className="badge">Bookmarked</span>}
      </p>

      {!chapter.available && (
        <p className="text-sm text-muted">Content for this chapter is not written yet.</p>
      )}
    </article>
  );
}
