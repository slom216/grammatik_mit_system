import { beforeEach, describe, expect, it } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlacementPage } from './PlacementPage';
import { renderWithRouter } from '../test/helpers/renderWithRouter';
import { placementRouteLoader } from '../features/practice/placementRoute';
import { findExerciseAcrossChapters } from '../features/chapters/chapterUtils';
import { usePracticeStore } from '../features/practice/practiceStore';
import { useProgressStore } from '../features/progress/progressStore';
import { useSettingsStore } from '../features/settings/settingsStore';

async function renderPlacement() {
  return renderWithRouter(<PlacementPage />, {
    route: '/placement',
    path: '/placement',
    loader: placementRouteLoader,
  });
}

describe('PlacementPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useProgressStore.getState().resetProgress();
    usePracticeStore.getState().exitSession();
    useSettingsStore.setState({ shuffleOptions: false });
  });

  it('explains the test before it starts', async () => {
    await renderPlacement();

    expect(
      await screen.findByRole('heading', { level: 1, name: /placement test/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start the test/i })).toBeInTheDocument();
  });

  it('starts a placement session that samples several chapters', async () => {
    const user = userEvent.setup();
    await renderPlacement();

    await user.click(await screen.findByRole('button', { name: /start the test/i }));

    const session = usePracticeStore.getState();
    expect(session.mode).toBe('placement');
    expect(session.status).toBe('active');
    expect(session.exerciseIds.length).toBeGreaterThan(1);
    expect(new Set(session.chapterNumbers).size).toBeGreaterThan(1);
    expect(await screen.findByTestId('exercise-counter')).toHaveTextContent(
      /question 1 of/i,
    );
  });

  // The whole reason placement runs in its own mode: probing chapters the
  // learner has never studied must not mark them started or queue reviews.
  it('records nothing in progress while answering', async () => {
    const user = userEvent.setup();
    await renderPlacement();
    await user.click(await screen.findByRole('button', { name: /start the test/i }));

    // Driven through the store rather than the UI: the exercise type sampled
    // first is random, and the guard being tested lives in the store anyway.
    const [first] = usePracticeStore.getState().exerciseIds;
    const { chapters } = await placementRouteLoader();
    const exercise = findExerciseAcrossChapters(chapters, first ?? '');
    expect(exercise).toBeDefined();

    act(() => {
      usePracticeStore.getState().revealAnswer(exercise!);
    });
    await waitFor(() =>
      expect(usePracticeStore.getState().results[first ?? '']).toBeDefined(),
    );

    expect(useProgressStore.getState().exerciseHistory).toEqual({});
    expect(useProgressStore.getState().chapters).toEqual({});
    expect(useProgressStore.getState().answersByDay).toEqual({});
  });

  it('recommends a starting chapter once the test is finished', async () => {
    const user = userEvent.setup();
    await renderPlacement();
    await user.click(await screen.findByRole('button', { name: /start the test/i }));

    // Nothing answered correctly, so the first probe is where to begin.
    act(() => {
      usePracticeStore.getState().finishCumulative();
    });

    expect(
      await screen.findByRole('heading', { level: 2, name: /where to start/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/start with chapter 05/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go to chapter 05/i })).toBeInTheDocument();
  });
});
