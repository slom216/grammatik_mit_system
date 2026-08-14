import { beforeEach, describe, expect, it } from 'vitest';
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CumulativeReviewPage } from './CumulativeReviewPage';
import { renderWithRouter } from '../test/helpers/renderWithRouter';
import { cumulativeRouteLoader } from '../features/practice/cumulativeRoute';
import { usePracticeStore } from '../features/practice/practiceStore';
import { useProgressStore } from '../features/progress/progressStore';
import { useSettingsStore } from '../features/settings/settingsStore';

async function renderCumulativeReview(route = '/review/21/22') {
  return renderWithRouter(<CumulativeReviewPage />, {
    route,
    path: '/review/:from/:to',
    loader: cumulativeRouteLoader,
  });
}

/** Seeds a deterministic two-exercise, two-chapter session before mounting. */
function seedKnownSession() {
  act(() => {
    usePracticeStore.setState({
      status: 'active',
      mode: 'cumulative',
      chapterNumber: null,
      chapterNumbers: [21, 22],
      exerciseIds: ['ch21-ex-01', 'ch22-ex-01'],
      optionOrder: {
        'ch21-ex-01': ['a', 'b', 'c', 'd'],
        'ch22-ex-01': ['a', 'b', 'c', 'd'],
      },
      currentIndex: 0,
      results: {},
      attempts: {},
      feedback: null,
      startedAt: new Date().toISOString(),
      summary: null,
    });
  });
}

describe('CumulativeReviewPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useProgressStore.getState().resetProgress();
    usePracticeStore.getState().exitSession();
    useSettingsStore.setState({ shuffleOptions: false });
  });

  it('reports the range as unavailable when a chapter in it has no content', async () => {
    await renderCumulativeReview('/review/84/90');
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /cumulative review unavailable/i,
      }),
    ).toBeInTheDocument();
  });

  it('starts a mixed session pulling exercises from every chapter in the range', async () => {
    await renderCumulativeReview('/review/21/22');

    // The session starts in an effect after the loader resolves, so the real
    // heading replaces the "Preparing…" one a tick later.
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /cumulative review · chapters 21–22/i,
      }),
    ).toBeInTheDocument();
    // Default sampling pulls 3 exercises from each of the 2 chapters.
    expect(screen.getByTestId('exercise-counter')).toHaveTextContent('Exercise 1 of 6');
    expect(usePracticeStore.getState().chapterNumbers).toEqual([21, 22]);
  });

  it('answers exercises from different chapters and attributes progress to their own chapter', async () => {
    const user = userEvent.setup();
    seedKnownSession();
    await renderCumulativeReview();

    expect(screen.getByText('Ich sehe ___. (du)')).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: /^dich$/ }));
    await waitFor(() =>
      expect(screen.getByTestId('exercise-feedback')).toHaveTextContent('Correct'),
    );
    expect(usePracticeStore.getState().results['ch21-ex-01']?.outcome).toBe(
      'correctFirstAttempt',
    );
    expect(useProgressStore.getState().exerciseHistory['ch21-ex-01']?.chapterNumber).toBe(
      21,
    );

    await user.click(screen.getByRole('button', { name: /next exercise/i }));
    expect(
      screen.getByText(/Which noun phrase is the accusative object/),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: /^das Heft$/ }));
    await waitFor(() =>
      expect(screen.getByTestId('exercise-feedback')).toHaveTextContent('Correct'),
    );
    expect(useProgressStore.getState().exerciseHistory['ch22-ex-01']?.chapterNumber).toBe(
      22,
    );

    await user.click(screen.getByRole('button', { name: /finish/i }));

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /cumulative review/i,
    );
    expect(screen.getByText(/session summary/i)).toBeInTheDocument();
    expect(screen.getByText(/answered: 2 of 2/i)).toBeInTheDocument();
    // A cumulative session never evaluates a single chapter's mastery.
    expect(screen.queryByText(/mastered/i)).not.toBeInTheDocument();

    // Neither chapter's own progress was marked complete/mastered by this
    // cross-chapter session — only the per-exercise review schedule moved.
    expect(useProgressStore.getState().chapters[21]?.status).not.toBe('mastered');
    expect(useProgressStore.getState().chapters[22]?.status).not.toBe('mastered');
  });

  it('restarts with a fresh sample after finishing', async () => {
    const user = userEvent.setup();
    seedKnownSession();
    await renderCumulativeReview();

    await user.click(screen.getByRole('radio', { name: /^dich$/ }));
    await waitFor(() =>
      expect(screen.getByTestId('exercise-feedback')).toHaveTextContent('Correct'),
    );
    await user.click(screen.getByRole('button', { name: /next exercise/i }));
    await user.click(screen.getByRole('radio', { name: /^das Heft$/ }));
    await waitFor(() =>
      expect(screen.getByTestId('exercise-feedback')).toHaveTextContent('Correct'),
    );
    await user.click(screen.getByRole('button', { name: /finish/i }));

    await user.click(screen.getByRole('button', { name: /review again/i }));

    expect(usePracticeStore.getState().status).toBe('active');
    expect(usePracticeStore.getState().results).toEqual({});
  });

  it('leaves the review and returns to the review queue', async () => {
    const user = userEvent.setup();
    await renderCumulativeReview('/review/21/22');

    await user.click(
      await screen.findByRole('button', { name: /exit practice|exit review/i }),
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent(/leave this cumulative review/i);

    await user.click(within(dialog).getByRole('button', { name: /leave review/i }));
    expect(usePracticeStore.getState().status).toBe('idle');
    expect(screen.getByTestId('other-route')).toBeInTheDocument();
  });
});
