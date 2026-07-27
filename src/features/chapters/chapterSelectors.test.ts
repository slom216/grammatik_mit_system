import { beforeEach, describe, expect, it } from 'vitest';
import {
  groupBySection,
  matchesFilter,
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

  it('builds a card for every registry chapter plus the demo chapter', () => {
    const cards = selectChapterCards(useProgressStore.getState());
    expect(cards).toHaveLength(86);
    expect(cards[0]?.isDemo).toBe(true);
    expect(cards.filter((card) => card.available)).toHaveLength(1);
  });

  it('groups chapters by section with the demo first', () => {
    const groups = groupBySection(selectChapterCards(useProgressStore.getState()));
    expect(groups[0]?.section.id).toBe('demo');
    expect(groups[1]?.section.id).toBe('verbs-1');
    expect(groups.reduce((sum, group) => sum + group.chapters.length, 0)).toBe(86);
  });

  it('filters by level and status', () => {
    const cards = selectChapterCards(useProgressStore.getState());
    const a1 = cards.filter((card) => matchesFilter(card, 'A1'));
    expect(a1.every((card) => card.level === 'A1')).toBe(true);
    expect(cards.filter((card) => matchesFilter(card, 'all'))).toHaveLength(86);
    expect(cards.filter((card) => matchesFilter(card, 'mastered'))).toHaveLength(0);
    expect(cards.filter((card) => matchesFilter(card, 'notStarted'))).toHaveLength(86);
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
      exerciseId: 'demo-ex-01',
      chapterNumber: 0,
      outcome: 'incorrect',
      now: new Date('2026-03-01T09:00:00.000Z'),
    });

    const cards = selectChapterCards(
      useProgressStore.getState(),
      new Date('2026-03-03T09:00:00.000Z'),
    );
    expect(cards.find((card) => card.number === 0)?.reviewDue).toBe(true);
    expect(cards.filter((card) => matchesFilter(card, 'reviewDue'))).toHaveLength(1);
  });

  it('suggests the demo chapter to continue while nothing else has content', () => {
    expect(selectContinueChapter(useProgressStore.getState())?.number).toBe(0);
  });

  it('prefers the last opened chapter when it still has content', () => {
    useProgressStore.getState().setLastOpenedChapter(0);
    expect(selectContinueChapter(useProgressStore.getState())?.number).toBe(0);
  });

  it('has no next chapter while only the demo chapter exists', () => {
    expect(selectNextChapter(0)).toBeUndefined();
  });
});
