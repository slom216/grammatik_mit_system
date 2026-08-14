import { render, waitFor, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import {
  createMemoryRouter,
  RouterProvider,
  type LoaderFunction,
} from 'react-router-dom';

export interface RenderWithRouterOptions {
  /** Initial URL, e.g. `/chapter/0/practice`. */
  route?: string;
  /** Route pattern the element is mounted at, e.g. `/chapter/:chapterNumber/practice`. */
  path?: string;
  /** Route loader, for pages that read their data with `useLoaderData`. */
  loader?: LoaderFunction;
}

/**
 * Renders a page component inside a memory data router and waits for its route
 * to finish loading. A data router (rather than `<MemoryRouter>`) is required
 * because chapter pages get their content from a route loader, and loading a
 * chapter is asynchronous — hence the promise.
 */
export async function renderWithRouter(
  element: ReactElement,
  { route = '/', path = '*', loader }: RenderWithRouterOptions = {},
): Promise<RenderResult> {
  const router = createMemoryRouter(
    [
      {
        path,
        element,
        loader,
        HydrateFallback: () => <div data-testid="route-loading" />,
      },
      ...(path !== '*' ? [{ path: '*', element: <div data-testid="other-route" /> }] : []),
    ],
    { initialEntries: [route] },
  );

  const result = render(<RouterProvider router={router} />);
  await waitFor(() => expect(router.state.initialized).toBe(true));
  return result;
}
