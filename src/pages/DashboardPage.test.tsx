import { beforeEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { DashboardPage } from './DashboardPage';
import { renderWithRouter } from '../test/helpers/renderWithRouter';
import {
  createChapterProgress,
  useProgressStore,
} from '../features/progress/progressStore';
import { chapterRegistry } from '../content/registry';

describe('DashboardPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useProgressStore.getState().resetProgress();
  });

  it('shows a course-complete state once every chapter is completed', async () => {
    useProgressStore.setState({
      chapters: Object.fromEntries(
        chapterRegistry.map((entry) => [
          entry.number,
          { ...createChapterProgress(entry.number), status: 'completed' as const },
        ]),
      ),
    });

    await renderWithRouter(<DashboardPage />);

    expect(screen.getByText(/completed every chapter/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /review queue/i })).toHaveAttribute(
      'href',
      '/review',
    );
    expect(screen.queryByText(/no chapter content/i)).not.toBeInTheDocument();
  });
});
