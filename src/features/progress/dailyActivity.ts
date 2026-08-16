import type { ChapterProgress, DayLogEntry } from '../../schemas/progressSchema';
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

export type HeatLevel = 0 | 1 | 2 | 3 | 4;

/**
 * A session runs to dozens of exercises, so the shade tracks bands rather than
 * the raw count — otherwise every practice day would sit at maximum.
 */
export function heatLevel(count: number): HeatLevel {
  if (count <= 0) return 0;
  if (count < 5) return 1;
  if (count < 15) return 2;
  if (count < 30) return 3;
  return 4;
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

/* ------------------------------------------------------------------ */
/* Month calendar                                                      */
/* ------------------------------------------------------------------ */

export interface CalendarDay {
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  /** False for the days that pad the first and last week of the month. */
  inMonth: boolean;
  /** Exercises answered, from `answersByDay`. */
  answers: number;
  /** Practice time, from the day log. */
  ms: number;
  /** Chapters practised that day, ascending. */
  chapterNumbers: number[];
}

/**
 * One month as Monday-first whole weeks. The days either side of the month are
 * kept rather than blanked so every row has seven cells, and marked `inMonth:
 * false` so the page can dim them.
 */
export function buildMonthGrid(
  month: Date,
  answersByDay: Record<string, number>,
  dayLog: Record<string, DayLogEntry>,
): CalendarDay[][] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const leadingPad = (first.getDay() + 6) % 7;
  const gridStart = addDays(first, -leadingPad);
  // Day 0 of the next month is the last day of this one.
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const weeks = Math.ceil((leadingPad + daysInMonth) / 7);

  const result: CalendarDay[][] = [];
  for (let week = 0; week < weeks; week += 1) {
    const days: CalendarDay[] = [];
    for (let index = 0; index < 7; index += 1) {
      const date = addDays(gridStart, week * 7 + index);
      const key = toDayKey(date);
      const entry = dayLog[key];
      days.push({
        date: key,
        inMonth: date.getMonth() === month.getMonth(),
        answers: answersByDay[key] ?? 0,
        ms: entry?.ms ?? 0,
        chapterNumbers: Object.keys(entry?.chapters ?? {})
          .map(Number)
          .sort((a, b) => a - b),
      });
    }
    result.push(days);
  }
  return result;
}

export interface DayChapterDetail {
  chapterNumber: number;
  answers: number;
  ms: number;
}

export interface DayDetail {
  date: string;
  answers: number;
  ms: number;
  chapters: DayChapterDetail[];
  /**
   * Time on the day that belongs to no single chapter — a cumulative review
   * mixes several, so its minutes only ever reach the day total.
   */
  mixedMs: number;
}

/** Everything known about one day, ready to render. */
export function selectDayDetail(
  date: string,
  answersByDay: Record<string, number>,
  dayLog: Record<string, DayLogEntry>,
): DayDetail {
  const entry = dayLog[date];
  const chapters = Object.entries(entry?.chapters ?? {})
    .map(([chapterNumber, work]) => ({ chapterNumber: Number(chapterNumber), ...work }))
    .sort((a, b) => a.chapterNumber - b.chapterNumber);
  const chapterMs = chapters.reduce((sum, chapter) => sum + chapter.ms, 0);
  const ms = entry?.ms ?? 0;
  return {
    date,
    answers: answersByDay[date] ?? 0,
    ms,
    chapters,
    mixedMs: Math.max(0, ms - chapterMs),
  };
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
