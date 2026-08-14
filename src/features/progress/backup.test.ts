import { describe, expect, it } from 'vitest';
import {
  BACKUP_FORMAT_VERSION,
  backupFileName,
  createBackup,
  describeBackup,
  parseBackup,
} from './backup';
import { defaultSettings } from '../settings/settingsStore';
import { createEmptyProgress } from './progressPersistence';
import type { PersistedProgressV2 } from '../../schemas/progressSchema';

const progress: PersistedProgressV2 = {
  ...createEmptyProgress(),
  lastOpenedChapter: 7,
  chapters: {
    7: {
      chapterNumber: 7,
      status: 'mastered',
      bestScorePercent: 96,
      latestScorePercent: 96,
      firstAttemptAccuracy: 91,
      answeredCount: 65,
      correctTextInputs: 20,
      attempts: 1,
      bookmarked: true,
    },
  },
  exerciseHistory: {
    'ch07-ex-03': {
      exerciseId: 'ch07-ex-03',
      chapterNumber: 7,
      grammarFocus: ['perfekt'],
      hasBeenWrong: true,
      timesAnswered: 2,
      timesCorrect: 1,
      timesIncorrect: 1,
      consecutiveCorrect: 1,
      stage: 'learning',
      lastOutcome: 'correctSecondAttempt',
      lastAnsweredAt: '2026-08-01T10:00:00.000Z',
      dueAt: '2026-08-04T10:00:00.000Z',
    },
  },
};

describe('progress backup', () => {
  it('round-trips progress and settings', () => {
    const backup = createBackup(progress, defaultSettings);
    const parsed = parseBackup(JSON.stringify(backup));

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.backup.progress).toEqual(progress);
    expect(parsed.backup.settings).toEqual(defaultSettings);
    expect(parsed.backup.formatVersion).toBe(BACKUP_FORMAT_VERSION);
  });

  it('names the file after the export date', () => {
    expect(backupFileName(new Date('2026-08-14T21:15:00Z'))).toBe(
      'grammatik-progress-2026-08-14.json',
    );
  });

  it('summarises what an import would replace', () => {
    const backup = createBackup(
      progress,
      defaultSettings,
      new Date('2026-08-14T00:00:00Z'),
    );
    expect(describeBackup(backup)).toBe(
      '1 chapter and 1 answered exercise, exported on 2026-08-14',
    );
  });

  it.each([
    ['not json at all', 'not valid JSON'],
    ['{"hello":"world"}', 'not exported from this app'],
    [
      JSON.stringify({ format: 'grammatik-mit-system-backup', formatVersion: 99 }),
      'format version 99',
    ],
    [
      JSON.stringify({
        format: 'grammatik-mit-system-backup',
        formatVersion: BACKUP_FORMAT_VERSION,
        exportedAt: '2026-08-14T00:00:00.000Z',
        progress: { schemaVersion: 1 },
        settings: defaultSettings,
      }),
      'incomplete or damaged',
    ],
  ])('rejects %s with a message that explains it', (text, expected) => {
    const parsed = parseBackup(text);
    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.error).toContain(expected);
  });
});
