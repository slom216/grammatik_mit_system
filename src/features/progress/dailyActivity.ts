import type { ChapterProgress } from '../../schemas/progressSchema';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export interface DailyChapterActivity {
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  count: number;
  chapterNumbers: number[];
}

function toDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Chapters grouped by the day they were first completed (`completedAt`).
 * A chapter contributes to exactly one day, even if it is later mastered.
 */
export function selectChapterCompletionsByDay(
  chapters: Record<number, ChapterProgress>,
): Map<string, DailyChapterActivity> {
  const byDay = new Map<string, DailyChapterActivity>();
  for (const chapter of Object.values(chapters)) {
    if (!chapter.completedAt) continue;
    const day = chapter.completedAt.slice(0, 10);
    const existing = byDay.get(day);
    if (existing) {
      existing.count += 1;
      existing.chapterNumbers.push(chapter.chapterNumber);
    } else {
      byDay.set(day, { date: day, count: 1, chapterNumbers: [chapter.chapterNumber] });
    }
  }
  return byDay;
}

export interface ActivityCalendarWeek {
  days: DailyChapterActivity[];
}

/**
 * A Monday-first grid of `weeks` full weeks ending on the week containing
 * `now`. Days without a completion get a count of 0, so the grid has no gaps.
 */
export function buildActivityCalendar(
  byDay: Map<string, DailyChapterActivity>,
  weeks = 18,
  now: Date = new Date(),
): ActivityCalendarWeek[] {
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const mondayOffset = (today.getUTCDay() + 6) % 7;
  const weekEnd = new Date(today.getTime() - mondayOffset * DAY_IN_MS + 6 * DAY_IN_MS);
  const gridStart = new Date(weekEnd.getTime() - (weeks * 7 - 1) * DAY_IN_MS);

  const result: ActivityCalendarWeek[] = [];
  for (let week = 0; week < weeks; week += 1) {
    const days: DailyChapterActivity[] = [];
    for (let day = 0; day < 7; day += 1) {
      const date = new Date(gridStart.getTime() + (week * 7 + day) * DAY_IN_MS);
      const key = toDayKey(date);
      days.push(byDay.get(key) ?? { date: key, count: 0, chapterNumbers: [] });
    }
    result.push({ days });
  }
  return result;
}

export interface ActivitySummary {
  totalCompleted: number;
  activeDays: number;
  bestDay?: DailyChapterActivity;
}

export function selectActivitySummary(
  byDay: Map<string, DailyChapterActivity>,
): ActivitySummary {
  const days = [...byDay.values()];
  const totalCompleted = days.reduce((sum, day) => sum + day.count, 0);
  const bestDay = days.reduce<DailyChapterActivity | undefined>((best, day) => {
    if (!best || day.count > best.count) return day;
    return best;
  }, undefined);
  return { totalCompleted, activeDays: days.length, ...(bestDay ? { bestDay } : {}) };
}
