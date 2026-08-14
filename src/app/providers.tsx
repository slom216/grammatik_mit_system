import { useEffect, type ReactNode } from 'react';
import { formatIssues, validateAllContent } from '../content/contentValidation';
import { useProgressStore } from '../features/progress/progressStore';
import { useSettingsStore } from '../features/settings/settingsStore';

let contentValidated = false;

/** In development, invalid chapter content must be loud rather than silent. */
function validateContentInDevelopment() {
  if (contentValidated || !import.meta.env.DEV) return;
  contentValidated = true;
  const result = validateAllContent();
  if (!result.valid) {
    console.error(
      `[content] ${result.issues.length} validation issue(s):\n${formatIssues(result.issues)}`,
    );
  }
}

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

  validateContentInDevelopment();

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
