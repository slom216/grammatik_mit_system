import { useEffect, type ReactNode } from 'react';
import { useProgressStore } from '../features/progress/progressStore';
import { useSettingsStore } from '../features/settings/settingsStore';

export interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Loads persisted state before the first paint of the routed pages and applies
 * the user's motion preference to the document.
 */
export function AppProviders({ children }: AppProvidersProps) {
  const hydrateProgress = useProgressStore((state) => state.hydrate);
  const hydrateSettings = useSettingsStore((state) => state.hydrate);
  const reducedMotion = useSettingsStore((state) => state.reducedMotion);
  const theme = useSettingsStore((state) => state.theme);
  const settingsHydrated = useSettingsStore((state) => state.hydrated);

  useEffect(() => {
    hydrateProgress();
    hydrateSettings();
  }, [hydrateProgress, hydrateSettings]);

  useEffect(() => {
    document.documentElement.classList.toggle('reduced-motion', reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    // Until the stored settings are loaded the inline script in index.html owns
    // the attribute; taking over earlier would strip it and flash the wrong
    // theme for one paint.
    if (!settingsHydrated) return;
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.dataset.theme = theme;
  }, [theme, settingsHydrated]);

  return <>{children}</>;
}
