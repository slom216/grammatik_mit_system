import { beforeEach, describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { ProgressPage } from './ProgressPage';
import { renderWithRouter } from '../test/helpers/renderWithRouter';
import { useProgressStore } from '../features/progress/progressStore';
import type { AttemptOutcome } from '../schemas/progressSchema';

/** Answers one exercise `times` times with the given outcome. */
function answer(
  exerciseId: string,
  grammarFocus: string[],
  outcome: AttemptOutcome,
  times = 1,
) {
  for (let index = 0; index < times; index += 1) {
    useProgressStore.getState().recordAttempt({
      exerciseId,
      chapterNumber: 1,
      outcome,
      grammarFocus,
    });
  }
}

describe('ProgressPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useProgressStore.getState().resetProgress();
  });

  it('explains the topic breakdown before there is enough evidence for one', async () => {
    await renderWithRouter(<ProgressPage />, { route: '/progress' });

    expect(
      screen.getByRole('heading', { level: 2, name: /topics to work on/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/at least 5 times/i)).toBeInTheDocument();
  });

  it('ranks grammar topics by accuracy once enough answers exist', async () => {
    answer('ch01-ex-01', ['dative'], 'incorrect', 5);
    answer('ch01-ex-02', ['accusative'], 'correctFirstAttempt', 5);

    await renderWithRouter(<ProgressPage />, { route: '/progress' });

    const weakest = screen.getByRole('row', { name: /dative/i });
    expect(within(weakest).getByText('0%')).toBeInTheDocument();
    expect(within(weakest).getByText('0 of 5')).toBeInTheDocument();

    const strongest = screen.getByRole('row', { name: /accusative/i });
    expect(within(strongest).getByText('100%')).toBeInTheDocument();

    // Weakest first, so the failing topic leads the table.
    const topics = screen
      .getAllByRole('rowheader')
      .map((cell) => cell.textContent)
      .filter((text) => text === 'Dative' || text === 'Accusative');
    expect(topics).toEqual(['Dative', 'Accusative']);
  });

  it('links a topic to the chapter that teaches it', async () => {
    answer('ch01-ex-01', ['word-order'], 'incorrect', 5);

    await renderWithRouter(<ProgressPage />, { route: '/progress' });

    const row = screen.getByRole('row', { name: /word order/i });
    expect(within(row).getByRole('link')).toHaveAttribute('href', '/chapter/1');
  });
});
