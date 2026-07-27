import { beforeEach, describe, expect, it } from 'vitest';
import {
  selectChapterProgress,
  selectDueHistories,
  useProgressStore,
} from './progressStore';
import { summarizeSession } from '../practice/scoring';
import type { ExerciseAttemptRecord } from '../../schemas/progressSchema';
import type { MasteryRule } from '../../schemas/chapterSchema';

const mastery: MasteryRule = {
  passingPercent: 80,
  minimumAnswered: 4,
  requiredCorrectTextInputs: 2,
};

function perfectRecords(): ExerciseAttemptRecord[] {
  return Array.from({ length: 4 }, (_unused, index) => ({
    exerciseId: `e-${index}`,
    type: index < 2 ? ('singleChoice' as const) : ('textInput' as const),
    attempts: 1,
    outcome: 'correctFirstAttempt' as const,
    score: 1,
    submittedAnswers: ['ok'],
  }));
}

describe('progressStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useProgressStore.getState().resetProgress();
  });

  it('marks a chapter as in progress on the first answer', () => {
    useProgressStore.getState().recordAttempt({
      exerciseId: 'demo-ex-01',
      chapterNumber: 0,
      outcome: 'incorrect',
    });

    const progress = selectChapterProgress(useProgressStore.getState(), 0);
    expect(progress.status).toBe('inProgress');
    expect(
      useProgressStore.getState().exerciseHistory['demo-ex-01']?.timesIncorrect,
    ).toBe(1);
  });

  it('puts a wrong answer into the review queue', () => {
    useProgressStore.getState().recordAttempt({
      exerciseId: 'demo-ex-01',
      chapterNumber: 0,
      outcome: 'incorrect',
      now: new Date('2026-03-01T09:00:00.000Z'),
    });

    const due = selectDueHistories(
      useProgressStore.getState(),
      new Date('2026-03-02T09:00:00.000Z'),
    );
    expect(due.map((history) => history.exerciseId)).toEqual(['demo-ex-01']);
  });

  it('records a mastered session', () => {
    const summary = summarizeSession(perfectRecords(), 4);
    const result = useProgressStore
      .getState()
      .recordSessionResult({ chapterNumber: 0, summary, mastery });

    expect(result.mastered).toBe(true);
    const progress = selectChapterProgress(useProgressStore.getState(), 0);
    expect(progress.status).toBe('mastered');
    expect(progress.bestScorePercent).toBe(100);
    expect(progress.attempts).toBe(1);
    expect(progress.completedAt).toBeDefined();
  });

  it('keeps the best score when a later session is weaker', () => {
    const store = useProgressStore.getState();
    store.recordSessionResult({
      chapterNumber: 0,
      summary: summarizeSession(perfectRecords(), 4),
      mastery,
    });
    store.recordSessionResult({
      chapterNumber: 0,
      summary: summarizeSession(perfectRecords().slice(0, 2), 4),
      mastery,
    });

    const progress = selectChapterProgress(useProgressStore.getState(), 0);
    expect(progress.bestScorePercent).toBe(100);
    expect(progress.latestScorePercent).toBe(50);
    expect(progress.status).toBe('mastered');
  });

  it('does not master a chapter with an unfinished session', () => {
    const summary = summarizeSession(perfectRecords().slice(0, 3), 4);
    const result = useProgressStore
      .getState()
      .recordSessionResult({ chapterNumber: 0, summary, mastery });

    expect(result.mastered).toBe(false);
    expect(selectChapterProgress(useProgressStore.getState(), 0).status).toBe(
      'inProgress',
    );
  });

  it('survives a page refresh', () => {
    const store = useProgressStore.getState();
    store.recordSessionResult({
      chapterNumber: 0,
      summary: summarizeSession(perfectRecords(), 4),
      mastery,
    });
    store.setLastOpenedChapter(0);

    // Simulate a reload: wipe the in-memory state, then hydrate from storage.
    useProgressStore.setState({ chapters: {}, exerciseHistory: {}, hydrated: false });
    useProgressStore.getState().hydrate();

    const state = useProgressStore.getState();
    expect(state.hydrated).toBe(true);
    expect(state.lastOpenedChapter).toBe(0);
    expect(selectChapterProgress(state, 0).bestScorePercent).toBe(100);
  });

  it('toggles bookmarks and clears everything on reset', () => {
    const store = useProgressStore.getState();
    store.toggleBookmark(0);
    expect(selectChapterProgress(useProgressStore.getState(), 0).bookmarked).toBe(true);

    useProgressStore.getState().resetProgress();
    expect(useProgressStore.getState().chapters).toEqual({});
    expect(window.localStorage.getItem('grammatik-mit-system:progress')).toBeNull();
  });
});
