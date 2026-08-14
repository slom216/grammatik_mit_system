/**
 * `npm run audit:content` — quality report over every shipped exercise.
 *
 * Unlike `validate:content`, nothing here fails the build: duplicates and
 * answer leaks are judgement calls, so this prints them for review.
 *
 * Reads the chapter directory with fs rather than `import.meta.glob`, so it can
 * run under tsx outside Vite.
 */
import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { auditChapters, type AuditFinding } from '../src/content/contentAudit';
import type { ChapterDefinition } from '../src/schemas/chapterSchema';

const CHAPTER_DIR = new URL('../src/content/chapters/', import.meta.url);

const files = readdirSync(CHAPTER_DIR)
  .filter((file) => /^chapter-\d{3}-.+\.ts$/.test(file))
  .sort();

const chapters: ChapterDefinition[] = [];
for (const file of files) {
  const module = (await import(
    pathToFileURL(`${CHAPTER_DIR.pathname}${file}`).href
  )) as Record<string, ChapterDefinition>;
  const chapter = Object.values(module)[0];
  if (chapter) chapters.push(chapter);
}

const exerciseCount = chapters.reduce(
  (sum, chapter) => sum + chapter.exercises.length,
  0,
);
const findings = auditChapters(chapters);

const byKind = new Map<AuditFinding['kind'], AuditFinding[]>();
for (const finding of findings) {
  byKind.set(finding.kind, [...(byKind.get(finding.kind) ?? []), finding]);
}

console.log(
  `Audited ${chapters.length} chapters with ${exerciseCount} exercises.\n` +
    `${findings.length} finding(s).\n`,
);

for (const [kind, group] of [...byKind.entries()].sort(
  (a, b) => b[1].length - a[1].length,
)) {
  console.log(`\n## ${kind} (${group.length})`);
  for (const finding of group.slice(0, 40)) {
    console.log(
      `  ch${finding.chapter} ${finding.exerciseIds.join(' / ')}: ${finding.detail}`,
    );
  }
  if (group.length > 40) console.log(`  … and ${group.length - 40} more`);
}
