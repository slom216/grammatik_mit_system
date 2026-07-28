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

  it('prompts to pick a chapter when nothing has been completed yet', () => {
    renderWithRouter(<ActivityPage />, { route: '/activity' });

    expect(screen.getByRole('heading', { level: 1, name: /activity/i })).toBeInTheDocument();
    expect(screen.getByText(/no chapter has been completed yet/i)).toBeInTheDocument();
  });

  it('lists a day a chapter was completed on', () => {
    const summary = summarizeSession([perfectRecord('demo-ex-01')], 1);
    useProgressStore.getState().recordSessionResult({
      chapterNumber: 0,
      summary,
      mastery,
      now: new Date('2026-03-10T09:00:00.000Z'),
    });

    renderWithRouter(<ActivityPage />, { route: '/activity' });

    expect(screen.getByText(/1 chapter completed across 1 day/i)).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /date/i })).toBeInTheDocument();
  });
});
