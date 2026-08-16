import { beforeEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CalendarPage } from './CalendarPage';
import { renderWithRouter } from '../test/helpers/renderWithRouter';
import { useProgressStore } from '../features/progress/progressStore';

/** Local parts, so the day key matches the learner's own calendar. */
function at(hour: number, dayOffset = 0): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset, hour);
}

describe('CalendarPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useProgressStore.getState().resetProgress();
  });

  it('says a day is empty when nothing was practised', async () => {
    await renderWithRouter(<CalendarPage />, { route: '/calendar' });

    expect(
      screen.getByRole('heading', { level: 1, name: /calendar/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/nothing practised on this day/i)).toBeInTheDocument();
  });

  it('shows today’s chapters and time', async () => {
    const store = useProgressStore.getState();
    store.recordAttempt({
      exerciseId: 'demo-ex-01',
      chapterNumber: 0,
      outcome: 'correctFirstAttempt',
      now: at(9),
    });
    store.addStudyTime(0, 600_000, at(9));

    await renderWithRouter(<CalendarPage />, { route: '/calendar' });

    expect(screen.getByText(/1 exercise · 10 min\./i)).toBeInTheDocument();
    expect(screen.getByText(/1 exercise · 10 min$/i)).toBeInTheDocument();
  });

  it('shows another day when its cell is picked', async () => {
    useProgressStore.getState().recordAttempt({
      exerciseId: 'demo-ex-01',
      chapterNumber: 0,
      outcome: 'correctFirstAttempt',
      // Two days back, so the cell exists in this month unless today is the 1st
      // or the 2nd — in which case the assertion below still holds, because the
      // grid keeps the padding days of the previous month.
      now: at(9, -2),
    });

    await renderWithRouter(<CalendarPage />, { route: '/calendar' });
    expect(screen.getByText(/nothing practised on this day/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /: 1 exercise/ }));

    expect(screen.queryByText(/nothing practised on this day/i)).not.toBeInTheDocument();
    expect(screen.getByText(/1 exercise\./i)).toBeInTheDocument();
  });
});
