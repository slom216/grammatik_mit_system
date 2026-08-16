import { describe, expect, it, vi } from 'vitest';
import { act, screen, within } from '@testing-library/react';
import { LearnPage } from './LearnPage';
import { renderWithRouter } from '../test/helpers/renderWithRouter';
import { chapter001 } from '../content/chapters/chapter-001-personal-pronouns';
import { chapterRouteLoader } from '../features/chapters/useChapterParam';
import {
  selectChapterProgress,
  useProgressStore,
} from '../features/progress/progressStore';

async function renderLearn(chapterNumber = 1) {
  return renderWithRouter(<LearnPage />, {
    route: `/chapter/${chapterNumber}/learn`,
    path: '/chapter/:chapterNumber/learn',
    loader: chapterRouteLoader,
  });
}

describe('LearnPage', () => {
  it('renders the lesson entirely from chapter data', async () => {
    await renderLearn();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(chapter001.title);
    expect(screen.getByText(chapter001.objective)).toBeInTheDocument();

    const firstIntroduction = chapter001.explanation.introduction[0];
    expect(firstIntroduction).toBeDefined();
    expect(screen.getByText(firstIntroduction as string)).toBeInTheDocument();

    for (const rule of chapter001.explanation.rules) {
      expect(screen.getByText(rule.heading)).toBeInTheDocument();
    }
  });

  it('renders grammar tables with row and column headers', async () => {
    await renderLearn();

    const table = screen.getByRole('table', { name: /subject pronouns/i });
    expect(
      within(table).getByRole('columnheader', { name: 'Singular' }),
    ).toBeInTheDocument();
    expect(
      within(table).getByRole('rowheader', { name: '2nd, informal' }),
    ).toBeInTheDocument();
    expect(within(table).getByRole('cell', { name: 'ihr (you)' })).toBeInTheDocument();
  });

  it('shows every example with its English translation', async () => {
    await renderLearn();

    for (const example of chapter001.explanation.examples) {
      expect(screen.getByText(example.english)).toBeInTheDocument();
    }
  });

  it('marks the highlighted form inside an example', async () => {
    const { container } = await renderLearn();
    const marks = container.querySelectorAll('mark');
    expect(marks.length).toBeGreaterThan(0);
  });

  it('shows common mistakes with text labels, not colour alone', async () => {
    await renderLearn();

    const mistake = chapter001.explanation.commonMistakes[0];
    expect(mistake).toBeDefined();
    expect(screen.getByText(mistake?.incorrect ?? '')).toBeInTheDocument();
    expect(screen.getByText(mistake?.correct ?? '')).toBeInTheDocument();
    expect(screen.getAllByText('Incorrect:').length).toBeGreaterThan(0);
  });

  it('shows the remember summary and a link into practice', async () => {
    await renderLearn();

    const remember = screen.getByRole('complementary', { name: /remember/i });
    expect(remember).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: new RegExp(
          `full practice \\(${chapter001.exercises.length} exercises\\)`,
          'i',
        ),
      }),
    ).toHaveAttribute('href', '/chapter/1/practice');
    expect(
      screen.getByRole('link', { name: /quick practice \(24 exercises\)/i }),
    ).toHaveAttribute('href', '/chapter/1/practice?mode=quick');
  });

  it('counts reading time against the chapter', async () => {
    window.localStorage.clear();
    useProgressStore.getState().resetProgress();
    // jsdom has no window manager, so focus is faked at the source the timer reads.
    vi.spyOn(document, 'hasFocus').mockReturnValue(true);
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const view = await renderLearn();
    expect(screen.getByTestId('study-timer')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(600_000);
    });
    // Unmounting is what banks the time, exactly as leaving the page would.
    view.unmount();

    // At least, not exactly: `shouldAdvanceTime` lets a few real milliseconds
    // through as well. Exact accounting is studyTimer's own test.
    expect(
      selectChapterProgress(useProgressStore.getState(), 1).studyMs,
    ).toBeGreaterThanOrEqual(600_000);

    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('reports an unavailable chapter instead of crashing', async () => {
    await renderLearn(86);
    expect(screen.getByText(/has not been written yet/i)).toBeInTheDocument();
  });
});
