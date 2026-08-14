import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { getRegistryEntry, hasChapter } from '../content/registry';
import { selectAvailableCheckpoints } from '../features/chapters/chapterSelectors';
import { chapterPath, formatChapterNumber } from '../features/chapters/chapterUtils';
import { selectDueHistories, useProgressStore } from '../features/progress/progressStore';

export function ReviewPage() {
  const progress = useProgressStore();

  const due = useMemo(() => selectDueHistories(progress), [progress]);
  const checkpoints = selectAvailableCheckpoints();

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
          Exercises come back here to be checked again. Ones you got wrong return quickly
          — after a day, then three, then a week. Ones you have only ever got right return
          slowly, after a week and then three. Three correct answers in a row retire an
          exercise either way.
        </p>
      </header>

      {due.length === 0 ? (
        <Card title="Nothing is due" titleLevel={2}>
          <p>
            Practise a chapter first. Everything you answer is scheduled to come back —
            what you get wrong returns the next day.
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
              const title = getRegistryEntry(chapterNumber)?.title ?? 'Chapter';
              const available = hasChapter(chapterNumber);
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

      {checkpoints.length > 0 && (
        <section className="stack stack--tight">
          <h2>Course checkpoints</h2>
          <p className="text-muted prose">
            A mixed practice session pulling exercises from a whole block of chapters, so
            older topics stay fresh once you have moved on.
          </p>
          <div className="grid">
            {checkpoints.map((checkpoint) => (
              <Card key={checkpoint.id} title={checkpoint.title}>
                <Link
                  className="button button--secondary"
                  to={`/review/${checkpoint.from}/${checkpoint.to}`}
                >
                  Start cumulative review
                </Link>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
