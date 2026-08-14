import { describe, expect, it } from 'vitest';
import {
  buildActivityCalendar,
  selectActivitySummary,
  selectChapterCompletionsByDay,
  selectPracticeSummary,
} from './dailyActivity';
import { createChapterProgress } from './progressStore';
import type { ChapterProgress } from '../../schemas/progressSchema';

/**
 * Built from local date parts rather than a `Z` literal: the app stores a real
 * timestamp and groups it by the learner's own calendar day, so a fixture
 * pinned to UTC would land on the wrong day west of Greenwich.
 */
function completedOn(
  chapterNumber: number,
  year: number,
  month: number,
  day: number,
): ChapterProgress {
  return {
    ...createChapterProgress(chapterNumber),
    status: 'completed',
    completedAt: new Date(year, month - 1, day, 9, 30).toISOString(),
  };
}

describe('selectChapterCompletionsByDay', () => {
  it('is empty without any completed chapters', () => {
    const chapters = { 1: createChapterProgress(1) };
    expect(selectChapterCompletionsByDay(chapters).size).toBe(0);
  });

  it('groups multiple chapters completed on the same day', () => {
    const chapters = {
      1: completedOn(1, 2026, 3, 10),
      2: completedOn(2, 2026, 3, 10),
      3: completedOn(3, 2026, 3, 9),
    };

    const byDay = selectChapterCompletionsByDay(chapters);

    expect(byDay.get('2026-03-10')).toEqual({
      date: '2026-03-10',
      count: 2,
      chapterNumbers: [1, 2],
    });
    expect(byDay.get('2026-03-09')?.count).toBe(1);
  });

  it('ignores chapters that have not been completed yet', () => {
    const chapters = {
      1: completedOn(1, 2026, 3, 10),
      2: createChapterProgress(2),
    };
    expect(selectChapterCompletionsByDay(chapters).size).toBe(1);
  });
});

describe('buildActivityCalendar', () => {
  it('produces a full Monday-first grid with no gaps', () => {
    const now = new Date(2026, 2, 10, 12, 0, 0); // a Tuesday

    const weeks = buildActivityCalendar({ '2026-03-10': 6 }, 2, now);

    expect(weeks).toHaveLength(2);
    weeks.forEach((week) => expect(week.days).toHaveLength(7));

    const lastWeek = weeks[weeks.length - 1]!;
    expect(lastWeek.days[0]!.date).toBe('2026-03-09'); // Monday
    expect(lastWeek.days[1]!.date).toBe('2026-03-10'); // Tuesday
    expect(lastWeek.days[1]!.count).toBe(6);
    expect(lastWeek.days[6]!.date).toBe('2026-03-15'); // Sunday
    expect(lastWeek.days[6]!.count).toBe(0);
  });

  it('starts the grid on a Monday even when today is a Sunday', () => {
    const sunday = new Date(2026, 2, 15, 12, 0, 0);
    const weeks = buildActivityCalendar({}, 1, sunday);

    expect(weeks[0]!.days[0]!.date).toBe('2026-03-09');
    expect(weeks[0]!.days[6]!.date).toBe('2026-03-15');
  });

  it('spans a daylight-saving change without skipping or repeating a day', () => {
    // The EU clocks go forward on 2026-03-29.
    const now = new Date(2026, 2, 31, 12, 0, 0);
    const days = buildActivityCalendar({}, 2, now).flatMap((week) => week.days);

    expect(new Set(days.map((day) => day.date)).size).toBe(days.length);
    expect(days.map((day) => day.date)).toContain('2026-03-29');
  });
});

describe('selectActivitySummary', () => {
  it('summarizes totals and the busiest day', () => {
    const byDay = selectChapterCompletionsByDay({
      1: completedOn(1, 2026, 3, 10),
      2: completedOn(2, 2026, 3, 10),
      3: completedOn(3, 2026, 3, 9),
    });

    const summary = selectActivitySummary(byDay);

    expect(summary.totalCompleted).toBe(3);
    expect(summary.activeDays).toBe(2);
    expect(summary.bestDay).toEqual({
      date: '2026-03-10',
      count: 2,
      chapterNumbers: [1, 2],
    });
  });

  it('has no best day without any activity', () => {
    expect(selectActivitySummary(new Map()).bestDay).toBeUndefined();
  });
});

describe('selectPracticeSummary', () => {
  it('totals answers and finds the busiest day', () => {
    const summary = selectPracticeSummary({
      '2026-03-08': 4,
      '2026-03-09': 21,
      '2026-03-10': 7,
    });

    expect(summary.totalAnswers).toBe(32);
    expect(summary.activeDays).toBe(3);
    expect(summary.bestDay).toEqual({ date: '2026-03-09', count: 21 });
  });

  it('does not count a day with no answers as active', () => {
    const summary = selectPracticeSummary({ '2026-03-08': 0, '2026-03-09': 2 });

    expect(summary.activeDays).toBe(1);
    expect(summary.totalAnswers).toBe(2);
  });

  it('has no best day without any practice', () => {
    expect(selectPracticeSummary({}).bestDay).toBeUndefined();
  });
});
