import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { MasteryBadge } from '../components/progress/MasteryBadge';
import { StreakDisplay } from '../components/progress/StreakDisplay';
import {
  selectChapterCards,
  selectCourseCompletion,
  selectLevelProgress,
} from '../features/chapters/chapterSelectors';
import { chapterPath, formatChapterNumber } from '../features/chapters/chapterUtils';
import {
  selectChapterProgress,
  selectDueHistories,
  useProgressStore,
} from '../features/progress/progressStore';
import {
  averageSessionMs,
  describeDuration,
  totalStudyMs,
} from '../features/progress/studyTime';
import {
  MIN_ANSWERS_FOR_WEAK_SPOT,
  selectWeakSpots,
} from '../features/progress/weakSpots';
import { selectAchievements, sortAchievements } from '../features/progress/achievements';

export function ProgressPage() {
  const progress = useProgressStore();

  const completion = useMemo(() => selectCourseCompletion(progress), [progress]);
  const levels = useMemo(() => selectLevelProgress(progress), [progress]);
  const cards = useMemo(() => selectChapterCards(progress), [progress]);
  const due = useMemo(() => selectDueHistories(progress), [progress]);
  const histories = useMemo(
    () => Object.values(progress.exerciseHistory),
    [progress.exerciseHistory],
  );
  const started = useMemo(
    () => cards.filter((card) => card.status !== 'notStarted'),
    [cards],
  );
  const weakSpots = useMemo(
    () => selectWeakSpots(progress.exerciseHistory, { limit: 8 }),
    [progress.exerciseHistory],
  );
  const titleByNumber = useMemo(
    () => new Map(cards.map((card) => [card.number, card.title])),
    [cards],
  );
  const achievements = useMemo(
    () =>
      sortAchievements(
        selectAchievements({
          chapters: progress.chapters,
          exerciseHistory: progress.exerciseHistory,
          answersByDay: progress.answersByDay,
        }),
      ),
    [progress.chapters, progress.exerciseHistory, progress.answersByDay],
  );
  const earnedCount = achievements.filter((achievement) => achievement.earned).length;
  const totalMs = useMemo(
    () => totalStudyMs(progress.chapters, progress.otherStudyMs),
    [progress.chapters, progress.otherStudyMs],
  );

  return (
    <div className="stack">
      <header>
        <h1>Progress</h1>
        <p className="text-muted prose">
          Everything on this page is stored in this browser only. Clearing site data
          removes it.
        </p>
      </header>

      <Card title="Overall" titleLevel={2}>
        <div className="stack">
          <ProgressBar
            label="Chapters completed"
            value={completion.completedChapters}
            max={completion.totalChapters}
            valueText={`${completion.completedChapters} / ${completion.totalChapters}`}
          />
          <p className="text-sm text-muted">
            {completion.masteredChapters} chapters mastered · {due.length} exercises due
            for review · {histories.length} exercises answered at least once.
          </p>
          <p className="text-sm text-muted">
            {/* Only time with the tab focused counts, so this is time actually
                spent on the course rather than time the page was left open.
                Reading a lesson counts alongside answering exercises. */}
            Time spent studying: <strong>{describeDuration(totalMs)}</strong>
            {progress.otherStudyMs > 0 &&
              ` · ${describeDuration(progress.otherStudyMs)} of it in cumulative reviews`}
            .
          </p>
          <StreakDisplay answersByDay={progress.answersByDay} />
        </div>
      </Card>

      <Card title="By level" titleLevel={2}>
        <div className="stack">
          {levels.map((level) => (
            <div key={level.level}>
              <ProgressBar
                label={`${level.level}: completed`}
                value={level.completed}
                max={level.total}
                valueText={`${level.completed} / ${level.total}`}
              />
              <p className="text-sm text-muted">
                {level.mastered} mastered · {level.available} chapters available in this
                build
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Achievements" titleLevel={2}>
        <div className="stack">
          <p className="text-sm text-muted">
            {earnedCount} of {achievements.length} earned.
          </p>
          <ul className="stack stack--tight">
            {achievements.map((achievement) => (
              <li key={achievement.id}>
                <ProgressBar
                  label={achievement.title}
                  value={achievement.progress}
                  max={achievement.target}
                  valueText={
                    achievement.earned
                      ? 'Earned'
                      : `${achievement.progress} / ${achievement.target}`
                  }
                />
                <span className="text-sm text-muted">{achievement.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card title="Topics to work on" titleLevel={2}>
        {weakSpots.length === 0 ? (
          <p className="text-muted">
            Once you have answered a topic at least {MIN_ANSWERS_FOR_WEAK_SPOT} times, the
            grammar points you get wrong most often show up here.
          </p>
        ) : (
          <div className="stack">
            <p className="text-sm text-muted">
              Accuracy by grammar point, weakest first. Topics run across chapters, so the
              same point can come from several of them.
            </p>
            <div className="grammar-table__wrapper">
              <table className="grammar-table">
                <caption className="visually-hidden">Accuracy by grammar topic</caption>
                <thead>
                  <tr>
                    <th scope="col">Topic</th>
                    <th scope="col">Accuracy</th>
                    <th scope="col">Answered</th>
                    <th scope="col">Practise</th>
                    <th scope="col">Read up in</th>
                  </tr>
                </thead>
                <tbody>
                  {weakSpots.map((spot) => (
                    <tr key={spot.tag}>
                      <th scope="row">{spot.label}</th>
                      <td>{spot.accuracyPercent}%</td>
                      <td>
                        {spot.correct} of {spot.answered}
                      </td>
                      {/* The topic itself, not the chapters it happens to live
                          in: this row already says which grammar point is the
                          problem, so the practice should be that point. */}
                      <td>
                        <Link to={`/review/topic/${spot.tag}`}>Practise this topic</Link>
                      </td>
                      <td>
                        {spot.chapterNumbers.map((number, index) => (
                          <span key={number}>
                            {index > 0 ? ', ' : ''}
                            <Link to={chapterPath(number)}>
                              {titleByNumber.get(number) ?? formatChapterNumber(number)}
                            </Link>
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      <Card title="Chapters you have started" titleLevel={2}>
        {started.length === 0 ? (
          <p className="text-muted">
            No chapter has been started yet. <Link to="/chapters">Pick one</Link> to
            begin.
          </p>
        ) : (
          <div className="grammar-table__wrapper">
            <table className="grammar-table">
              <caption className="visually-hidden">Chapter progress</caption>
              <thead>
                <tr>
                  <th scope="col">Chapter</th>
                  <th scope="col">Level</th>
                  <th scope="col">Status</th>
                  <th scope="col">Covered</th>
                  <th scope="col">Best score</th>
                  <th scope="col">Sessions</th>
                  <th scope="col">Time</th>
                  <th scope="col">Average</th>
                </tr>
              </thead>
              <tbody>
                {started.map((card) => {
                  const chapter = selectChapterProgress(progress, card.number);
                  const averageMs = averageSessionMs(chapter);
                  return (
                    <tr key={card.number}>
                      <th scope="row">
                        <Link to={chapterPath(card.number)}>
                          {formatChapterNumber(card.number)} · {card.title}
                        </Link>
                      </th>
                      <td>{card.level}</td>
                      <td>
                        <MasteryBadge status={card.status} />
                      </td>
                      <td>
                        {card.coveredCount} / {card.exerciseCount}
                      </td>
                      <td>{card.bestScorePercent}%</td>
                      <td>{chapter.attempts}</td>
                      <td>{describeDuration(chapter.studyMs)}</td>
                      <td>{averageMs === null ? '—' : describeDuration(averageMs)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className="text-sm text-muted">
        Progress can be reset in <Link to="/settings">Settings</Link>.
      </p>
    </div>
  );
}
