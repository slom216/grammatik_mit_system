import { Link } from 'react-router-dom';
import type { ChapterCardModel } from '../../features/chapters/chapterSelectors';
import { chapterPath, formatChapterNumber } from '../../features/chapters/chapterUtils';
import { MasteryBadge } from './MasteryBadge';

export interface ChapterProgressCardProps {
  chapter: ChapterCardModel;
}

export function ChapterProgressCard({ chapter }: ChapterProgressCardProps) {
  const heading = (
    <>
      <span className="chapter-card__number">
        Chapter {formatChapterNumber(chapter.number)}
      </span>
      <br />
      {chapter.title}
    </>
  );

  return (
    <article className="card">
      <div className="chapter-card__header">
        <h3 className="card__title">
          {chapter.available ? (
            <Link to={chapterPath(chapter.number)}>{heading}</Link>
          ) : (
            heading
          )}
        </h3>
        <span className="badge">{chapter.level}</span>
      </div>

      <p className="chapter-card__meta">
        <MasteryBadge
          status={chapter.status}
          bestScorePercent={chapter.bestScorePercent}
        />
        {chapter.estimatedMinutes !== undefined && (
          <span>≈ {chapter.estimatedMinutes} min</span>
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
