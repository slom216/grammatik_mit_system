import { chapterSchema, type ChapterDefinition } from '../schemas/chapterSchema';
import { allChapters as shippedChapters } from './allChapters';
import { chapterRegistry, type ChapterRegistryEntry } from './registry';

export interface ContentIssue {
  chapter: number | string;
  path: string;
  message: string;
}

export interface ContentValidationResult {
  valid: boolean;
  issues: ContentIssue[];
  chaptersChecked: number;
  exercisesChecked: number;
}

/** Schema validation for a single chapter file. */
export function validateChapter(chapter: unknown): ContentIssue[] {
  const result = chapterSchema.safeParse(chapter);
  if (result.success) return [];

  const number =
    typeof chapter === 'object' && chapter !== null && 'number' in chapter
      ? ((chapter as { number?: number }).number ?? 'unknown')
      : 'unknown';

  return result.error.issues.map((issue) => ({
    chapter: number,
    path: issue.path.join('.') || '(root)',
    message: issue.message,
  }));
}

/** Cross-chapter checks that a single-file schema cannot express. */
export function validateChapterCollection(
  allChapters: readonly ChapterDefinition[],
  registry: readonly ChapterRegistryEntry[],
): ContentIssue[] {
  const issues: ContentIssue[] = [];

  const seenNumbers = new Set<number>();
  for (const chapter of allChapters) {
    if (seenNumbers.has(chapter.number)) {
      issues.push({
        chapter: chapter.number,
        path: 'number',
        message: `Duplicate chapter number ${chapter.number}`,
      });
    }
    seenNumbers.add(chapter.number);
  }

  const seenIds = new Map<string, number>();
  for (const chapter of allChapters) {
    for (const exercise of chapter.exercises) {
      const owner = seenIds.get(exercise.id);
      if (owner !== undefined) {
        issues.push({
          chapter: chapter.number,
          path: `exercises.${exercise.id}`,
          message: `Exercise id "${exercise.id}" is also used in chapter ${owner}`,
        });
      }
      seenIds.set(exercise.id, chapter.number);
    }
  }

  const registryByNumber = new Map(registry.map((entry) => [entry.number, entry]));

  // The chapter loader discovers files by glob, so a file named off-convention
  // is dropped silently. This is the only check that catches that.
  for (const entry of registry) {
    if (!seenNumbers.has(entry.number)) {
      issues.push({
        chapter: entry.number,
        path: 'number',
        message: `Registry chapter ${entry.number} has no content file matching chapter-NNN-*.ts`,
      });
    }
  }

  for (const chapter of allChapters) {
    const entry = registryByNumber.get(chapter.number);

    if (chapter.isDemo) {
      if (entry) {
        issues.push({
          chapter: chapter.number,
          path: 'isDemo',
          message: `Demo chapter ${chapter.number} must not occupy a registry chapter number`,
        });
      }
      continue;
    }

    if (!entry) {
      issues.push({
        chapter: chapter.number,
        path: 'number',
        message: `Chapter ${chapter.number} is not listed in the chapter registry`,
      });
      continue;
    }

    if (entry.title !== chapter.title) {
      issues.push({
        chapter: chapter.number,
        path: 'title',
        message: `Title "${chapter.title}" does not match the registry title "${entry.title}"`,
      });
    }
    if (entry.section !== chapter.section) {
      issues.push({
        chapter: chapter.number,
        path: 'section',
        message: `Section "${chapter.section}" does not match the registry section "${entry.section}"`,
      });
    }
    if (entry.level !== chapter.level) {
      issues.push({
        chapter: chapter.number,
        path: 'level',
        message: `Level "${chapter.level}" does not match the registry level "${entry.level}"`,
      });
    }
    // The catalogue reads this from the registry so it never loads a chapter
    // body, which only works while the two copies agree.
    if (entry.estimatedMinutes !== chapter.estimatedMinutes) {
      issues.push({
        chapter: chapter.number,
        path: 'estimatedMinutes',
        message: `estimatedMinutes ${chapter.estimatedMinutes} does not match the registry value ${entry.estimatedMinutes}`,
      });
    }
    // Same bargain as estimatedMinutes: catalogue search reads these without
    // loading a chapter, so the two copies have to stay identical.
    if (entry.tags.join('|') !== chapter.tags.join('|')) {
      issues.push({
        chapter: chapter.number,
        path: 'tags',
        message: `Tags [${chapter.tags.join(', ')}] do not match the registry tags [${entry.tags.join(', ')}]`,
      });
    }

    for (const prerequisite of chapter.prerequisites) {
      if (!registryByNumber.has(prerequisite)) {
        issues.push({
          chapter: chapter.number,
          path: 'prerequisites',
          message: `Prerequisite chapter ${prerequisite} does not exist`,
        });
      } else if (prerequisite >= chapter.number) {
        issues.push({
          chapter: chapter.number,
          path: 'prerequisites',
          message: `Prerequisite chapter ${prerequisite} does not come before chapter ${chapter.number}`,
        });
      }
    }
  }

  return issues;
}

/** Validates every chapter that ships with the app. */
export function validateAllContent(
  allChapters: readonly ChapterDefinition[] = shippedChapters,
  registry: readonly ChapterRegistryEntry[] = chapterRegistry,
): ContentValidationResult {
  const issues = [
    ...allChapters.flatMap((chapter) => validateChapter(chapter)),
    ...validateChapterCollection(allChapters, registry),
  ];

  return {
    valid: issues.length === 0,
    issues,
    chaptersChecked: allChapters.length,
    exercisesChecked: allChapters.reduce(
      (total, chapter) => total + chapter.exercises.length,
      0,
    ),
  };
}

export function formatIssues(issues: readonly ContentIssue[]): string {
  return issues
    .map((issue) => `  chapter ${issue.chapter} · ${issue.path}: ${issue.message}`)
    .join('\n');
}
