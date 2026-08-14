import { readFileSync } from 'node:fs';
import { act, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppProviders } from './providers';
import {
  SETTINGS_STORAGE_KEY,
  defaultSettings,
  useSettingsStore,
} from '../features/settings/settingsStore';

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

  it('preloads the theme in index.html from the key the store writes to', () => {
    const html = readFileSync(`${process.cwd()}/index.html`, 'utf8');
    expect(html).toContain(SETTINGS_STORAGE_KEY);
  });
});
