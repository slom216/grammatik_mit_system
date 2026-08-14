import type { ChapterProgress } from '../../schemas/progressSchema';
import { addDays, toDayKey } from './dayKey';

export interface DailyChapterActivity {
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  count: number;
  chapterNumbers: number[];
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
    const day = toDayKey(new Date(chapter.completedAt));
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

export interface ActivityDay {
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  /** Exercises answered on that day. */
  count: number;
}

export interface ActivityCalendarWeek {
  days: ActivityDay[];
}

/**
 * A Monday-first grid of `weeks` full weeks ending on the week containing
 * `now`. Days without practice get a count of 0, so the grid has no gaps.
 */
export function buildActivityCalendar(
  answersByDay: Record<string, number>,
  weeks = 18,
  now: Date = new Date(),
): ActivityCalendarWeek[] {
  const mondayOffset = (now.getDay() + 6) % 7;
  const gridStart = addDays(now, -mondayOffset - (weeks - 1) * 7);

  const result: ActivityCalendarWeek[] = [];
  for (let week = 0; week < weeks; week += 1) {
    const days: ActivityDay[] = [];
    for (let day = 0; day < 7; day += 1) {
      const date = toDayKey(addDays(gridStart, week * 7 + day));
      days.push({ date, count: answersByDay[date] ?? 0 });
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

export interface PracticeSummary {
  totalAnswers: number;
  activeDays: number;
  bestDay?: ActivityDay;
}

/** Totals over every day the learner has answered at least one exercise. */
export function selectPracticeSummary(
  answersByDay: Record<string, number>,
): PracticeSummary {
  const days = Object.entries(answersByDay)
    .filter(([, count]) => count > 0)
    .map(([date, count]) => ({ date, count }));

  const totalAnswers = days.reduce((sum, day) => sum + day.count, 0);
  const bestDay = days.reduce<ActivityDay | undefined>((best, day) => {
    if (!best || day.count > best.count) return day;
    return best;
  }, undefined);
  return { totalAnswers, activeDays: days.length, ...(bestDay ? { bestDay } : {}) };
}
