import { readFileSync } from 'node:fs';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppProviders } from './providers';
import { ThemeToggle } from '../components/common/ThemeToggle';
import {
  SETTINGS_STORAGE_KEY,
  defaultSettings,
  useSettingsStore,
} from '../features/settings/settingsStore';

/** jsdom always reports `matches: false`, so the OS preference is stubbed. */
function stubSystemPrefersDark(prefersDark: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query) =>
      ({
        matches: prefersDark,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  );
}

describe('theme preference', () => {
  it('stamps data-theme on <html> once the stored settings are loaded', () => {
    window.localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({ ...defaultSettings, theme: 'dark' }),
    );
    render(
      <AppProviders>
        <div />
      </AppProviders>,
    );

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');

    act(() => useSettingsStore.getState().setTheme('light'));
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    // "system" means no attribute at all, so the CSS follows the OS setting.
    act(() => useSettingsStore.getState().setTheme('system'));
    expect(document.documentElement).not.toHaveAttribute('data-theme');
  });

  it('keeps the other settings when stored data predates the theme field', () => {
    const { theme: _theme, ...withoutTheme } = { ...defaultSettings, showHints: false };
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(withoutTheme));

    act(() => useSettingsStore.getState().hydrate());

    expect(useSettingsStore.getState().showHints).toBe(false);
    expect(useSettingsStore.getState().theme).toBe('system');
  });

  it('flips to the opposite of the system theme from the header toggle', async () => {
    stubSystemPrefersDark(true);
    render(<ThemeToggle />);

    // On "system" with a dark OS, the toggle offers light — not dark, which
    // would look like a no-op.
    await userEvent.click(screen.getByRole('button', { name: /light theme/i }));
    expect(useSettingsStore.getState().theme).toBe('light');

    await userEvent.click(screen.getByRole('button', { name: /dark theme/i }));
    expect(useSettingsStore.getState().theme).toBe('dark');
  });

  it('preloads the theme in index.html from the key the store writes to', () => {
    const html = readFileSync(`${process.cwd()}/index.html`, 'utf8');
    expect(html).toContain(SETTINGS_STORAGE_KEY);
  });
});
