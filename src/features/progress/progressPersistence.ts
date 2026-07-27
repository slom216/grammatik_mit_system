import type { z } from 'zod';
import {
  PROGRESS_SCHEMA_VERSION,
  persistedProgressV1Schema,
  type ChapterProgress,
  type ExerciseHistory,
  type PersistedProgressV1,
} from '../../schemas/progressSchema';

export const PROGRESS_STORAGE_KEY = 'grammatik-mit-system:progress';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** localStorage is unavailable in SSR, in private modes and when quota is blocked. */
export function getDefaultStorage(): StorageLike | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const probe = '__gms_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

export function createEmptyProgress(): PersistedProgressV1 {
  return {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    chapters: {},
    exerciseHistory: {},
  };
}

/**
 * Migrations from older persisted formats. Each entry upgrades from its key
 * version to the next one. Add a migration whenever the persisted shape changes.
 */
export const progressMigrations: Record<number, (state: unknown) => unknown> = {};

export function migrateProgress(raw: unknown): PersistedProgressV1 | null {
  if (raw === null || typeof raw !== 'object') return null;

  let candidate: unknown = raw;
  let version = (candidate as { schemaVersion?: unknown }).schemaVersion;

  while (typeof version === 'number' && version < PROGRESS_SCHEMA_VERSION) {
    const migrate = progressMigrations[version];
    if (!migrate) return null;
    candidate = migrate(candidate);
    version = (candidate as { schemaVersion?: unknown }).schemaVersion;
  }

  const parsed = persistedProgressV1Schema.safeParse(candidate);
  if (!parsed.success) return null;
  return normalizeProgress(parsed.data);
}

/** Zod parses record keys as strings; the domain model uses chapter numbers. */
function normalizeProgress(
  data: z.infer<typeof persistedProgressV1Schema>,
): PersistedProgressV1 {
  const chapters: Record<number, ChapterProgress> = {};
  for (const progress of Object.values(data.chapters)) {
    chapters[progress.chapterNumber] = progress;
  }
  const exerciseHistory: Record<string, ExerciseHistory> = {};
  for (const history of Object.values(data.exerciseHistory)) {
    exerciseHistory[history.exerciseId] = history;
  }
  const migrated: PersistedProgressV1 = {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    chapters,
    exerciseHistory,
  };
  if (data.lastOpenedChapter !== undefined) {
    migrated.lastOpenedChapter = data.lastOpenedChapter;
  }
  return migrated;
}

export function loadProgress(storage: StorageLike | null = getDefaultStorage()): {
  state: PersistedProgressV1;
  recovered: boolean;
} {
  if (!storage) return { state: createEmptyProgress(), recovered: false };

  const raw = storage.getItem(PROGRESS_STORAGE_KEY);
  if (raw === null) return { state: createEmptyProgress(), recovered: false };

  try {
    const migrated = migrateProgress(JSON.parse(raw));
    if (migrated) return { state: migrated, recovered: false };
  } catch {
    // fall through to the recovery path
  }

  console.warn('[progress] stored progress could not be read and was reset.');
  return { state: createEmptyProgress(), recovered: true };
}

export function saveProgress(
  state: PersistedProgressV1,
  storage: StorageLike | null = getDefaultStorage(),
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    console.warn('[progress] progress could not be saved.');
    return false;
  }
}

export function clearProgress(storage: StorageLike | null = getDefaultStorage()): void {
  storage?.removeItem(PROGRESS_STORAGE_KEY);
}

/* ------------------------------------------------------------------ */
/* Generic versioned JSON storage, reused for settings and sessions    */
/* ------------------------------------------------------------------ */

export interface JsonStore<T> {
  read(): T | null;
  write(value: T): void;
  clear(): void;
}

export function createJsonStore<Schema extends z.ZodType>(
  key: string,
  schema: Schema,
  storage: StorageLike | null = getDefaultStorage(),
): JsonStore<z.infer<Schema>> {
  return {
    read() {
      if (!storage) return null;
      const raw = storage.getItem(key);
      if (raw === null) return null;
      try {
        const parsed = schema.safeParse(JSON.parse(raw));
        return parsed.success ? (parsed.data as z.infer<Schema>) : null;
      } catch {
        return null;
      }
    },
    write(value) {
      if (!storage) return;
      try {
        storage.setItem(key, JSON.stringify(value));
      } catch {
        console.warn(`[storage] "${key}" could not be saved.`);
      }
    },
    clear() {
      storage?.removeItem(key);
    },
  };
}
