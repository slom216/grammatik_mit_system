import { beforeEach, describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsPage } from './SettingsPage';
import { renderWithRouter } from '../test/helpers/renderWithRouter';
import { useProgressStore } from '../features/progress/progressStore';
import { defaultSettings, useSettingsStore } from '../features/settings/settingsStore';
import { createBackup } from '../features/progress/backup';
import { createEmptyProgress } from '../features/progress/progressPersistence';

describe('SettingsPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useProgressStore.getState().resetProgress();
    useSettingsStore.getState().resetSettings();
  });

  it('imports a backup after confirming, and rejects a foreign file', async () => {
    const user = userEvent.setup();
    await renderWithRouter(<SettingsPage />, { route: '/settings' });

    const input = screen.getByLabelText(/backup file to import/i);

    await user.upload(
      input,
      new File(['{"hello":"world"}'], 'other.json', { type: 'application/json' }),
    );
    expect(await screen.findByText(/was not exported from this app/i)).toBeVisible();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const backup = createBackup(
      { ...createEmptyProgress(), lastOpenedChapter: 4 },
      { ...defaultSettings, showHints: false },
    );
    await user.upload(
      input,
      new File([JSON.stringify(backup)], 'backup.json', { type: 'application/json' }),
    );

    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /restore backup/i }));

    expect(useProgressStore.getState().lastOpenedChapter).toBe(4);
    expect(useSettingsStore.getState().showHints).toBe(false);
  });

  it('changes the theme and stores it', async () => {
    const user = userEvent.setup();
    await renderWithRouter(<SettingsPage />, { route: '/settings' });

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
    await renderWithRouter(<SettingsPage />, { route: '/settings' });

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
    await renderWithRouter(<SettingsPage />, { route: '/settings' });

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

    await renderWithRouter(<SettingsPage />, { route: '/settings' });
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

    await renderWithRouter(<SettingsPage />, { route: '/settings' });
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
    await renderWithRouter(<SettingsPage />, { route: '/settings' });

    await user.click(screen.getByRole('button', { name: /delete all progress/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
