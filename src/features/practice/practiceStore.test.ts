import { beforeEach, describe, expect, it } from 'vitest';
import {
  selectAnsweredCount,
  selectCurrentExerciseId,
  selectIsLastExercise,
  usePracticeStore,
} from './practiceStore';
import { useProgressStore } from '../progress/progressStore';
import {
  makeChapter,
  makeSingleChoice,
  makeTextInput,
} from '../../test/fixtures/chapterFixture';

const chapter = makeChapter({
  exercises: [
    makeSingleChoice(1, { id: 'ch1-ex-01' }),
    makeSingleChoice(2, { id: 'ch1-ex-02' }),
    makeTextInput(3, { id: 'ch1-ex-03' }),
  ],
});

const first = chapter.exercises[0] as ReturnType<typeof makeSingleChoice>;
const text = chapter.exercises[2] as ReturnType<typeof makeTextInput>;

function start() {
  usePracticeStore.getState().startSession(chapter, { shuffleOptions: false });
}

describe('practiceStore sessions', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useProgressStore.getState().resetProgress();
    usePracticeStore.getState().exitSession();
  });

  it('starts a session with every exercise, in chapter order', () => {
    start();
    const state = usePracticeStore.getState();

    expect(state.status).toBe('active');
    expect(state.mode).toBe('chapter');
    expect(state.exerciseIds).toEqual(['ch1-ex-01', 'ch1-ex-02', 'ch1-ex-03']);
    expect(selectCurrentExerciseId(state)).toBe('ch1-ex-01');
    expect(selectIsLastExercise(state)).toBe(false);
  });

  it('limits a session to the given exercise ids', () => {
    usePracticeStore
      .getState()
      .startSession(chapter, { mode: 'review', exerciseIds: ['ch1-ex-03'] });

    expect(usePracticeStore.getState().exerciseIds).toEqual(['ch1-ex-03']);
    expect(selectIsLastExercise(usePracticeStore.getState())).toBe(true);
  });

  it('keeps the order the caller asked for', () => {
    // A chapter session leads with what the learner has not covered yet, which
    // is not the authored order — the store must not re-sort it away.
    usePracticeStore
      .getState()
      .startSession(chapter, { exerciseIds: ['ch1-ex-03', 'ch1-ex-01', 'ch1-ex-02'] });

    expect(usePracticeStore.getState().exerciseIds).toEqual([
      'ch1-ex-03',
      'ch1-ex-01',
      'ch1-ex-02',
    ]);
  });

  it('drops unknown and repeated ids from the given order', () => {
    usePracticeStore.getState().startSession(chapter, {
      exerciseIds: ['ch1-ex-02', 'ch9-ex-01', 'ch1-ex-02', 'ch1-ex-01'],
    });

    expect(usePracticeStore.getState().exerciseIds).toEqual(['ch1-ex-02', 'ch1-ex-01']);
  });

  it('scores a correct first attempt with a full point', () => {
    start();
    const feedback = usePracticeStore
      .getState()
      .submitSingleChoice(first, first.correctOptionId);

    expect(feedback.kind).toBe('correct');
    expect(usePracticeStore.getState().results['ch1-ex-01']?.score).toBe(1);
    // The attempt is reported to the progress store as it happens.
    expect(useProgressStore.getState().exerciseHistory['ch1-ex-01']?.timesCorrect).toBe(
      1,
    );
  });

  it('offers one retry, then resolves the exercise', () => {
    start();
    const wrong = first.options.find((option) => option.id !== first.correctOptionId);

    const firstTry = usePracticeStore
      .getState()
      .submitSingleChoice(first, wrong?.id ?? '');
    expect(firstTry.canRetry).toBe(true);
    expect(usePracticeStore.getState().results['ch1-ex-01']).toBeUndefined();

    const secondTry = usePracticeStore
      .getState()
      .submitSingleChoice(first, wrong?.id ?? '');
    expect(secondTry.canRetry).toBe(false);
    expect(secondTry.expectedAnswer).toBeDefined();
    expect(usePracticeStore.getState().results['ch1-ex-01']?.outcome).toBe('incorrect');
  });

  it('scores a correct second attempt with half a point', () => {
    start();
    const wrong = first.options.find((option) => option.id !== first.correctOptionId);
    usePracticeStore.getState().submitSingleChoice(first, wrong?.id ?? '');
    usePracticeStore.getState().submitSingleChoice(first, first.correctOptionId);

    expect(usePracticeStore.getState().results['ch1-ex-01']?.score).toBe(0.5);
  });

  it('accepts a text answer', () => {
    start();
    usePracticeStore.getState().goToNext();
    usePracticeStore.getState().goToNext();

    expect(usePracticeStore.getState().submitTextAnswer(text, 'bist').kind).toBe(
      'correct',
    );
    expect(usePracticeStore.getState().results['ch1-ex-03']?.outcome).toBe(
      'correctFirstAttempt',
    );
  });

  it('reveals an answer without scoring it', () => {
    start();
    const feedback = usePracticeStore.getState().revealAnswer(first);

    expect(feedback.kind).toBe('revealed');
    expect(usePracticeStore.getState().results['ch1-ex-01']?.score).toBe(0);
  });

  it('walks forward and stops at the last exercise', () => {
    start();
    usePracticeStore.getState().goToNext();
    usePracticeStore.getState().goToNext();
    usePracticeStore.getState().goToNext();

    expect(usePracticeStore.getState().currentIndex).toBe(2);
    expect(selectIsLastExercise(usePracticeStore.getState())).toBe(true);
  });

  it('counts answered exercises for the progress bar', () => {
    start();
    expect(selectAnsweredCount(usePracticeStore.getState())).toBe(0);

    usePracticeStore.getState().submitSingleChoice(first, first.correctOptionId);
    expect(selectAnsweredCount(usePracticeStore.getState())).toBe(1);
  });

  it('summarises the session and records mastery when finished', () => {
    start();
    for (const exercise of chapter.exercises) {
      if (exercise.type === 'singleChoice') {
        usePracticeStore
          .getState()
          .submitSingleChoice(exercise, exercise.correctOptionId);
      } else if (exercise.type === 'textInput') {
        usePracticeStore.getState().submitTextAnswer(exercise, 'bist');
      }
    }

    const summary = usePracticeStore.getState().finish(chapter);

    expect(summary.answeredCount).toBe(3);
    expect(summary.scorePercent).toBe(100);
    expect(usePracticeStore.getState().status).toBe('finished');
    expect(useProgressStore.getState().chapters[1]?.bestScorePercent).toBe(100);
  });

  it('resumes a paused session, and drops it once exited', () => {
    start();
    usePracticeStore.getState().submitSingleChoice(first, first.correctOptionId);
    usePracticeStore.getState().goToNext();
    usePracticeStore.getState().pauseSession();

    expect(usePracticeStore.getState().hasStoredSession(chapter.number)).toBe(true);
    expect(usePracticeStore.getState().resumeSession(chapter)).toBe(true);
    expect(usePracticeStore.getState().currentIndex).toBe(1);
    expect(usePracticeStore.getState().results['ch1-ex-01']?.score).toBe(1);

    usePracticeStore.getState().exitSession();
    expect(usePracticeStore.getState().hasStoredSession(chapter.number)).toBe(false);
    expect(usePracticeStore.getState().resumeSession(chapter)).toBe(false);
  });

  it('does not resume a session belonging to another chapter', () => {
    start();
    usePracticeStore.getState().pauseSession();

    const other = makeChapter({ number: 2 });
    expect(usePracticeStore.getState().resumeSession(other)).toBe(false);
  });
});
