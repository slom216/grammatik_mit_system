import { beforeEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { ResultsPage } from './ResultsPage';
import { renderWithRouter } from '../test/helpers/renderWithRouter';
import { chapterRouteLoader } from '../features/chapters/useChapterParam';
import { usePracticeStore } from '../features/practice/practiceStore';
import { useProgressStore } from '../features/progress/progressStore';

const summary = {
  totalExercises: 10,
  answeredCount: 10,
  rawScore: 10,
  maxScore: 10,
  scorePercent: 100,
  firstAttemptCorrect: 10,
  firstAttemptAccuracy: 100,
  correctCount: 10,
  correctTextInputs: 0,
  correctSingleChoice: 10,
  incorrectExerciseIds: [],
};

function renderResults() {
  return renderWithRouter(<ResultsPage />, {
    route: '/chapter/1/results',
    path: '/chapter/:chapterNumber/results',
    loader: chapterRouteLoader,
  });
}

describe('ResultsPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useProgressStore.getState().resetProgress();
  });

  it('says a full session is needed when a quick one was too short to master', async () => {
    usePracticeStore.setState({ status: 'finished', mode: 'quick', summary });
    await renderResults();

    expect(
      screen.getByText(/only a full practice session can master/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /start full practice/i })).toHaveAttribute(
      'href',
      '/chapter/1/practice',
    );
  });

  it('does not mention quick sessions after a full one', async () => {
    usePracticeStore.setState({ status: 'finished', mode: 'chapter', summary });
    await renderResults();

    expect(screen.queryByText(/only a full practice session/i)).not.toBeInTheDocument();
  });
});
