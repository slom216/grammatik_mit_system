/**
 * CI entry point: `npm run validate:content`.
 *
 * Validates every chapter file against the content schema and the chapter
 * registry, and exits with a non-zero status when anything is wrong.
 */
import { chapters, chapterRegistry } from '../src/content/registry';
import { formatIssues, validateAllContent } from '../src/content/contentValidation';

const result = validateAllContent(chapters, chapterRegistry);

console.log(
  `Validated ${result.chaptersChecked} chapter file(s) with ${result.exercisesChecked} exercises ` +
    `against a registry of ${chapterRegistry.length} chapters.`,
);

if (!result.valid) {
  console.error(`\nContent validation failed with ${result.issues.length} issue(s):`);
  console.error(formatIssues(result.issues));
  process.exit(1);
}

const missing = chapterRegistry.filter(
  (entry) => !chapters.some((chapter) => chapter.number === entry.number),
);
console.log(
  `Content is valid. ${chapterRegistry.length - missing.length} of ${chapterRegistry.length} ` +
    `course chapters have content so far.`,
);
