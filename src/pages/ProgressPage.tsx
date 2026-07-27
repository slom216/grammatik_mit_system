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
import { selectDueHistories, useProgressStore } from '../features/progress/progressStore';

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
          <StreakDisplay histories={histories} />
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
                  <th scope="col">Best score</th>
                </tr>
              </thead>
              <tbody>
                {started.map((card) => (
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
                    <td>{card.bestScorePercent}%</td>
                  </tr>
                ))}
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
