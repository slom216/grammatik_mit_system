import type { ChapterDefinition } from '../schemas/chapterSchema';

/**
 * Every chapter body, eagerly.
 *
 * For content validation and tests only — importing this from application code
 * puts all 5.4 MB of chapters back into the entry bundle. App code uses
 * `chapterLoader.loadChapter()` instead, and an eslint rule enforces it.
 */
const modules = import.meta.glob<Record<string, ChapterDefinition>>(
  ['./chapters/chapter-*.ts', '!./chapters/chapter-000-demo.ts'],
  { eager: true },
);

export const chapterModules = Object.entries(modules).map(([path, module]) => ({
  path,
  exportCount: Object.keys(module).length,
  chapter: Object.values(module)[0] as ChapterDefinition,
}));

export const allChapters: readonly ChapterDefinition[] = chapterModules
  .map((entry) => entry.chapter)
  .sort((a, b) => a.number - b.number);
