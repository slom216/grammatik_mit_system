import { describe, expect, it } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from './AppShell';

/** Replaces its own h1 after mounting, like "Preparing practice…" does. */
function SlowPage() {
  const [ready, setReady] = useState(false);
  return (
    <>
      <h1>{ready ? 'Practice · Modal Verbs' : 'Preparing practice…'}</h1>
      <button type="button" onClick={() => setReady(true)}>
        Load
      </button>
    </>
  );
}

describe('AppShell', () => {
  it('keeps the document title in step with the page heading', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <AppShell />,
          children: [{ index: true, element: <SlowPage /> }],
        },
      ],
      { initialEntries: ['/'] },
    );
    render(<RouterProvider router={router} />);

    await screen.findByRole('heading', { name: 'Preparing practice…' });
    await waitFor(() => expect(document.title).toMatch(/^Preparing practice… · /));

    act(() => screen.getByRole('button', { name: 'Load' }).click());

    await waitFor(() => expect(document.title).toMatch(/^Practice · Modal Verbs · /));
  });
});
