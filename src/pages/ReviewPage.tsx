import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { getChapter, getRegistryEntry } from '../content/registry';
import { chapterPath, formatChapterNumber } from '../features/chapters/chapterUtils';
import { selectDueHistories, useProgressStore } from '../features/progress/progressStore';

export function ReviewPage() {
  const progress = useProgressStore();

  const due = useMemo(() => selectDueHistories(progress), [progress]);

  const byChapter = useMemo(() => {
    const map = new Map<number, number>();
    for (const history of due) {
      map.set(history.chapterNumber, (map.get(history.chapterNumber) ?? 0) + 1);
    }
    return [...map.entries()].map(([chapterNumber, count]) => ({ chapterNumber, count }));
  }, [due]);

  return (
    <div className="stack">
      <header>
        <h1>Review queue</h1>
        <p className="text-muted prose">
          Exercises you answered incorrectly come back here. Getting one right pushes it
          further into the future; three correct answers in a row retire it.
        </p>
      </header>

      {due.length === 0 ? (
        <Card title="Nothing is due" titleLevel={2}>
          <p>
            Practise a chapter first. Every exercise you get wrong is scheduled for review
            the next day.
          </p>
          <p>
            <Link className="button button--primary" to="/chapters">
              Open the catalogue
            </Link>
          </p>
        </Card>
      ) : (
        <>
          <p aria-live="polite">
            {due.length} {due.length === 1 ? 'exercise' : 'exercises'} due across{' '}
            {byChapter.length} {byChapter.length === 1 ? 'chapter' : 'chapters'}.
          </p>

          <div className="grid">
            {byChapter.map(({ chapterNumber, count }) => {
              const title =
                getRegistryEntry(chapterNumber)?.title ??
                getChapter(chapterNumber)?.title ??
                'Chapter';
              const available = getChapter(chapterNumber) !== undefined;
              return (
                <Card
                  key={chapterNumber}
                  title={`Chapter ${formatChapterNumber(chapterNumber)} · ${title}`}
                >
                  <p>
                    {count} {count === 1 ? 'exercise' : 'exercises'} due.
                  </p>
                  {available && (
                    <Link
                      className="button button--primary"
                      to={`${chapterPath(chapterNumber, 'practice')}?mode=review`}
                    >
                      Review now
                    </Link>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
