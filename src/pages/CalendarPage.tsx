import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { selectChapterCards } from '../features/chapters/chapterSelectors';
import { chapterPath } from '../features/chapters/chapterUtils';
import {
  buildMonthGrid,
  heatLevel,
  selectDayDetail,
} from '../features/progress/dailyActivity';
import { toDayKey } from '../features/progress/dayKey';
import { useProgressStore } from '../features/progress/progressStore';
import { describeDuration } from '../features/progress/studyTime';

/** Monday-first, matching the grid. */
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Parsed as local parts, matching how the key was built. */
function parseDayKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
}

function formatDate(dateKey: string): string {
  return parseDayKey(dateKey).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function describeDay(dateKey: string, answers: number, ms: number): string {
  const date = formatDate(dateKey);
  if (answers === 0 && ms === 0) return `${date}: nothing practised`;
  const exercises = `${answers} ${answers === 1 ? 'exercise' : 'exercises'}`;
  return ms > 0
    ? `${date}: ${exercises}, ${describeDuration(ms)}`
    : `${date}: ${exercises}`;
}

export function CalendarPage() {
  const progress = useProgressStore();

  const today = useMemo(() => new Date(), []);
  // The first of the month on show. Kept as a date rather than an offset so the
  // grid builder needs no arithmetic of its own.
  const [month, setMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selected, setSelected] = useState(() => toDayKey(today));

  const weeks = useMemo(
    () => buildMonthGrid(month, progress.answersByDay, progress.dayLog),
    [month, progress.answersByDay, progress.dayLog],
  );
  const detail = useMemo(
    () => selectDayDetail(selected, progress.answersByDay, progress.dayLog),
    [selected, progress.answersByDay, progress.dayLog],
  );
  const cards = useMemo(() => selectChapterCards(progress), [progress]);
  const titleByNumber = useMemo(
    () => new Map(cards.map((card) => [card.number, card.title])),
    [cards],
  );

  const monthTotals = useMemo(
    () =>
      weeks.flat().reduce(
        (totals, day) =>
          day.inMonth
            ? {
                answers: totals.answers + day.answers,
                ms: totals.ms + day.ms,
                days: totals.days + (day.answers > 0 || day.ms > 0 ? 1 : 0),
              }
            : totals,
        { answers: 0, ms: 0, days: 0 },
      ),
    [weeks],
  );

  const monthLabel = month.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const todayKey = toDayKey(today);
  const isCurrentMonth =
    month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();

  const shiftMonth = (by: number) =>
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + by, 1));

  return (
    <div className="stack">
      <header>
        <h1>Calendar</h1>
        <p className="text-muted prose">
          Which chapters you practised on each day, and how long you spent. Everything here
          is stored in this browser only.
        </p>
      </header>

      <Card
        title={monthLabel}
        titleLevel={2}
        actions={
          <div className="row">
            <button
              type="button"
              className="button button--ghost"
              onClick={() => shiftMonth(-1)}
            >
              ← Previous
            </button>
            <button
              type="button"
              className="button button--ghost"
              onClick={() => shiftMonth(1)}
              disabled={isCurrentMonth}
            >
              Next →
            </button>
          </div>
        }
      >
        <div className="stack">
          <p className="text-sm text-muted">
            {monthTotals.answers}{' '}
            {monthTotals.answers === 1 ? 'exercise' : 'exercises'} over{' '}
            {monthTotals.days} {monthTotals.days === 1 ? 'day' : 'days'}
            {monthTotals.ms > 0 ? ` · ${describeDuration(monthTotals.ms)}` : ''}.
          </p>

          <table className="calendar-month">
            <caption className="visually-hidden">
              Practice per day in {monthLabel}. Pick a day to see its chapters.
            </caption>
            <thead>
              <tr>
                {WEEKDAYS.map((weekday) => (
                  <th scope="col" key={weekday}>
                    <span aria-hidden="true">{weekday.slice(0, 2)}</span>
                    <span className="visually-hidden">{weekday}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week) => (
                <tr key={week[0]?.date}>
                  {week.map((day) => (
                    <td key={day.date}>
                      <button
                        type="button"
                        className={[
                          'calendar-month__day',
                          `calendar-month__day--level-${heatLevel(day.answers)}`,
                          day.inMonth ? '' : 'calendar-month__day--outside',
                          day.date === todayKey ? 'calendar-month__day--today' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        aria-pressed={day.date === selected}
                        aria-label={describeDay(day.date, day.answers, day.ms)}
                        onClick={() => setSelected(day.date)}
                      >
                        <span aria-hidden="true">{parseDayKey(day.date).getDate()}</span>
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title={formatDate(detail.date)} titleLevel={2}>
        {detail.answers === 0 && detail.ms === 0 ? (
          <p className="text-muted">
            Nothing practised on this day.{' '}
            <Link to="/chapters">Pick a chapter</Link> to change that.
          </p>
        ) : (
          <div className="stack stack--tight">
            <p className="text-sm text-muted">
              {detail.answers} {detail.answers === 1 ? 'exercise' : 'exercises'}
              {detail.ms > 0 ? ` · ${describeDuration(detail.ms)}` : ''}.
            </p>
            <ul className="stack stack--tight">
              {detail.chapters.map((chapter) => (
                <li key={chapter.chapterNumber}>
                  <Link to={chapterPath(chapter.chapterNumber)}>
                    {titleByNumber.get(chapter.chapterNumber) ??
                      `Chapter ${chapter.chapterNumber}`}
                  </Link>{' '}
                  <span className="text-sm text-muted">
                    {chapter.answers} {chapter.answers === 1 ? 'exercise' : 'exercises'}
                    {chapter.ms > 0 ? ` · ${describeDuration(chapter.ms)}` : ''}
                  </span>
                </li>
              ))}
              {detail.mixedMs > 0 && (
                <li>
                  Mixed review{' '}
                  <span className="text-sm text-muted">
                    {describeDuration(detail.mixedMs)}
                  </span>
                </li>
              )}
            </ul>
            {detail.chapters.length === 0 && detail.mixedMs === 0 && (
              // Days practised before the app started logging chapters and time.
              <p className="text-sm text-muted">
                No chapter breakdown was recorded for this day.
              </p>
            )}
          </div>
        )}
      </Card>

      <p className="text-sm text-muted">
        See the streak and the full heatmap in <Link to="/activity">Activity</Link>.
      </p>
    </div>
  );
}
