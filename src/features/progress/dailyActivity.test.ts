import { describe, expect, it } from 'vitest';
import {
  buildActivityCalendar,
  selectActivitySummary,
  selectChapterCompletionsByDay,
} from './dailyActivity';
import { createChapterProgress } from './progressStore';
import type { ChapterProgress } from '../../schemas/progressSchema';

function completedOn(chapterNumber: number, isoDate: string): ChapterProgress {
  return {
    ...createChapterProgress(chapterNumber),
    status: 'completed',
    completedAt: `${isoDate}T09:30:00.000Z`,
  };
}

describe('selectChapterCompletionsByDay', () => {
  it('is empty without any completed chapters', () => {
    const chapters = { 1: createChapterProgress(1) };
    expect(selectChapterCompletionsByDay(chapters).size).toBe(0);
  });

  it('groups multiple chapters completed on the same day', () => {
    const chapters = {
      1: completedOn(1, '2026-03-10'),
      2: completedOn(2, '2026-03-10'),
      3: completedOn(3, '2026-03-09'),
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
      1: completedOn(1, '2026-03-10'),
      2: createChapterProgress(2),
    };
    expect(selectChapterCompletionsByDay(chapters).size).toBe(1);
  });
});

describe('buildActivityCalendar', () => {
  it('produces a full Monday-first grid with no gaps', () => {
    const now = new Date('2026-03-10T12:00:00.000Z'); // a Tuesday
    const byDay = selectChapterCompletionsByDay({ 1: completedOn(1, '2026-03-10') });

    const weeks = buildActivityCalendar(byDay, 2, now);

    expect(weeks).toHaveLength(2);
    weeks.forEach((week) => expect(week.days).toHaveLength(7));

    const lastWeek = weeks[weeks.length - 1]!;
    expect(lastWeek.days[0]!.date).toBe('2026-03-09'); // Monday
    expect(lastWeek.days[1]!.date).toBe('2026-03-10'); // Tuesday
    expect(lastWeek.days[1]!.count).toBe(1);
    expect(lastWeek.days[6]!.date).toBe('2026-03-15'); // Sunday
    expect(lastWeek.days[6]!.count).toBe(0);
  });
});

describe('selectActivitySummary', () => {
  it('summarizes totals and the busiest day', () => {
    const byDay = selectChapterCompletionsByDay({
      1: completedOn(1, '2026-03-10'),
      2: completedOn(2, '2026-03-10'),
      3: completedOn(3, '2026-03-09'),
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
