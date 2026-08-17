import { create } from 'zustand';
import {
  SETTINGS_SCHEMA_VERSION,
  persistedSettingsV1Schema,
  type PersistedSettingsV1,
  type Theme,
} from '../../schemas/progressSchema';
import { createJsonStore } from '../progress/progressPersistence';

export const SETTINGS_STORAGE_KEY = 'grammatik-mit-system:settings';

export const defaultSettings: PersistedSettingsV1 = {
  schemaVersion: SETTINGS_SCHEMA_VERSION,
  shuffleOptions: true,
  showHints: true,
  showUmlautHelper: true,
  reducedMotion: false,
  autoAdvance: false,
  theme: 'system',
  pronunciationAudio: true,
  dailyGoal: 20,
};

const store = createJsonStore(SETTINGS_STORAGE_KEY, persistedSettingsV1Schema);

export type SettingsToggle = Exclude<
  keyof PersistedSettingsV1,
  'schemaVersion' | 'theme' | 'dailyGoal'
>;

export interface SettingsState extends PersistedSettingsV1 {
  hydrated: boolean;
  hydrate: () => void;
  setSetting: <Key extends SettingsToggle>(key: Key, value: boolean) => void;
  toggleSetting: (key: SettingsToggle) => void;
  setTheme: (theme: Theme) => void;
  setDailyGoal: (dailyGoal: number) => void;
  /** Replaces every setting at once, e.g. when restoring a backup. */
  replaceSettings: (settings: PersistedSettingsV1) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()((set, get) => {
  const persist = () => {
    const {
      shuffleOptions,
      showHints,
      showUmlautHelper,
      reducedMotion,
      autoAdvance,
      pronunciationAudio,
    } = get();
    store.write({
      schemaVersion: SETTINGS_SCHEMA_VERSION,
      shuffleOptions,
      showHints,
      showUmlautHelper,
      reducedMotion,
      autoAdvance,
      pronunciationAudio,
      theme: get().theme,
      dailyGoal: get().dailyGoal,
    });
  };

  return {
    ...defaultSettings,
    hydrated: false,

    hydrate: () => {
      const stored = store.read();
      set({ ...defaultSettings, ...(stored ?? {}), hydrated: true });
    },

    setSetting: (key, value) => {
      set({ [key]: value } as Pick<SettingsState, typeof key>);
      persist();
    },

    toggleSetting: (key) => {
      set({ [key]: !get()[key] } as Pick<SettingsState, typeof key>);
      persist();
    },

    setTheme: (theme) => {
      set({ theme });
      persist();
    },

    setDailyGoal: (dailyGoal) => {
      set({ dailyGoal: Math.max(0, Math.round(dailyGoal)) });
      persist();
    },

    replaceSettings: (settings) => {
      set({ ...settings, hydrated: true });
      persist();
    },

    resetSettings: () => {
      store.clear();
      set({ ...defaultSettings, hydrated: true });
    },
  };
});
