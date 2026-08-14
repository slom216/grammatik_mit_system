import { describe, expect, it } from 'vitest';
import { selectAchievements, sortAchievements } from './achievements';
import { createChapterProgress } from './progressStore';
import { createHistory } from '../practice/reviewScheduler';
import type { ChapterProgress, ExerciseHistory } from '../../schemas/progressSchema';

const now = new Date(2026, 2, 10, 12, 0, 0);

function mastered(chapterNumber: number): ChapterProgress {
  return { ...createChapterProgress(chapterNumber), status: 'mastered' };
}

function answered(
  id: string,
  timesAnswered: number,
  overrides: Partial<ExerciseHistory> = {},
): ExerciseHistory {
  return {
    ...createHistory(id, 1),
    timesAnswered,
    timesCorrect: timesAnswered,
    ...overrides,
  };
}

function byId(...entries: ExerciseHistory[]): Record<string, ExerciseHistory> {
  return Object.fromEntries(entries.map((entry) => [entry.exerciseId, entry]));
}

const empty = { chapters: {}, exerciseHistory: {}, answersByDay: {}, now };

describe('selectAchievements', () => {
  it('reports nothing earned on a fresh profile', () => {
    const achievements = selectAchievements(empty);

    expect(achievements.length).toBeGreaterThan(0);
    expect(achievements.every((achievement) => !achievement.earned)).toBe(true);
    expect(achievements.every((achievement) => achievement.progress === 0)).toBe(true);
  });

  it('earns the first tier of answers but not the second', () => {
    const achievements = selectAchievements({
      ...empty,
      exerciseHistory: byId(answered('a', 120)),
    });

    const first = achievements.find((a) => a.id === 'answers-100');
    const second = achievements.find((a) => a.id === 'answers-1000');
    expect(first?.earned).toBe(true);
    // Progress is capped at the target, so a bar can never overflow.
    expect(first?.progress).toBe(100);
    expect(second?.earned).toBe(false);
    expect(second?.progress).toBe(120);
  });

  it('counts mastered chapters, ignoring merely completed ones', () => {
    const achievements = selectAchievements({
      ...empty,
      chapters: {
        1: mastered(1),
        2: { ...createChapterProgress(2), status: 'completed' },
      },
    });

    expect(achievements.find((a) => a.id === 'mastered-1')?.earned).toBe(true);
    expect(achievements.find((a) => a.id === 'mastered-10')?.progress).toBe(1);
  });

  it('earns a streak from consecutive practice days', () => {
    const answersByDay: Record<string, number> = {};
    for (let day = 4; day <= 10; day += 1) {
      answersByDay[`2026-03-${String(day).padStart(2, '0')}`] = 5;
    }

    const achievements = selectAchievements({ ...empty, answersByDay });

    expect(achievements.find((a) => a.id === 'streak-7')?.earned).toBe(true);
    expect(achievements.find((a) => a.id === 'streak-30')?.earned).toBe(false);
  });

  it('counts exercises the scheduler has retired', () => {
    const achievements = selectAchievements({
      ...empty,
      exerciseHistory: byId(
        answered('a', 3, { stage: 'stable' }),
        answered('b', 1, { stage: 'review1' }),
      ),
    });

    expect(achievements.find((a) => a.id === 'retired-50')?.progress).toBe(1);
  });
});

describe('sortAchievements', () => {
  it('puts earned ones first, then whichever is closest', () => {
    const sorted = sortAchievements([
      { id: 'far', title: '', description: '', progress: 1, target: 100, earned: false },
      { id: 'done', title: '', description: '', progress: 5, target: 5, earned: true },
      { id: 'near', title: '', description: '', progress: 9, target: 10, earned: false },
    ]);

    expect(sorted.map((a) => a.id)).toEqual(['done', 'near', 'far']);
  });
});
