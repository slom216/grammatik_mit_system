import type { z } from 'zod';
import {
  PROGRESS_SCHEMA_VERSION,
  persistedProgressV3Schema,
  type ChapterProgress,
  type ExerciseHistory,
  type PersistedProgressV3,
} from '../../schemas/progressSchema';
import { toDayKey } from './dayKey';

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

export function createEmptyProgress(): PersistedProgressV3 {
  return {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    chapters: {},
    exerciseHistory: {},
    answersByDay: {},
    otherStudyMs: 0,
  };
}

/**
 * Migrations from older persisted formats. Each entry upgrades from its key
 * version to the next one. Add a migration whenever the persisted shape changes.
 */
export const progressMigrations: Record<number, (state: unknown) => unknown> = {
  /**
   * v1 → v2: adds `answersByDay` and `ExerciseHistory.grammarFocus`.
   *
   * v1 kept no day log, so the best available seed is each exercise's
   * `lastAnsweredAt`. That undercounts — a day whose exercises were all answered
   * again later has vanished from the record — but it never invents a day the
   * learner did not practise, so an existing streak survives the upgrade rather
   * than resetting to zero. `grammarFocus` is left to the schema's default and
   * fills in as exercises are answered again.
   */
  1: (state) => {
    const previous = state as {
      exerciseHistory?: Record<
        string,
        { lastAnsweredAt?: string; timesIncorrect?: number; lastOutcome?: string }
      >;
    };
    const answersByDay: Record<string, number> = {};
    const exerciseHistory: Record<string, unknown> = {};

    for (const [id, history] of Object.entries(previous.exerciseHistory ?? {})) {
      const answeredAt = history.lastAnsweredAt;
      if (answeredAt !== undefined) {
        const day = toDayKey(new Date(answeredAt));
        answersByDay[day] = (answersByDay[day] ?? 0) + 1;
      }
      // v1 had no such flag; recover it from what it did record. A history that
      // was only ever corrected on a second attempt is indistinguishable unless
      // that was the last outcome, so a few clean-looking entries may land on
      // the slow ladder — which errs towards reviewing less, not more.
      exerciseHistory[id] = {
        ...history,
        hasBeenWrong:
          (history.timesIncorrect ?? 0) > 0 ||
          history.lastOutcome === 'correctSecondAttempt',
      };
    }

    return { ...previous, schemaVersion: 2, answersByDay, exerciseHistory };
  },

  /**
   * v2 → v3: adds study time. Nothing was measured before, so every counter
   * starts at zero and the schema defaults fill the per-chapter field in.
   */
  2: (state) => ({ ...(state as object), schemaVersion: 3, otherStudyMs: 0 }),
};

export function migrateProgress(raw: unknown): PersistedProgressV3 | null {
  if (raw === null || typeof raw !== 'object') return null;

  let candidate: unknown = raw;
  let version = (candidate as { schemaVersion?: unknown }).schemaVersion;

  while (typeof version === 'number' && version < PROGRESS_SCHEMA_VERSION) {
    const migrate = progressMigrations[version];
    if (!migrate) return null;
    candidate = migrate(candidate);
    version = (candidate as { schemaVersion?: unknown }).schemaVersion;
  }

  const parsed = persistedProgressV3Schema.safeParse(candidate);
  if (!parsed.success) return null;
  return normalizeProgress(parsed.data);
}

/** Zod parses record keys as strings; the domain model uses chapter numbers. */
function normalizeProgress(
  data: z.infer<typeof persistedProgressV3Schema>,
): PersistedProgressV3 {
  const chapters: Record<number, ChapterProgress> = {};
  for (const progress of Object.values(data.chapters)) {
    chapters[progress.chapterNumber] = progress;
  }
  const exerciseHistory: Record<string, ExerciseHistory> = {};
  for (const history of Object.values(data.exerciseHistory)) {
    exerciseHistory[history.exerciseId] = history;
  }
  const migrated: PersistedProgressV3 = {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    chapters,
    exerciseHistory,
    answersByDay: data.answersByDay,
    otherStudyMs: data.otherStudyMs,
  };
  if (data.lastOpenedChapter !== undefined) {
    migrated.lastOpenedChapter = data.lastOpenedChapter;
  }
  return migrated;
}

export function loadProgress(storage: StorageLike | null = getDefaultStorage()): {
  state: PersistedProgressV3;
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
  state: PersistedProgressV3,
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
