import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { LearnPage } from './LearnPage';
import { renderWithRouter } from '../test/helpers/renderWithRouter';
import { chapter001 } from '../content/chapters/chapter-001-personal-pronouns';

function renderLearn(chapterNumber = 1) {
  return renderWithRouter(<LearnPage />, {
    route: `/chapter/${chapterNumber}/learn`,
    path: '/chapter/:chapterNumber/learn',
  });
}

describe('LearnPage', () => {
  it('renders the lesson entirely from chapter data', () => {
    renderLearn();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(chapter001.title);
    expect(screen.getByText(chapter001.objective)).toBeInTheDocument();

    const firstIntroduction = chapter001.explanation.introduction[0];
    expect(firstIntroduction).toBeDefined();
    expect(screen.getByText(firstIntroduction as string)).toBeInTheDocument();

    for (const rule of chapter001.explanation.rules) {
      expect(screen.getByText(rule.heading)).toBeInTheDocument();
    }
  });

  it('renders grammar tables with row and column headers', () => {
    renderLearn();

    const table = screen.getByRole('table', { name: /subject pronouns/i });
    expect(
      within(table).getByRole('columnheader', { name: 'Singular' }),
    ).toBeInTheDocument();
    expect(
      within(table).getByRole('rowheader', { name: '2nd, informal' }),
    ).toBeInTheDocument();
    expect(within(table).getByRole('cell', { name: 'ihr (you)' })).toBeInTheDocument();
  });

  it('shows every example with its English translation', () => {
    renderLearn();

    for (const example of chapter001.explanation.examples) {
      expect(screen.getByText(example.english)).toBeInTheDocument();
    }
  });

  it('marks the highlighted form inside an example', () => {
    const { container } = renderLearn();
    const marks = container.querySelectorAll('mark');
    expect(marks.length).toBeGreaterThan(0);
  });

  it('shows common mistakes with text labels, not colour alone', () => {
    renderLearn();

    const mistake = chapter001.explanation.commonMistakes[0];
    expect(mistake).toBeDefined();
    expect(screen.getByText(mistake?.incorrect ?? '')).toBeInTheDocument();
    expect(screen.getByText(mistake?.correct ?? '')).toBeInTheDocument();
    expect(screen.getAllByText('Incorrect:').length).toBeGreaterThan(0);
  });

  it('shows the remember summary and a link into practice', () => {
    renderLearn();

    const remember = screen.getByRole('complementary', { name: /remember/i });
    expect(remember).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /start practice \(24 exercises\)/i }),
    ).toHaveAttribute('href', '/chapter/1/practice');
  });

  it('reports an unavailable chapter instead of crashing', () => {
    renderLearn(42);
    expect(screen.getByText(/has not been written yet/i)).toBeInTheDocument();
  });
});
