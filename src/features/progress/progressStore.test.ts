import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PROGRESS_STORAGE_KEY } from './progressPersistence';
import {
  flushProgress,
  selectChapterProgress,
  selectCoveredExerciseIds,
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

  it('counts an exercise as covered only once it has been answered correctly', () => {
    const record = useProgressStore.getState().recordAttempt;
    record({ exerciseId: 'ch1-ex-01', chapterNumber: 1, outcome: 'correctFirstAttempt' });
    record({
      exerciseId: 'ch1-ex-02',
      chapterNumber: 1,
      outcome: 'correctSecondAttempt',
    });
    record({ exerciseId: 'ch1-ex-03', chapterNumber: 1, outcome: 'incorrect' });
    record({ exerciseId: 'ch1-ex-04', chapterNumber: 1, outcome: 'revealed' });
    record({ exerciseId: 'ch2-ex-01', chapterNumber: 2, outcome: 'correctFirstAttempt' });

    const history = useProgressStore.getState().exerciseHistory;
    expect([...selectCoveredExerciseIds(history, 1)].sort()).toEqual([
      'ch1-ex-01',
      'ch1-ex-02',
    ]);
    // Another chapter's correct answers never leak in.
    expect([...selectCoveredExerciseIds(history, 2)]).toEqual(['ch2-ex-01']);
  });

  it('keeps coverage once earned, even after a later wrong answer', () => {
    const record = useProgressStore.getState().recordAttempt;
    record({ exerciseId: 'ch1-ex-01', chapterNumber: 1, outcome: 'correctFirstAttempt' });
    record({ exerciseId: 'ch1-ex-01', chapterNumber: 1, outcome: 'incorrect' });

    const history = useProgressStore.getState().exerciseHistory;
    expect(selectCoveredExerciseIds(history, 1).has('ch1-ex-01')).toBe(true);
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

  it('logs which chapter was practised on the day it was answered', () => {
    const day = new Date(2026, 2, 10, 20, 0);
    const store = useProgressStore.getState();
    store.recordAttempt({
      exerciseId: 'demo-ex-01',
      chapterNumber: 3,
      outcome: 'correctFirstAttempt',
      now: day,
    });
    store.recordAttempt({
      exerciseId: 'demo-ex-02',
      chapterNumber: 7,
      outcome: 'incorrect',
      now: day,
    });

    const entry = useProgressStore.getState().dayLog['2026-03-10'];
    expect(entry?.chapters[3]?.answers).toBe(1);
    expect(entry?.chapters[7]?.answers).toBe(1);
    expect(useProgressStore.getState().answersByDay['2026-03-10']).toBe(2);
  });

  it('logs study time against both the day and the chapter', () => {
    const day = new Date(2026, 2, 10, 20, 0);
    useProgressStore.getState().addStudyTime(3, 60_000, day);
    useProgressStore.getState().addStudyTime(3, 30_000, day);

    const state = useProgressStore.getState();
    expect(state.dayLog['2026-03-10']).toEqual({
      ms: 90_000,
      chapters: { 3: { answers: 0, ms: 90_000 } },
    });
    expect(selectChapterProgress(state, 3).studyMs).toBe(90_000);
  });

  it('keeps time from a cumulative review out of any chapter', () => {
    const day = new Date(2026, 2, 10, 20, 0);
    useProgressStore.getState().addStudyTime(3, 60_000, day);
    useProgressStore.getState().addStudyTime(null, 20_000, day);

    const entry = useProgressStore.getState().dayLog['2026-03-10'];
    // The day total carries it; the difference is the mixed-review time.
    expect(entry?.ms).toBe(80_000);
    expect(entry?.chapters[3]?.ms).toBe(60_000);
    expect(useProgressStore.getState().otherStudyMs).toBe(20_000);
  });

  it('survives a page refresh', () => {
    const store = useProgressStore.getState();
    store.recordSessionResult({
      chapterNumber: 0,
      summary: summarizeSession(perfectRecords(), 4),
      mastery,
    });
    store.setLastOpenedChapter(0);

    // Simulate a reload: writes are on a timer, and a real unload flushes them
    // before the page goes away.
    flushProgress();
    useProgressStore.setState({ chapters: {}, exerciseHistory: {}, hydrated: false });
    useProgressStore.getState().hydrate();

    const state = useProgressStore.getState();
    expect(state.hydrated).toBe(true);
    expect(state.lastOpenedChapter).toBe(0);
    expect(selectChapterProgress(state, 0).bestScorePercent).toBe(100);
  });

  describe('storage writes', () => {
    /** Counts the writes to the progress key only; other stores share storage. */
    function watchWrites() {
      const spy = vi.spyOn(Storage.prototype, 'setItem');
      return () => spy.mock.calls.filter(([key]) => key === PROGRESS_STORAGE_KEY).length;
    }

    afterEach(() => {
      vi.restoreAllMocks();
      vi.useRealTimers();
    });

    it('coalesces a burst of answers into a single write', () => {
      vi.useFakeTimers();
      const writes = watchWrites();

      for (let index = 0; index < 10; index += 1) {
        useProgressStore.getState().recordAttempt({
          exerciseId: `burst-ex-${index}`,
          chapterNumber: 0,
          outcome: 'correctFirstAttempt',
        });
      }
      expect(writes()).toBe(0);

      vi.runAllTimers();
      expect(writes()).toBe(1);

      // The one write has to carry the whole burst, not just the first answer.
      useProgressStore.setState({ exerciseHistory: {}, hydrated: false });
      useProgressStore.getState().hydrate();
      expect(Object.keys(useProgressStore.getState().exerciseHistory)).toHaveLength(10);
    });

    it('writes immediately when the tab is going away', () => {
      vi.useFakeTimers();
      const writes = watchWrites();

      useProgressStore.getState().recordAttempt({
        exerciseId: 'unload-ex',
        chapterNumber: 0,
        outcome: 'correctFirstAttempt',
      });
      window.dispatchEvent(new Event('pagehide'));

      expect(writes()).toBe(1);
      // And the timer must not fire a second, redundant write afterwards.
      vi.runAllTimers();
      expect(writes()).toBe(1);
    });

    it('does not let a queued write resurrect progress after a reset', () => {
      vi.useFakeTimers();

      useProgressStore.getState().recordAttempt({
        exerciseId: 'doomed-ex',
        chapterNumber: 0,
        outcome: 'correctFirstAttempt',
      });
      useProgressStore.getState().resetProgress();
      vi.runAllTimers();

      useProgressStore.getState().hydrate();
      expect(useProgressStore.getState().exerciseHistory).toEqual({});
    });
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
