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
import heroArt from '../assets/art/hero-symbol.webp';
import cardArt from '../assets/art/continue-card-decoration.webp';
import redWedge from '../assets/art/red-wedge.png';

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
    <div className="dashboard">
      <header className="dashboard-hero">
        <div className="dashboard-hero__copy">
          <span className="eyebrow">A1–B1 grammar course</span>
          <p className="poster-line">
            Your grammar, <span className="poster-line__accent">taking shape</span>.
          </p>
          <h1 className="dashboard-hero__title">Dashboard</h1>
          <p className="lead">
            {completion.availableChapters} chapters, each with a lesson and its own
            exercise pool. Your progress stays in this browser.
          </p>
        </div>
        {/* The four DeuLern apps as a poster slogan: live text rather than the
            art's printed copy, so it stays legible on the night paper. */}
        <div className="dashboard-hero__art" aria-hidden="true">
          <img src={heroArt} alt="" width={324} height={246} />
          <p className="dashboard-hero__slogan">
            Grammatik
            <br />
            Wortschatz
            <br />
            Verben
            <br />
            Lesen
          </p>
        </div>
      </header>

      {progress.recovered && (
        <div className="notice" role="status">
          <p>
            <strong>Saved progress could not be read and was reset.</strong> This happens
            when browser storage is damaged. A copy of the unreadable data was kept in
            this browser. If you have a backup file, restore it in{' '}
            <Link to="/settings">Settings</Link>.
          </p>
          <Button variant="ghost" onClick={progress.acknowledgeRecovery}>
            Dismiss
          </Button>
        </div>
      )}

      <div className="dashboard-top">
        <div className="stack">
          <Card
            className="card--elevated continue-card"
            title="Continue learning"
            titleLevel={2}
          >
            <img
              className="continue-card__art"
              src={cardArt}
              alt=""
              width={148}
              height={331}
            />
            {continueChapter ? (
              <div className="continue-card__body">
                <span className="display-number">
                  {formatChapterNumber(continueChapter.number)}
                </span>
                <h3 className="continue-card__title">{continueChapter.title}</h3>
                <p className="continue-card__meta">
                  <MasteryBadge
                    status={continueChapter.status}
                    bestScorePercent={continueChapter.bestScorePercent}
                  />
                  <span>{continueChapter.level}</span>
                </p>
                <p className="row continue-card__actions">
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
            ) : completion.availableChapters > 0 &&
              completion.completedChapters >= completion.availableChapters ? (
              <p className="continue-card__body">
                You have completed every chapter. Keep it fresh in the{' '}
                <Link to="/review">review queue</Link>.
              </p>
            ) : (
              <p className="continue-card__body">
                No chapter content is available yet.{' '}
                <Link to="/chapters">See the catalogue</Link> for the full course outline.
              </p>
            )}
          </Card>

          {!hasStarted && (
            <Card title="Not sure where to begin?" titleLevel={2}>
              <div className="stack stack--tight">
                <p>
                  A short placement test samples the course and suggests a starting
                  chapter. It is not saved to your progress.
                </p>
                <p>
                  <Link className="button button--secondary" to="/placement">
                    Take the placement test
                  </Link>
                </p>
              </div>
            </Card>
          )}
        </div>

        <div className="dashboard-stats">
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
      <section className="panel dashboard-next" aria-labelledby="dashboard-next-heading">
        <img
          className="dashboard-next__wedge"
          src={redWedge}
          alt=""
          width={35}
          height={85}
        />
        <div className="dashboard-next__head">
          <div>
            <h2 className="panel__title" id="dashboard-next-heading">
              Work on next
            </h2>
            <p className="text-muted">
              {due.length === 0
                ? 'Nothing is due for review. Exercises you get wrong appear here.'
                : `${due.length} ${due.length === 1 ? 'exercise is' : 'exercises are'} waiting in the review queue.`}
            </p>
          </div>
          {due.length > 0 && (
            <Link className="button button--primary" to="/review">
              Go to review
            </Link>
          )}
        </div>

        {/* Mustard, because here a short bar is the point: these are the least
            accurate topics, and the blue used everywhere else would read as
            progress earned rather than ground to make up. */}
        {weakSpots.length > 0 && (
          <div className="weak-spots">
            <h3 className="panel__title">Topics to work on</h3>
            {weakSpots.map((spot) => (
              <div key={spot.tag} className="weak-spots__row">
                <ProgressBar
                  label={spot.label}
                  value={spot.accuracyPercent}
                  valueText={`${spot.accuracyPercent}% of ${spot.answered}`}
                />
                <Link to={`/review/topic/${spot.tag}`}>
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

      <div className="dashboard-duo">
        <section className="panel" aria-labelledby="dashboard-course-heading">
          <h2 className="panel__title" id="dashboard-course-heading">
            Your course
          </h2>
          <div className="stack stack--tight">
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

        {recentlyCompleted.length > 0 && (
          <section className="panel" aria-labelledby="dashboard-recent-heading">
            <h2 className="panel__title" id="dashboard-recent-heading">
              Recently completed
            </h2>
            <ul className="recent-list">
              {recentlyCompleted.map((chapter) => {
                const title = getRegistryEntry(chapter.chapterNumber)?.title ?? 'Chapter';
                return (
                  <li key={chapter.chapterNumber}>
                    <span>
                      {formatChapterNumber(chapter.chapterNumber)} ·{' '}
                      <Link to={chapterPath(chapter.chapterNumber)}>{title}</Link>
                    </span>
                    <span className="text-muted">best {chapter.bestScorePercent}%</span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
