import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { StreakDisplay } from '../components/progress/StreakDisplay';
import { DailyGoalProgress } from '../components/progress/DailyGoalProgress';
import { MasteryBadge } from '../components/progress/MasteryBadge';
import { ProgressRing } from '../components/progress/ProgressRing';
import {
  selectContinueChapter,
  selectCourseCompletion,
  selectLevelProgress,
} from '../features/chapters/chapterSelectors';
import { chapterPath, formatChapterNumber } from '../features/chapters/chapterUtils';
import { selectDueHistories, useProgressStore } from '../features/progress/progressStore';
import { selectPracticeSummary } from '../features/progress/dailyActivity';
import { selectWeakSpots } from '../features/progress/weakSpots';
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
  const answered = useMemo(
    () => selectPracticeSummary(progress.answersByDay).totalAnswers,
    [progress.answersByDay],
  );
  // The most actionable thing the app knows, and it was buried on /progress.
  const weakSpots = useMemo(
    () => selectWeakSpots(progress.exerciseHistory, { limit: 3 }),
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
          {/* The ring carries the headline percentage, so the stat row and the
              chapters bar that both repeated it are gone. */}
          <ProgressRing
            percent={completion.percentComplete}
            label="Course completed"
            caption={`${completion.completedChapters} of ${completion.totalChapters} chapters`}
          />
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
              <dt className="stat__label">Exercises answered</dt>
              <dd className="stat__value">{answered}</dd>
            </div>
            <div className="stat">
              <dt className="stat__label">Due for review</dt>
              <dd className="stat__value">{due.length}</dd>
            </div>
          </dl>
          <StreakDisplay answersByDay={progress.answersByDay} />
          <DailyGoalProgress answersByDay={progress.answersByDay} goal={dailyGoal} />
        </div>
      </div>

      {/* What to do next — the review queue and the weakest topics are the same
          question asked twice, so they share one panel instead of competing. */}
      <section className="panel" aria-labelledby="dashboard-next-heading">
        <h2 className="panel__title" id="dashboard-next-heading">
          Work on next
        </h2>

        {due.length === 0 ? (
          <p className="text-muted">
            Nothing is due for review. Exercises you get wrong appear here.
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

        {/* Warning-toned, because here a short bar is the point: these are the
            least accurate topics, and the accent used everywhere else would
            read as progress earned rather than ground to make up. */}
        {weakSpots.length > 0 && (
          <div className="stack stack--tight weak-spots">
            <h3>Topics to work on</h3>
            {weakSpots.map((spot) => (
              <div key={spot.tag} className="weak-spots__row">
                <ProgressBar
                  label={spot.label}
                  value={spot.accuracyPercent}
                  valueText={`${spot.accuracyPercent}% of ${spot.answered}`}
                />
                <Link className="text-sm" to={`/review/topic/${spot.tag}`}>
                  Practise <span className="visually-hidden">{spot.label}</span>
                </Link>
              </div>
            ))}
            <p className="text-sm text-muted">
              Accuracy across every exercise tagged with that topic.{' '}
              <Link to="/progress">See all topics</Link>.
            </p>
          </div>
        )}
      </section>

      <section className="panel" aria-labelledby="dashboard-course-heading">
        <h2 className="panel__title" id="dashboard-course-heading">
          Your course
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

        {recentlyCompleted.length > 0 && (
          <div className="stack stack--tight">
            <h3>Recently completed</h3>
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
          </div>
        )}
      </section>
    </div>
  );
}
