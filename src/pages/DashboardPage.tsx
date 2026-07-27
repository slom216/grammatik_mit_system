import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { StreakDisplay } from '../components/progress/StreakDisplay';
import { MasteryBadge } from '../components/progress/MasteryBadge';
import {
  selectContinueChapter,
  selectCourseCompletion,
  selectLevelProgress,
} from '../features/chapters/chapterSelectors';
import { chapterPath, formatChapterNumber } from '../features/chapters/chapterUtils';
import { selectDueHistories, useProgressStore } from '../features/progress/progressStore';
import { getRegistryEntry, getChapter } from '../content/registry';

export function DashboardPage() {
  const progress = useProgressStore();

  const completion = useMemo(() => selectCourseCompletion(progress), [progress]);
  const levels = useMemo(() => selectLevelProgress(progress), [progress]);
  const continueChapter = useMemo(() => selectContinueChapter(progress), [progress]);
  const due = useMemo(() => selectDueHistories(progress), [progress]);
  const histories = useMemo(
    () => Object.values(progress.exerciseHistory),
    [progress.exerciseHistory],
  );
  const recentlyCompleted = useMemo(
    () =>
      Object.values(progress.chapters)
        .filter((chapter) => chapter.completedAt !== undefined)
        .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
        .slice(0, 3),
    [progress.chapters],
  );

  return (
    <div className="stack">
      <header>
        <h1>Dashboard</h1>
        <p className="text-muted prose">
          Work through the course chapter by chapter. Every chapter has an explanation and
          24 exercises; your progress stays in this browser.
        </p>
      </header>

      <Card title="Course completion" titleLevel={2}>
        <ProgressBar
          label="Chapters completed"
          value={completion.completedChapters}
          max={completion.totalChapters}
          valueText={`${completion.completedChapters} / ${completion.totalChapters} (${completion.percentComplete}%)`}
        />
        <p className="text-sm text-muted">
          {completion.masteredChapters} mastered · {completion.availableChapters} chapters
          available in this build.
        </p>
        <StreakDisplay histories={histories} />
      </Card>

      <Card title="Continue learning" titleLevel={2}>
        {continueChapter ? (
          <div className="stack stack--tight">
            <p>
              <strong>
                Chapter {formatChapterNumber(continueChapter.number)} ·{' '}
                {continueChapter.title}
              </strong>
            </p>
            <p className="row">
              <MasteryBadge
                status={continueChapter.status}
                bestScorePercent={continueChapter.bestScorePercent}
              />
              <span className="badge">{continueChapter.level}</span>
            </p>
            <p className="row">
              <Link
                className="button button--primary"
                to={chapterPath(continueChapter.number)}
              >
                Open chapter
              </Link>
              <Link
                className="button button--secondary"
                to={chapterPath(continueChapter.number, 'practice')}
              >
                Start practice
              </Link>
            </p>
          </div>
        ) : (
          <p>
            No chapter content is available yet.{' '}
            <Link to="/chapters">See the catalogue</Link> for the full course outline.
          </p>
        )}
      </Card>

      <Card title="Due for review" titleLevel={2}>
        {due.length === 0 ? (
          <p className="text-muted">
            Nothing is due. Exercises you get wrong appear here.
          </p>
        ) : (
          <div className="stack stack--tight">
            <p>
              {due.length} {due.length === 1 ? 'exercise is' : 'exercises are'} waiting in
              the review queue.
            </p>
            <p>
              <Link className="button button--primary" to="/review">
                Go to review
              </Link>
            </p>
          </div>
        )}
      </Card>

      <Card title="Recently completed" titleLevel={2}>
        {recentlyCompleted.length === 0 ? (
          <p className="text-muted">No chapter has been completed yet.</p>
        ) : (
          <ul>
            {recentlyCompleted.map((chapter) => {
              const title =
                getRegistryEntry(chapter.chapterNumber)?.title ??
                getChapter(chapter.chapterNumber)?.title ??
                'Chapter';
              return (
                <li key={chapter.chapterNumber}>
                  <Link to={chapterPath(chapter.chapterNumber)}>
                    {formatChapterNumber(chapter.chapterNumber)} · {title}
                  </Link>{' '}
                  <span className="text-sm text-muted">
                    best {chapter.bestScorePercent}%
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card title="Level progress" titleLevel={2}>
        <div className="stack">
          {levels.map((level) => (
            <ProgressBar
              key={level.level}
              label={`${level.level} chapters completed`}
              value={level.completed}
              max={level.total}
              valueText={`${level.completed} / ${level.total}`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
