import { useSyncExternalStore } from 'react';
import { useSettingsStore } from '../../features/settings/settingsStore';
import { Icon } from './Icon';

const DARK_QUERY = '(prefers-color-scheme: dark)';

function subscribe(onChange: () => void) {
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/**
 * Header shortcut for the theme. The Settings page keeps the full three-way
 * control (System / Light / Dark); this only flips between the two explicit
 * themes, so a learner on "System" who taps it lands on the opposite of
 * whatever their OS is currently showing rather than on a no-op.
 *
 * The system preference is read through `useSyncExternalStore` so the icon
 * still updates when the OS switches theme under a learner who never left
 * "System".
 */
export function ThemeToggle() {
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const systemPrefersDark = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DARK_QUERY).matches,
    () => false,
  );

  const isDark = theme === 'dark' || (theme === 'system' && systemPrefersDark);
  const next = isDark ? 'light' : 'dark';
  const label = `Switch to the ${next} theme`;

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
    >
      <Icon name={isDark ? 'sun' : 'moon'} />
    </button>
  );
}
