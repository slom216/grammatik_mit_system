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
  ['/review/41/50', /cumulative review/i],
  ['/review/51/60', /cumulative review/i],
  ['/review/61/70', /cumulative review/i],
  ['/review/71/80', /cumulative review/i],
  ['/review/81/85', /cumulative review/i],
  ['/review/84/90', /cumulative review unavailable/i],
  ['/progress', /progress/i],
  ['/activity', /activity/i],
  ['/calendar', /calendar/i],
  ['/settings', /settings/i],
  ['/about', /about this app/i],
  ['/does-not-exist', /page not found/i],
];

// Pages and chapter content are loaded on demand, so every assertion has to
// wait for the route's chunk and loader to settle.
describe('application routes', () => {
  it.each(ROUTES)('renders %s', async (path, heading) => {
    renderRoute(path);
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(heading);
  });

  it('renders a chapter route without content as unavailable', async () => {
    renderRoute('/chapter/86');
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
      /chapter 86/i,
    );
    expect(screen.getByText(/has not been written yet/i)).toBeInTheDocument();
  });

  it('rejects a non-numeric chapter parameter', async () => {
    renderRoute('/chapter/abc');
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
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
