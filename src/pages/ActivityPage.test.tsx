import { beforeEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { ActivityPage } from './ActivityPage';
import { renderWithRouter } from '../test/helpers/renderWithRouter';
import { useProgressStore } from '../features/progress/progressStore';
import { summarizeSession } from '../features/practice/scoring';
import type { ExerciseAttemptRecord } from '../schemas/progressSchema';
import type { MasteryRule } from '../schemas/chapterSchema';

const mastery: MasteryRule = {
  passingPercent: 80,
  minimumAnswered: 1,
  requiredCorrectTextInputs: 0,
};

function perfectRecord(exerciseId: string): ExerciseAttemptRecord {
  return {
    exerciseId,
    type: 'singleChoice',
    attempts: 1,
    outcome: 'correctFirstAttempt',
    score: 1,
    submittedAnswers: ['ok'],
  };
}

describe('ActivityPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useProgressStore.getState().resetProgress();
  });

  it('prompts to pick a chapter when nothing has been completed yet', async () => {
    await renderWithRouter(<ActivityPage />, { route: '/activity' });

    expect(
      screen.getByRole('heading', { level: 1, name: /activity/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/no chapter has been completed yet/i)).toBeInTheDocument();
  });

  it('lists a day a chapter was completed on', async () => {
    const summary = summarizeSession([perfectRecord('demo-ex-01')], 1);
    useProgressStore.getState().recordSessionResult({
      chapterNumber: 0,
      summary,
      mastery,
      now: new Date('2026-03-10T09:00:00.000Z'),
    });

    await renderWithRouter(<ActivityPage />, { route: '/activity' });

    expect(screen.getByText(/1 chapter completed across 1 day/i)).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /date/i })).toBeInTheDocument();
  });

  it('counts exercises answered, including a day with no chapter completed', async () => {
    const progress = useProgressStore.getState();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    progress.recordAttempt({
      exerciseId: 'demo-ex-01',
      chapterNumber: 0,
      outcome: 'correctFirstAttempt',
      now: yesterday,
    });
    progress.recordAttempt({
      exerciseId: 'demo-ex-02',
      chapterNumber: 0,
      outcome: 'incorrect',
      now: yesterday,
    });
    progress.recordAttempt({
      exerciseId: 'demo-ex-03',
      chapterNumber: 0,
      outcome: 'correctFirstAttempt',
    });

    await renderWithRouter(<ActivityPage />, { route: '/activity' });

    expect(screen.getByText(/3 exercises answered across 2 days/i)).toBeInTheDocument();
    // Practising without finishing a chapter used to leave this page blank.
    expect(screen.getByText(/no chapter has been completed yet/i)).toBeInTheDocument();
  });

  it('keeps both days of a streak when the same exercise is answered again', async () => {
    const progress = useProgressStore.getState();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    progress.recordAttempt({
      exerciseId: 'demo-ex-01',
      chapterNumber: 0,
      outcome: 'correctFirstAttempt',
      now: yesterday,
    });
    progress.recordAttempt({
      exerciseId: 'demo-ex-01',
      chapterNumber: 0,
      outcome: 'correctFirstAttempt',
    });

    await renderWithRouter(<ActivityPage />, { route: '/activity' });

    expect(screen.getByText(/2 days in a row/i)).toBeInTheDocument();
  });
});
