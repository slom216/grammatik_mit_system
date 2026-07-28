import {
  buildActivityCalendar,
  type DailyChapterActivity,
} from '../../features/progress/dailyActivity';

export interface ActivityCalendarProps {
  byDay: Map<string, DailyChapterActivity>;
  weeks?: number;
  now?: Date;
}

const HEAT_LEVELS = [0, 1, 2, 3, 4] as const;
const MAX_HEAT_LEVEL: (typeof HEAT_LEVELS)[number] = 4;

function heatLevel(count: number): (typeof HEAT_LEVELS)[number] {
  return Math.max(0, Math.min(count, MAX_HEAT_LEVEL)) as (typeof HEAT_LEVELS)[number];
}

function formatDayLabel(dateKey: string): string {
  return new Date(`${dateKey}T00:00:00.000Z`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Visual, GitHub-style heatmap of chapters completed per day. Decorative —
 * the same data is also presented as an accessible table alongside it.
 */
export function ActivityCalendar({ byDay, weeks = 18, now }: ActivityCalendarProps) {
  const calendarWeeks = buildActivityCalendar(byDay, weeks, now);

  return (
    <div className="activity-calendar">
      <div
        className="activity-calendar__grid"
        role="img"
        aria-label={`Chapters completed per day over the last ${weeks} weeks`}
      >
        {calendarWeeks.map((week) => (
          <div className="activity-calendar__week" key={week.days[0]?.date}>
            {week.days.map((day) => (
              <span
                key={day.date}
                className={`activity-calendar__cell activity-calendar__cell--level-${heatLevel(day.count)}`}
                title={`${day.count} ${day.count === 1 ? 'chapter' : 'chapters'} completed on ${formatDayLabel(day.date)}`}
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
