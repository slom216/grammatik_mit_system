import { beforeEach, describe, expect, it } from 'vitest';
import {
  groupBySection,
  matchesFilter,
  matchesQuery,
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

  it('builds a card for every registry chapter, without loading chapter content', () => {
    const cards = selectChapterCards(useProgressStore.getState());
    expect(cards).toHaveLength(85);
    expect(cards.filter((card) => card.available)).toHaveLength(85);
    // Comes from the registry now, not from the chapter body.
    expect(cards.every((card) => card.estimatedMinutes > 0)).toBe(true);
  });

  it('groups chapters by section', () => {
    const groups = groupBySection(selectChapterCards(useProgressStore.getState()));
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

  it('counts cumulative coverage per chapter against the registry total', () => {
    const record = useProgressStore.getState().recordAttempt;
    record({
      exerciseId: 'ch01-ex-01',
      chapterNumber: 1,
      outcome: 'correctFirstAttempt',
    });
    record({
      exerciseId: 'ch01-ex-02',
      chapterNumber: 1,
      outcome: 'correctSecondAttempt',
    });
    record({ exerciseId: 'ch01-ex-03', chapterNumber: 1, outcome: 'revealed' });
    record({
      exerciseId: 'ch02-ex-01',
      chapterNumber: 2,
      outcome: 'correctFirstAttempt',
    });

    const cards = selectChapterCards(useProgressStore.getState());
    const first = cards.find((card) => card.number === 1);
    // The revealed one does not count; the total comes from the registry, which
    // content validation keeps in step with the chapter body.
    expect(first?.coveredCount).toBe(2);
    expect(first?.exerciseCount).toBe(59);
    expect(cards.find((card) => card.number === 2)?.coveredCount).toBe(1);
    expect(cards.find((card) => card.number === 3)?.coveredCount).toBe(0);
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
    expect(selectNextChapter(80)?.number).toBe(81);
  });

  it('has no next chapter after the last chapter with content', () => {
    expect(selectNextChapter(85)).toBeUndefined();
  });

  it('lists the chapters 21-30, 51-60, 61-70, 71-80, and 81-85 checkpoints now that their whole ranges have content', () => {
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
    expect(checkpoints).toContainEqual({
      id: 'checkpoint-81-85',
      title: 'Chapters 81-85',
      from: 81,
      to: 85,
    });
  });

  it('offers a checkpoint for the opening chapters', () => {
    const checkpoints = selectAvailableCheckpoints();
    expect(checkpoints).toContainEqual({
      id: 'checkpoint-1-10',
      title: 'Chapters 1-10',
      from: 1,
      to: 10,
    });
    expect(checkpoints).toContainEqual({
      id: 'checkpoint-11-20',
      title: 'Chapters 11-20',
      from: 11,
      to: 20,
    });
  });
});

describe('matchesQuery', () => {
  const cards = () => selectChapterCards(useProgressStore.getState());
  const numbersMatching = (query: string) =>
    cards()
      .filter((card) => matchesQuery(card, query))
      .map((card) => card.number);

  it('keeps every chapter for an empty query', () => {
    expect(numbersMatching('   ')).toHaveLength(85);
  });

  it('matches a title fragment regardless of case', () => {
    // Chapter 21 is "Personal Pronouns in the Accusative and Dative", so it
    // matches this fragment on its title too.
    expect(numbersMatching('personal pronouns')).toEqual([1, 21]);
    expect(numbersMatching('konjunktiv')).toEqual(numbersMatching('Konjunktiv'));
  });

  it('matches an exact chapter number and level', () => {
    expect(numbersMatching('19')).toEqual([19]);
    expect(numbersMatching('B1').length).toBeGreaterThan(0);
  });

  // The point of mirroring tags into the registry: a grammar term finds the
  // chapters that teach it even when no title contains the word.
  it('finds chapters by a grammar topic missing from their titles', () => {
    const matches = numbersMatching('dative');
    expect(matches.length).toBeGreaterThan(1);
    expect(
      cards()
        .filter((card) => matches.includes(card.number))
        .every((card) => card.tags.some((tag) => tag.includes('dative'))),
    ).toBe(true);
  });

  it('returns nothing for a term that appears nowhere', () => {
    expect(numbersMatching('zzz-not-a-topic')).toEqual([]);
  });
});
