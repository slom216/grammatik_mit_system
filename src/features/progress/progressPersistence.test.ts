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
  type PersistedProgressV2,
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

const sampleProgress: PersistedProgressV2 = {
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
      grammarFocus: [],
      hasBeenWrong: true,
      timesAnswered: 2,
      timesCorrect: 1,
      timesIncorrect: 1,
      consecutiveCorrect: 1,
      stage: 'review1',
      dueAt: '2026-03-04T10:00:00.000Z',
    },
  },
  answersByDay: { '2026-03-03': 2 },
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
      // Chains through the real 1 → 2 migration on top of the stubbed 0 → 1.
      const migrated = migrateProgress({ ...sampleProgress, schemaVersion: 0 });
      expect(migrated?.schemaVersion).toBe(PROGRESS_SCHEMA_VERSION);
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

describe('migrateProgress: v1 → v2', () => {
  /** A v1 payload: no `answersByDay`, and no `grammarFocus` on history entries. */
  const v1Progress = {
    schemaVersion: 1,
    chapters: {
      3: {
        chapterNumber: 3,
        status: 'inProgress',
        bestScorePercent: 50,
        latestScorePercent: 50,
        firstAttemptAccuracy: 50,
        answeredCount: 2,
        correctTextInputs: 0,
        attempts: 1,
        bookmarked: false,
      },
    },
    exerciseHistory: {
      'demo-ex-01': {
        exerciseId: 'demo-ex-01',
        chapterNumber: 3,
        timesAnswered: 1,
        timesCorrect: 0,
        timesIncorrect: 1,
        consecutiveCorrect: 0,
        stage: 'learning',
        lastAnsweredAt: new Date(2026, 2, 9, 8, 0).toISOString(),
      },
      'demo-ex-02': {
        exerciseId: 'demo-ex-02',
        chapterNumber: 3,
        timesAnswered: 1,
        timesCorrect: 1,
        timesIncorrect: 0,
        consecutiveCorrect: 1,
        stage: 'stable',
        lastAnsweredAt: new Date(2026, 2, 10, 8, 0).toISOString(),
      },
      'demo-ex-03': {
        exerciseId: 'demo-ex-03',
        chapterNumber: 3,
        timesAnswered: 0,
        timesCorrect: 0,
        timesIncorrect: 0,
        consecutiveCorrect: 0,
        stage: 'learning',
      },
    },
  };

  it('upgrades a v1 payload instead of discarding it', () => {
    const migrated = migrateProgress(v1Progress);

    expect(migrated).not.toBeNull();
    expect(migrated?.schemaVersion).toBe(PROGRESS_SCHEMA_VERSION);
    expect(migrated?.chapters[3]?.answeredCount).toBe(2);
    expect(Object.keys(migrated?.exerciseHistory ?? {})).toHaveLength(3);
  });

  it('seeds the day log from the last answer of each exercise', () => {
    const migrated = migrateProgress(v1Progress);

    // One exercise answered on the 9th, one on the 10th; the third was never
    // answered and contributes no day.
    expect(migrated?.answersByDay).toEqual({ '2026-03-09': 1, '2026-03-10': 1 });
  });

  it('gives history entries an empty grammar focus to fill in later', () => {
    const migrated = migrateProgress(v1Progress);

    expect(migrated?.exerciseHistory['demo-ex-01']?.grammarFocus).toEqual([]);
  });

  it('recovers which exercises have been answered wrongly', () => {
    const migrated = migrateProgress(v1Progress);

    // ex-01 has timesIncorrect 1; ex-02 has a clean record.
    expect(migrated?.exerciseHistory['demo-ex-01']?.hasBeenWrong).toBe(true);
    expect(migrated?.exerciseHistory['demo-ex-02']?.hasBeenWrong).toBe(false);
  });

  it('treats a second-attempt correction as having been wrong', () => {
    const migrated = migrateProgress({
      ...v1Progress,
      exerciseHistory: {
        'demo-ex-04': {
          exerciseId: 'demo-ex-04',
          chapterNumber: 3,
          timesAnswered: 1,
          timesCorrect: 1,
          timesIncorrect: 0,
          consecutiveCorrect: 1,
          stage: 'review1',
          lastOutcome: 'correctSecondAttempt',
          lastAnsweredAt: new Date(2026, 2, 10, 8, 0).toISOString(),
        },
      },
    });

    expect(migrated?.exerciseHistory['demo-ex-04']?.hasBeenWrong).toBe(true);
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
      theme: 'system',
      pronunciationAudio: true,
      dailyGoal: 20,
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
