import { z } from 'zod';
import {
  persistedProgressV3Schema,
  persistedSettingsV1Schema,
  type PersistedProgressV3,
  type PersistedSettingsV1,
} from '../../schemas/progressSchema';

export const BACKUP_FORMAT_VERSION = 1;

export interface ProgressBackup {
  format: 'grammatik-mit-system-backup';
  formatVersion: typeof BACKUP_FORMAT_VERSION;
  exportedAt: string;
  progress: PersistedProgressV3;
  settings: PersistedSettingsV1;
}

const backupSchema = z.object({
  format: z.literal('grammatik-mit-system-backup'),
  formatVersion: z.literal(BACKUP_FORMAT_VERSION),
  exportedAt: z.string().min(1),
  progress: persistedProgressV3Schema,
  settings: persistedSettingsV1Schema,
});

export function createBackup(
  progress: PersistedProgressV3,
  settings: PersistedSettingsV1,
  now: Date = new Date(),
): ProgressBackup {
  return {
    format: 'grammatik-mit-system-backup',
    formatVersion: BACKUP_FORMAT_VERSION,
    exportedAt: now.toISOString(),
    progress,
    settings,
  };
}

/** `YYYY-MM-DD`, for the download filename. */
export function backupFileName(now: Date = new Date()): string {
  return `grammatik-progress-${now.toISOString().slice(0, 10)}.json`;
}

export type BackupParseResult =
  { ok: true; backup: ProgressBackup } | { ok: false; error: string };

/** Validates a backup file, with a message that says how to fix each problem. */
export function parseBackup(text: string): BackupParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'That file is not valid JSON. Pick an exported backup.' };
  }

  const asRecord = raw as { format?: unknown; formatVersion?: unknown };
  if (asRecord?.format !== 'grammatik-mit-system-backup') {
    return {
      ok: false,
      error: 'That file was not exported from this app. Pick a backup file it created.',
    };
  }
  if (asRecord.formatVersion !== BACKUP_FORMAT_VERSION) {
    return {
      ok: false,
      error: `That backup uses format version ${String(asRecord.formatVersion)}, and this app reads version ${BACKUP_FORMAT_VERSION}. Export a fresh backup from the browser that holds your progress.`,
    };
  }

  const parsed = backupSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'That backup is incomplete or damaged, so nothing was changed.',
    };
  }

  return { ok: true, backup: parsed.data };
}

/** Counts what an import would replace, so the confirmation can be specific. */
export function describeBackup(backup: ProgressBackup): string {
  const chapters = Object.values(backup.progress.chapters).length;
  const exercises = Object.keys(backup.progress.exerciseHistory).length;
  const date = backup.exportedAt.slice(0, 10);
  return `${chapters} ${chapters === 1 ? 'chapter' : 'chapters'} and ${exercises} answered ${
    exercises === 1 ? 'exercise' : 'exercises'
  }, exported on ${date}`;
}
