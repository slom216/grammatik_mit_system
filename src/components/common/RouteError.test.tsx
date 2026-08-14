import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { RouteError } from './RouteError';

/** Mounts a route whose loader throws, so `RouteError` handles the failure. */
function renderThrowingRoute(error: unknown) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        loader: () => {
          throw error;
        },
        element: <p>never rendered</p>,
        errorElement: <RouteError />,
        HydrateFallback: () => <div />,
      },
    ],
    { initialEntries: ['/'] },
  );
  return render(<RouterProvider router={router} />);
}

describe('RouteError', () => {
  it('reports an unexpected failure and offers a way back', async () => {
    renderThrowingRoute(new Error('kaputt'));

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
      /something went wrong/i,
    );
    expect(screen.getByRole('button', { name: /reload the page/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /back to the dashboard/i }),
    ).toBeInTheDocument();
    // Progress lives in localStorage and survives a render failure; saying so
    // is the point of the page.
    expect(screen.getByText(/has not been affected/i)).toBeInTheDocument();
    expect(screen.getByText('kaputt')).toBeInTheDocument();
  });

  it('explains a chunk left behind by a deploy as an available update', async () => {
    renderThrowingRoute(
      new Error('Failed to fetch dynamically imported module: /assets/LearnPage-a1b2.js'),
    );

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
      /a new version is available/i,
    );
    expect(screen.getByRole('button', { name: /reload the page/i })).toBeInTheDocument();
  });

  it('renders a thrown response as its status', async () => {
    renderThrowingRoute(new Response('', { status: 503, statusText: 'Unavailable' }));

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
      /something went wrong/i,
    );
    expect(screen.getByText(/503 Unavailable/)).toBeInTheDocument();
  });
});
