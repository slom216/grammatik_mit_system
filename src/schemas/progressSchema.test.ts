import { describe, expect, it } from 'vitest';
import { PROGRESS_SCHEMA_VERSION, persistedProgressV4Schema } from './progressSchema';

const history = {
  exerciseId: 'ch07-ex-03',
  chapterNumber: 7,
  timesAnswered: 2,
  timesCorrect: 1,
  timesIncorrect: 1,
  consecutiveCorrect: 1,
  stage: 'learning',
  dueAt: '2026-08-04T10:00:00.000Z',
  lastAnsweredAt: '2026-08-01T10:00:00.000Z',
};

const valid = {
  schemaVersion: PROGRESS_SCHEMA_VERSION,
  chapters: {},
  exerciseHistory: { 'ch07-ex-03': history },
  answersByDay: { '2026-08-01': 2, '2024-02-29': 1 },
  dayLog: { '2026-08-01': { ms: 60_000, chapters: { 7: { answers: 2, ms: 60_000 } } } },
  otherStudyMs: 0,
  lastOpenedChapter: 85,
};

describe('persistedProgressV4Schema', () => {
  it('accepts realistic progress', () => {
    expect(persistedProgressV4Schema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ['a malformed day key', { answersByDay: { '9999-99-99': 1 } }],
    ['a day that does not exist', { answersByDay: { '2026-02-30': 1 } }],
    ['an absurd day count', { answersByDay: { '2026-08-01': 1_000_000_000 } }],
    ['a fractional count', { answersByDay: { '2026-08-01': 1.5 } }],
    ['a bad day-log key', { dayLog: { yesterday: { ms: 0, chapters: {} } } }],
    [
      'a day-log chapter out of range',
      { dayLog: { '2026-08-01': { ms: 0, chapters: { 999: { answers: 1, ms: 0 } } } } },
    ],
    [
      'an unparseable due date',
      { exerciseHistory: { x: { ...history, dueAt: 'not-a-date' } } },
    ],
    [
      'a chapter out of range',
      { exerciseHistory: { x: { ...history, chapterNumber: 999999 } } },
    ],
    ['a negative count', { exerciseHistory: { x: { ...history, timesAnswered: -1 } } }],
    ['a last opened chapter out of range', { lastOpenedChapter: 999999 }],
    ['chapter zero', { lastOpenedChapter: 0 }],
  ])('rejects %s', (_label, patch) => {
    expect(persistedProgressV4Schema.safeParse({ ...valid, ...patch }).success).toBe(
      false,
    );
  });
});
