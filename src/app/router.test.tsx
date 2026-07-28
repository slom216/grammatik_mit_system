import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from './router';

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(<RouterProvider router={router} />);
}

const ROUTES: Array<[string, RegExp]> = [
  ['/', /dashboard/i],
  ['/chapters', /chapter catalogue/i],
  ['/chapter/1', /personal pronouns/i],
  ['/chapter/1/learn', /personal pronouns/i],
  ['/chapter/1/practice', /practice/i],
  ['/chapter/1/results', /results/i],
  ['/review', /review queue/i],
  ['/review/21/30', /cumulative review/i],
  ['/review/31/35', /cumulative review unavailable/i],
  ['/progress', /progress/i],
  ['/settings', /settings/i],
  ['/about', /about this app/i],
  ['/does-not-exist', /page not found/i],
];

describe('application routes', () => {
  it.each(ROUTES)('renders %s', (path, heading) => {
    renderRoute(path);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(heading);
  });

  it('renders a chapter route without content as unavailable', () => {
    renderRoute('/chapter/42');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/chapter 42/i);
    expect(screen.getByText(/has not been written yet/i)).toBeInTheDocument();
  });

  it('rejects a non-numeric chapter parameter', () => {
    renderRoute('/chapter/abc');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /unknown chapter/i,
    );
  });

  it('provides the app shell with skip link and navigation', () => {
    renderRoute('/');
    expect(
      screen.getByRole('link', { name: /skip to main content/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /main/i })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
