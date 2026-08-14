import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { StreakDisplay } from '../components/progress/StreakDisplay';
import { DailyGoalProgress } from '../components/progress/DailyGoalProgress';
import { MasteryBadge } from '../components/progress/MasteryBadge';
import {
  selectContinueChapter,
  selectCourseCompletion,
  selectLevelProgress,
} from '../features/chapters/chapterSelectors';
import { chapterPath, formatChapterNumber } from '../features/chapters/chapterUtils';
import { selectDueHistories, useProgressStore } from '../features/progress/progressStore';
import { useSettingsStore } from '../features/settings/settingsStore';
import { getRegistryEntry } from '../content/registry';

export function DashboardPage() {
  const progress = useProgressStore();
  const dailyGoal = useSettingsStore((state) => state.dailyGoal);

  const completion = useMemo(() => selectCourseCompletion(progress), [progress]);
  const levels = useMemo(() => selectLevelProgress(progress), [progress]);
  const continueChapter = useMemo(() => selectContinueChapter(progress), [progress]);
  // Only worth offering while the learner has no progress to place them.
  const hasStarted = Object.keys(progress.chapters).length > 0;
  const due = useMemo(() => selectDueHistories(progress), [progress]);
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
      <header className="page-header">
        <span className="eyebrow">A1–B1 grammar course</span>
        <h1>Dashboard</h1>
        <p className="lead">
          {completion.availableChapters} chapters, each with a lesson and its own exercise
          pool. Everything you answer stays in this browser.
        </p>
      </header>

      {progress.recovered && (
        <div className="notice" role="status">
          <p>
            <strong>Saved progress could not be read and was reset.</strong> This happens
            when browser storage is damaged or written by an older version. If you have a
            backup file, restore it in <Link to="/settings">Settings</Link>.
          </p>
          <Button variant="ghost" onClick={progress.acknowledgeRecovery}>
            Dismiss
          </Button>
        </div>
      )}

      <div className="split">
        <Card className="card--elevated" title="Continue learning" titleLevel={2}>
          {continueChapter ? (
            <div className="stack stack--tight">
              <span className="display-number">
                {formatChapterNumber(continueChapter.number)}
              </span>
              <h3>{continueChapter.title}</h3>
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

        {!hasStarted && (
          <Card title="Not sure where to begin?" titleLevel={2}>
            <div className="stack">
              <p>
                A short placement test samples the course and suggests a starting chapter.
                It is not saved to your progress.
              </p>
              <p>
                <Link className="button button--secondary" to="/placement">
                  Take the placement test
                </Link>
              </p>
            </div>
          </Card>
        )}

        <div className="stack">
          <dl className="stat-grid">
            <div className="stat">
              <dt className="stat__label">Chapters completed</dt>
              <dd className="stat__value">{completion.completedChapters}</dd>
            </div>
            <div className="stat">
              <dt className="stat__label">Mastered</dt>
              <dd className="stat__value">{completion.masteredChapters}</dd>
            </div>
            <div className="stat">
              <dt className="stat__label">Of the course</dt>
              <dd className="stat__value">{completion.percentComplete}%</dd>
            </div>
            <div className="stat">
              <dt className="stat__label">Due for review</dt>
              <dd className="stat__value">{due.length}</dd>
            </div>
          </dl>
          <StreakDisplay answersByDay={progress.answersByDay} />
          <DailyGoalProgress answersByDay={progress.answersByDay} goal={dailyGoal} />
          <ProgressBar
            label="Chapters completed"
            value={completion.completedChapters}
            max={completion.totalChapters}
            valueText={`${completion.completedChapters} / ${completion.totalChapters} (${completion.percentComplete}%)`}
          />
        </div>
      </div>

      <section className="panel" aria-labelledby="dashboard-review-heading">
        <h2 className="panel__title" id="dashboard-review-heading">
          Due for review
        </h2>
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
      </section>

      <section className="panel" aria-labelledby="dashboard-recent-heading">
        <h2 className="panel__title" id="dashboard-recent-heading">
          Recently completed
        </h2>
        {recentlyCompleted.length === 0 ? (
          <p className="text-muted">No chapter has been completed yet.</p>
        ) : (
          <ul>
            {recentlyCompleted.map((chapter) => {
              const title = getRegistryEntry(chapter.chapterNumber)?.title ?? 'Chapter';
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
      </section>

      <section className="panel" aria-labelledby="dashboard-levels-heading">
        <h2 className="panel__title" id="dashboard-levels-heading">
          Level progress
        </h2>
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
      </section>
    </div>
  );
}
