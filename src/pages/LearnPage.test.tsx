import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { LearnPage } from './LearnPage';
import { renderWithRouter } from '../test/helpers/renderWithRouter';
import { demoChapter } from '../content/chapters/chapter-000-demo';

function renderLearn(chapterNumber = 0) {
  return renderWithRouter(<LearnPage />, {
    route: `/chapter/${chapterNumber}/learn`,
    path: '/chapter/:chapterNumber/learn',
  });
}

describe('LearnPage', () => {
  it('renders the lesson entirely from chapter data', () => {
    renderLearn();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      demoChapter.title,
    );
    expect(screen.getByText(demoChapter.objective)).toBeInTheDocument();

    const firstIntroduction = demoChapter.explanation.introduction[0];
    expect(firstIntroduction).toBeDefined();
    expect(screen.getByText(firstIntroduction as string)).toBeInTheDocument();

    for (const rule of demoChapter.explanation.rules) {
      expect(screen.getByText(rule.heading)).toBeInTheDocument();
    }
  });

  it('renders grammar tables with row and column headers', () => {
    renderLearn();

    const table = screen.getByRole('table', { name: /present tense of sein/i });
    expect(within(table).getByRole('columnheader', { name: 'Form' })).toBeInTheDocument();
    expect(within(table).getByRole('rowheader', { name: 'ihr' })).toBeInTheDocument();
    expect(within(table).getByRole('cell', { name: 'seid' })).toBeInTheDocument();
  });

  it('shows every example with its English translation', () => {
    renderLearn();

    for (const example of demoChapter.explanation.examples) {
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

    const mistake = demoChapter.explanation.commonMistakes[0];
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
    ).toHaveAttribute('href', '/chapter/0/practice');
  });

  it('reports an unavailable chapter instead of crashing', () => {
    renderLearn(42);
    expect(screen.getByText(/has not been written yet/i)).toBeInTheDocument();
  });
});
