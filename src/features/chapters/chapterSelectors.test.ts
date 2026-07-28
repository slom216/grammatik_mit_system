import { beforeEach, describe, expect, it } from 'vitest';
import {
  groupBySection,
  matchesFilter,
  selectAvailableCheckpoints,
  selectChapterCards,
  selectContinueChapter,
  selectCourseCompletion,
  selectLevelProgress,
  selectNextChapter,
} from './chapterSelectors';
import { useProgressStore } from '../progress/progressStore';
import { summarizeSession } from '../practice/scoring';

function masterChapter(chapterNumber: number) {
  const summary = summarizeSession(
    [
      {
        exerciseId: 'x',
        type: 'textInput',
        attempts: 1,
        outcome: 'correctFirstAttempt',
        score: 1,
        submittedAnswers: [],
      },
    ],
    1,
  );
  useProgressStore.getState().recordSessionResult({
    chapterNumber,
    summary,
    mastery: { passingPercent: 80, minimumAnswered: 1, requiredCorrectTextInputs: 1 },
  });
}

describe('chapter selectors', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useProgressStore.getState().resetProgress();
  });

  it('builds a card for every registry chapter, with no demo chapter', () => {
    const cards = selectChapterCards(useProgressStore.getState());
    expect(cards).toHaveLength(85);
    expect(cards.some((card) => card.isDemo)).toBe(false);
    expect(cards.filter((card) => card.available)).toHaveLength(80);
  });

  it('groups chapters by section, without a demo group', () => {
    const groups = groupBySection(selectChapterCards(useProgressStore.getState()));
    expect(groups.some((group) => group.section.id === 'demo')).toBe(false);
    expect(groups[0]?.section.id).toBe('verbs-1');
    expect(groups.reduce((sum, group) => sum + group.chapters.length, 0)).toBe(85);
  });

  it('filters by level and status', () => {
    const cards = selectChapterCards(useProgressStore.getState());
    const a1 = cards.filter((card) => matchesFilter(card, 'A1'));
    expect(a1.every((card) => card.level === 'A1')).toBe(true);
    expect(cards.filter((card) => matchesFilter(card, 'all'))).toHaveLength(85);
    expect(cards.filter((card) => matchesFilter(card, 'mastered'))).toHaveLength(0);
    expect(cards.filter((card) => matchesFilter(card, 'notStarted'))).toHaveLength(85);
  });

  it('reflects mastery in the filters and level statistics', () => {
    masterChapter(1);

    const cards = selectChapterCards(useProgressStore.getState());
    expect(cards.filter((card) => matchesFilter(card, 'mastered'))).toHaveLength(1);

    const levels = selectLevelProgress(useProgressStore.getState());
    const a1 = levels.find((level) => level.level === 'A1');
    expect(a1?.mastered).toBe(1);
    expect(a1?.completed).toBe(1);

    const completion = selectCourseCompletion(useProgressStore.getState());
    expect(completion.totalChapters).toBe(85);
    expect(completion.completedChapters).toBe(1);
    expect(completion.masteredChapters).toBe(1);
  });

  it('marks a chapter as review due when an exercise is due', () => {
    useProgressStore.getState().recordAttempt({
      exerciseId: 'ch02-ex-01',
      chapterNumber: 2,
      outcome: 'incorrect',
      now: new Date('2026-03-01T09:00:00.000Z'),
    });

    const cards = selectChapterCards(
      useProgressStore.getState(),
      new Date('2026-03-03T09:00:00.000Z'),
    );
    expect(cards.find((card) => card.number === 2)?.reviewDue).toBe(true);
    expect(cards.filter((card) => matchesFilter(card, 'reviewDue'))).toHaveLength(1);
  });

  it('suggests the first available chapter to continue while nothing has progress', () => {
    expect(selectContinueChapter(useProgressStore.getState())?.number).toBe(1);
  });

  it('prefers the last opened chapter when it still has content', () => {
    useProgressStore.getState().setLastOpenedChapter(2);
    expect(selectContinueChapter(useProgressStore.getState())?.number).toBe(2);
  });

  it('finds the next chapter with content after the given one', () => {
    expect(selectNextChapter(1)?.number).toBe(2);
  });

  it('finds the next chapter with content across a phase boundary', () => {
    expect(selectNextChapter(10)?.number).toBe(11);
    expect(selectNextChapter(20)?.number).toBe(21);
    expect(selectNextChapter(30)?.number).toBe(31);
    expect(selectNextChapter(40)?.number).toBe(41);
    expect(selectNextChapter(50)?.number).toBe(51);
    expect(selectNextChapter(60)?.number).toBe(61);
    expect(selectNextChapter(70)?.number).toBe(71);
  });

  it('has no next chapter after the last chapter with content', () => {
    expect(selectNextChapter(80)).toBeUndefined();
  });

  it('lists the chapters 21-30, 51-60, 61-70, and 71-80 checkpoints now that their whole ranges have content', () => {
    const checkpoints = selectAvailableCheckpoints();
    expect(checkpoints).toContainEqual({
      id: 'checkpoint-21-30',
      title: 'Chapters 21-30',
      from: 21,
      to: 30,
    });
    expect(checkpoints).toContainEqual({
      id: 'checkpoint-51-60',
      title: 'Chapters 51-60',
      from: 51,
      to: 60,
    });
    expect(checkpoints).toContainEqual({
      id: 'checkpoint-61-70',
      title: 'Chapters 61-70',
      from: 61,
      to: 70,
    });
    expect(checkpoints).toContainEqual({
      id: 'checkpoint-71-80',
      title: 'Chapters 71-80',
      from: 71,
      to: 80,
    });
    expect(checkpoints).toContainEqual({
      id: 'checkpoint-b1-clause-connections',
      title: 'B1 Clause Connections (Ch. 72-80)',
      from: 72,
      to: 80,
    });
  });
});
