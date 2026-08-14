import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { ActivityCalendar } from '../components/progress/ActivityCalendar';
import { StreakDisplay } from '../components/progress/StreakDisplay';
import { selectChapterCards } from '../features/chapters/chapterSelectors';
import {
  selectActivitySummary,
  selectChapterCompletionsByDay,
  selectPracticeSummary,
} from '../features/progress/dailyActivity';
import { useProgressStore } from '../features/progress/progressStore';

function formatDate(dateKey: string): string {
  // Parsed as local parts, matching how the key was built.
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ActivityPage() {
  const progress = useProgressStore();

  const byDay = useMemo(
    () => selectChapterCompletionsByDay(progress.chapters),
    [progress.chapters],
  );
  const summary = useMemo(() => selectActivitySummary(byDay), [byDay]);
  const practice = useMemo(
    () => selectPracticeSummary(progress.answersByDay),
    [progress.answersByDay],
  );
  const cards = useMemo(() => selectChapterCards(progress), [progress]);
  const titleByNumber = useMemo(
    () => new Map(cards.map((card) => [card.number, card.title])),
    [cards],
  );
  const recentDays = useMemo(
    () => [...byDay.values()].sort((a, b) => b.date.localeCompare(a.date)),
    [byDay],
  );

  return (
    <div className="stack">
      <header>
        <h1>Activity</h1>
        <p className="text-muted prose">
          How much you have practised each day. Everything here is stored in this browser
          only.
        </p>
      </header>

      <Card title="Exercises answered" titleLevel={2}>
        <div className="stack">
          <p className="text-sm text-muted">
            {practice.totalAnswers}{' '}
            {practice.totalAnswers === 1 ? 'exercise' : 'exercises'} answered across{' '}
            {practice.activeDays} {practice.activeDays === 1 ? 'day' : 'days'}
            {practice.bestDay
              ? ` · best day: ${practice.bestDay.count} on ${formatDate(practice.bestDay.date)}`
              : ''}
            .
          </p>
          <ActivityCalendar answersByDay={progress.answersByDay} />
          <StreakDisplay answersByDay={progress.answersByDay} />
        </div>
      </Card>

      <Card title="Chapters completed" titleLevel={2}>
        {recentDays.length === 0 ? (
          <p className="text-muted">
            No chapter has been completed yet. <Link to="/chapters">Pick one</Link> to get
            started.
          </p>
        ) : (
          <div className="stack">
            <p className="text-sm text-muted">
              {summary.totalCompleted}{' '}
              {summary.totalCompleted === 1 ? 'chapter' : 'chapters'} completed across{' '}
              {summary.activeDays} {summary.activeDays === 1 ? 'day' : 'days'}.
            </p>
            <div className="grammar-table__wrapper">
              <table className="grammar-table">
                <caption className="visually-hidden">Chapters completed by day</caption>
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Chapters completed</th>
                    <th scope="col">Chapters</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDays.map((day) => (
                    <tr key={day.date}>
                      <th scope="row">{formatDate(day.date)}</th>
                      <td>{day.count}</td>
                      <td>
                        {day.chapterNumbers
                          .map(
                            (number) => titleByNumber.get(number) ?? `Chapter ${number}`,
                          )
                          .join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      <p className="text-sm text-muted">
        See overall mastery and level breakdown in <Link to="/progress">Progress</Link>.
      </p>
    </div>
  );
}
