import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ChapterUnavailable } from '../components/common/ChapterUnavailable';
import { MasteryBadge } from '../components/progress/MasteryBadge';
import { getRegistryEntry } from '../content/registry';
import { getSection } from '../content/sections';
import {
  chapterPath,
  exerciseCounts,
  formatChapterNumber,
} from '../features/chapters/chapterUtils';
import { useChapterParam } from '../features/chapters/useChapterParam';
import { QUICK_SESSION_SIZE } from '../features/practice/quickSession';
import {
  selectChapterProgress,
  useProgressStore,
} from '../features/progress/progressStore';

export function ChapterPage() {
  const { chapterNumber, chapter, registryEntry } = useChapterParam();
  const progress = useProgressStore();
  const setLastOpenedChapter = useProgressStore((state) => state.setLastOpenedChapter);
  const toggleBookmark = useProgressStore((state) => state.toggleBookmark);

  useEffect(() => {
    if (chapter) setLastOpenedChapter(chapter.number);
  }, [chapter, setLastOpenedChapter]);

  if (!chapter) {
    return (
      <ChapterUnavailable chapterNumber={chapterNumber} title={registryEntry?.title} />
    );
  }

  const chapterProgress = selectChapterProgress(progress, chapter.number);
  const counts = exerciseCounts(chapter);
  const section = getSection(chapter.section);

  return (
    <div className="stack">
      <header className="stack stack--tight">
        <p className="eyebrow">
          {section.title} · Chapter {formatChapterNumber(chapter.number)}
        </p>
        <h1>
          {chapter.title}
          {chapter.germanTitle && (
            <>
              {' '}
              <span className="text-muted" lang="de">
                ({chapter.germanTitle})
              </span>
            </>
          )}
        </h1>
        <p className="row">
          <span className="badge badge--accent">{chapter.level}</span>
          <MasteryBadge
            status={chapterProgress.status}
            bestScorePercent={chapterProgress.bestScorePercent}
          />
          <span className="badge">≈ {chapter.estimatedMinutes} min</span>
          {chapter.isDemo && <span className="badge badge--warning">Engine demo</span>}
        </p>
      </header>

      <Card title="Objective" titleLevel={2}>
        <p>{chapter.objective}</p>
      </Card>

      <Card title="Before you start" titleLevel={2}>
        {chapter.prerequisites.length === 0 ? (
          <p className="text-muted">No prerequisites.</p>
        ) : (
          <ul>
            {chapter.prerequisites.map((number) => (
              <li key={number}>
                <Link to={chapterPath(number)}>
                  Chapter {formatChapterNumber(number)} ·{' '}
                  {getRegistryEntry(number)?.title ?? 'Chapter'}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="text-sm text-muted">
          {counts.total} exercises · {counts.singleChoice} multiple choice ·{' '}
          {counts.textInput} text input. Mastery: {chapter.mastery.passingPercent}% with
          at least {chapter.mastery.minimumAnswered} exercises answered.
        </p>
      </Card>

      <div className="row">
        <Link
          className="button button--primary"
          to={chapterPath(chapter.number, 'learn')}
        >
          Read the lesson
        </Link>
        <Link
          className="button button--secondary"
          to={`${chapterPath(chapter.number, 'practice')}?mode=quick`}
        >
          Quick practice ({Math.min(QUICK_SESSION_SIZE, counts.total)})
        </Link>
        <Link
          className="button button--secondary"
          to={chapterPath(chapter.number, 'practice')}
        >
          Full practice ({counts.total})
        </Link>
        <Button variant="ghost" onClick={() => toggleBookmark(chapter.number)}>
          {chapterProgress.bookmarked ? 'Remove bookmark' : 'Bookmark chapter'}
        </Button>
      </div>
    </div>
  );
}
