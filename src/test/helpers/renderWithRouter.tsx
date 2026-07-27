import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

export interface RenderWithRouterOptions {
  /** Initial URL, e.g. `/chapter/0/practice`. */
  route?: string;
  /** Route pattern the element is mounted at, e.g. `/chapter/:chapterNumber/practice`. */
  path?: string;
}

/** Renders a page component inside a memory router. */
export function renderWithRouter(
  element: ReactElement,
  { route = '/', path = '*' }: RenderWithRouterOptions = {},
): RenderResult {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={element} />
        {path !== '*' && <Route path="*" element={<div data-testid="other-route" />} />}
      </Routes>
    </MemoryRouter>,
  );
}
