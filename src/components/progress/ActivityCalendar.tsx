import { buildActivityCalendar, heatLevel } from '../../features/progress/dailyActivity';

export interface ActivityCalendarProps {
  /** Exercises answered per local day, `YYYY-MM-DD` → count. */
  answersByDay: Record<string, number>;
  weeks?: number;
  now?: Date;
}

const HEAT_LEVELS = [0, 1, 2, 3, 4] as const;

function formatDayLabel(dateKey: string): string {
  // Parsed as local parts, matching how the key was built.
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Visual, GitHub-style heatmap of exercises answered per day. Decorative — the
 * same data is also presented as an accessible table alongside it.
 */
export function ActivityCalendar({
  answersByDay,
  weeks = 18,
  now,
}: ActivityCalendarProps) {
  const calendarWeeks = buildActivityCalendar(answersByDay, weeks, now);

  return (
    <div className="activity-calendar">
      <div
        className="activity-calendar__grid"
        role="img"
        aria-label={`Exercises answered per day over the last ${weeks} weeks`}
      >
        {calendarWeeks.map((week) => (
          <div className="activity-calendar__week" key={week.days[0]?.date}>
            {week.days.map((day) => (
              <span
                key={day.date}
                className={`activity-calendar__cell activity-calendar__cell--level-${heatLevel(day.count)}`}
                title={`${day.count} ${day.count === 1 ? 'exercise' : 'exercises'} answered on ${formatDayLabel(day.date)}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="activity-calendar__legend text-sm text-muted" aria-hidden="true">
        <span>Less</span>
        {HEAT_LEVELS.map((level) => (
          <span
            key={level}
            className={`activity-calendar__cell activity-calendar__cell--level-${level}`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
