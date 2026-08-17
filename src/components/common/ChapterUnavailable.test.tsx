import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChapterUnavailable } from './ChapterUnavailable';
import { renderWithRouter } from '../../test/helpers/renderWithRouter';

describe('ChapterUnavailable', () => {
  it('calls a number outside the outline invalid, with no retry', async () => {
    await renderWithRouter(<ChapterUnavailable chapterNumber={999} />);

    expect(screen.getByText(/not valid/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });

  it('treats an unknown number the same way', async () => {
    await renderWithRouter(<ChapterUnavailable chapterNumber={null} />);

    expect(screen.getByRole('heading', { name: 'Unknown chapter' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });

  it('reports a download failure for a chapter that exists, and retries the loader', async () => {
    // A chapter in the outline can only be missing here because its chunk did
    // not arrive, so the retry has to re-run the loader that produced nothing.
    const loader = vi.fn(() => null);
    await renderWithRouter(
      <ChapterUnavailable chapterNumber={1} title="Personal Pronouns" />,
      {
        route: '/chapter/1',
        path: '/chapter/:chapterNumber',
        loader,
      },
    );

    expect(screen.getByText(/could not be downloaded/i)).toBeInTheDocument();
    expect(screen.queryByText(/not valid/i)).not.toBeInTheDocument();
    expect(loader).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: /try again/i }));

    expect(loader).toHaveBeenCalledTimes(2);
  });
});
