import { beforeEach, describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsPage } from './SettingsPage';
import { renderWithRouter } from '../test/helpers/renderWithRouter';
import { useProgressStore } from '../features/progress/progressStore';
import { useSettingsStore } from '../features/settings/settingsStore';

describe('SettingsPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useProgressStore.getState().resetProgress();
    useSettingsStore.getState().resetSettings();
  });

  it('changes the theme and stores it', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SettingsPage />, { route: '/settings' });

    const group = screen.getByRole('radiogroup', { name: /theme/i });
    expect(within(group).getByRole('radio', { name: 'System' })).toBeChecked();

    await user.click(within(group).getByRole('radio', { name: 'Dark' }));

    expect(useSettingsStore.getState().theme).toBe('dark');
    expect(window.localStorage.getItem('grammatik-mit-system:settings')).toContain(
      '"theme":"dark"',
    );
  });

  it('toggles a setting and stores it', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SettingsPage />, { route: '/settings' });

    const shuffle = screen.getByRole('checkbox', { name: /shuffle answer options/i });
    expect(shuffle).toBeChecked();

    await user.click(shuffle);

    expect(shuffle).not.toBeChecked();
    expect(useSettingsStore.getState().shuffleOptions).toBe(false);
    expect(window.localStorage.getItem('grammatik-mit-system:settings')).toContain(
      '"shuffleOptions":false',
    );
  });

  it('restores the default settings', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SettingsPage />, { route: '/settings' });

    await user.click(screen.getByRole('checkbox', { name: /show hints/i }));
    expect(useSettingsStore.getState().showHints).toBe(false);

    await user.click(screen.getByRole('button', { name: /restore default settings/i }));
    expect(useSettingsStore.getState().showHints).toBe(true);
  });

  it('asks for confirmation before deleting progress', async () => {
    const user = userEvent.setup();
    useProgressStore.getState().recordAttempt({
      exerciseId: 'demo-ex-01',
      chapterNumber: 0,
      outcome: 'incorrect',
    });

    renderWithRouter(<SettingsPage />, { route: '/settings' });
    await user.click(screen.getByRole('button', { name: /delete all progress/i }));

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /cancel/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(useProgressStore.getState().exerciseHistory['demo-ex-01']).toBeDefined();
  });

  it('deletes all progress when confirmed', async () => {
    const user = userEvent.setup();
    useProgressStore.getState().recordAttempt({
      exerciseId: 'demo-ex-01',
      chapterNumber: 0,
      outcome: 'incorrect',
    });

    renderWithRouter(<SettingsPage />, { route: '/settings' });
    await user.click(screen.getByRole('button', { name: /delete all progress/i }));
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: /delete everything/i,
      }),
    );

    expect(useProgressStore.getState().exerciseHistory).toEqual({});
    expect(window.localStorage.getItem('grammatik-mit-system:progress')).toBeNull();
    expect(screen.getByText(/all progress has been deleted/i)).toBeInTheDocument();
  });

  it('closes the confirmation dialog with Escape', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SettingsPage />, { route: '/settings' });

    await user.click(screen.getByRole('button', { name: /delete all progress/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
