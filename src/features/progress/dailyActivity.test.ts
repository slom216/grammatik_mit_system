import { describe, expect, it } from 'vitest';
import {
  buildActivityCalendar,
  buildMonthGrid,
  selectActivitySummary,
  selectChapterCompletionsByDay,
  selectDayDetail,
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

describe('buildMonthGrid', () => {
  // March 2026 starts on a Sunday, so the first row is padded with six days of
  // February — the awkward case for a Monday-first grid.
  const march = new Date(2026, 2, 15);

  it('lays the month out as Monday-first whole weeks', () => {
    const weeks = buildMonthGrid(march, {}, {});

    expect(weeks).toHaveLength(6);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(weeks[0]?.[0]?.date).toBe('2026-02-23');
    expect(weeks[0]?.[6]?.date).toBe('2026-03-01');
  });

  it('marks the padding days as outside the month', () => {
    const weeks = buildMonthGrid(march, {}, {});

    expect(weeks[0]?.[0]?.inMonth).toBe(false);
    expect(weeks[0]?.[6]?.inMonth).toBe(true);
    expect(weeks[5]?.[6]?.inMonth).toBe(false);
  });

  it('puts each day’s answers, time and chapters on the right date', () => {
    const weeks = buildMonthGrid(
      march,
      { '2026-03-10': 24 },
      {
        '2026-03-10': {
          ms: 1_080_000,
          chapters: { 7: { answers: 10, ms: 380_000 }, 3: { answers: 14, ms: 700_000 } },
        },
      },
    );
    const day = weeks.flat().find((entry) => entry.date === '2026-03-10');

    expect(day).toMatchObject({ answers: 24, ms: 1_080_000, inMonth: true });
    expect(day?.chapterNumbers).toEqual([3, 7]);
  });
});

describe('selectDayDetail', () => {
  it('splits a day between its chapters and mixed review', () => {
    const detail = selectDayDetail(
      '2026-03-10',
      { '2026-03-10': 24 },
      {
        '2026-03-10': {
          ms: 1_080_000,
          chapters: { 3: { answers: 14, ms: 700_000 }, 7: { answers: 10, ms: 300_000 } },
        },
      },
    );

    expect(detail.answers).toBe(24);
    expect(detail.chapters.map((chapter) => chapter.chapterNumber)).toEqual([3, 7]);
    // 1 080 000 counted, 1 000 000 credited to chapters: the rest is mixed.
    expect(detail.mixedMs).toBe(80_000);
  });

  it('reports an empty day rather than throwing', () => {
    expect(selectDayDetail('2026-03-10', {}, {})).toEqual({
      date: '2026-03-10',
      answers: 0,
      ms: 0,
      chapters: [],
      mixedMs: 0,
    });
  });
});
