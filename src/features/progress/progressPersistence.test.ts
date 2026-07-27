import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PROGRESS_STORAGE_KEY,
  clearProgress,
  createEmptyProgress,
  createJsonStore,
  loadProgress,
  migrateProgress,
  progressMigrations,
  saveProgress,
  type StorageLike,
} from './progressPersistence';
import {
  PROGRESS_SCHEMA_VERSION,
  persistedSettingsV1Schema,
  type PersistedProgressV1,
} from '../../schemas/progressSchema';

function memoryStorage(initial: Record<string, string> = {}): StorageLike {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: (key) => {
      data.delete(key);
    },
  };
}

const sampleProgress: PersistedProgressV1 = {
  schemaVersion: PROGRESS_SCHEMA_VERSION,
  chapters: {
    3: {
      chapterNumber: 3,
      status: 'mastered',
      bestScorePercent: 92,
      latestScorePercent: 92,
      firstAttemptAccuracy: 88,
      answeredCount: 24,
      correctTextInputs: 11,
      attempts: 2,
      bookmarked: true,
    },
  },
  exerciseHistory: {
    'demo-ex-01': {
      exerciseId: 'demo-ex-01',
      chapterNumber: 3,
      timesAnswered: 2,
      timesCorrect: 1,
      timesIncorrect: 1,
      consecutiveCorrect: 1,
      stage: 'review1',
      dueAt: '2026-03-04T10:00:00.000Z',
    },
  },
  lastOpenedChapter: 3,
};

describe('saveProgress / loadProgress', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('round-trips a saved state', () => {
    const storage = memoryStorage();
    expect(saveProgress(sampleProgress, storage)).toBe(true);

    const { state, recovered } = loadProgress(storage);
    expect(recovered).toBe(false);
    expect(state).toEqual(sampleProgress);
  });

  it('survives a page refresh through localStorage', () => {
    saveProgress(sampleProgress, window.localStorage);
    const { state } = loadProgress(window.localStorage);
    expect(state.chapters[3]?.bestScorePercent).toBe(92);
    expect(state.lastOpenedChapter).toBe(3);
  });

  it('returns empty progress when nothing is stored', () => {
    const { state } = loadProgress(memoryStorage());
    expect(state).toEqual(createEmptyProgress());
  });

  it('recovers from corrupt JSON instead of crashing', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const storage = memoryStorage({ [PROGRESS_STORAGE_KEY]: '{ not json' });
    const { state, recovered } = loadProgress(storage);
    expect(recovered).toBe(true);
    expect(state).toEqual(createEmptyProgress());
  });

  it('rejects a stored state that does not match the schema', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const storage = memoryStorage({
      [PROGRESS_STORAGE_KEY]: JSON.stringify({ schemaVersion: 1, chapters: 'nope' }),
    });
    expect(loadProgress(storage).recovered).toBe(true);
  });

  it('works when storage is unavailable', () => {
    expect(loadProgress(null).state).toEqual(createEmptyProgress());
    expect(saveProgress(sampleProgress, null)).toBe(false);
    expect(() => clearProgress(null)).not.toThrow();
  });
});

describe('migrateProgress', () => {
  it('accepts the current version unchanged', () => {
    expect(migrateProgress(sampleProgress)).toEqual(sampleProgress);
  });

  it('rejects a future version it cannot understand', () => {
    expect(migrateProgress({ ...sampleProgress, schemaVersion: 99 })).toBeNull();
  });

  it('rejects an old version without a registered migration', () => {
    expect(migrateProgress({ ...sampleProgress, schemaVersion: 0 })).toBeNull();
  });

  it('applies registered migrations in order', () => {
    progressMigrations[0] = (state) => ({
      ...(state as Record<string, unknown>),
      schemaVersion: 1,
    });
    try {
      const migrated = migrateProgress({ ...sampleProgress, schemaVersion: 0 });
      expect(migrated?.schemaVersion).toBe(1);
      expect(migrated?.chapters[3]?.status).toBe('mastered');
    } finally {
      delete progressMigrations[0];
    }
  });

  it('rejects values that are not objects', () => {
    expect(migrateProgress(null)).toBeNull();
    expect(migrateProgress('progress')).toBeNull();
  });
});

describe('createJsonStore', () => {
  it('reads and writes validated values', () => {
    const storage = memoryStorage();
    const store = createJsonStore('test:settings', persistedSettingsV1Schema, storage);

    expect(store.read()).toBeNull();
    store.write({
      schemaVersion: 1,
      shuffleOptions: false,
      showHints: true,
      showUmlautHelper: true,
      reducedMotion: false,
      autoAdvance: false,
      defaultAnswerMode: 'normalized',
    });
    expect(store.read()?.shuffleOptions).toBe(false);

    store.clear();
    expect(store.read()).toBeNull();
  });

  it('ignores stored values that fail validation', () => {
    const storage = memoryStorage({ 'test:settings': '{"schemaVersion":1}' });
    const store = createJsonStore('test:settings', persistedSettingsV1Schema, storage);
    expect(store.read()).toBeNull();
  });
});
