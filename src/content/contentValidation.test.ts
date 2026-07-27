import { describe, expect, it } from 'vitest';
import {
  validateAllContent,
  validateChapter,
  validateChapterCollection,
} from './contentValidation';
import { chapterRegistry, chapters, demoChapters, getChapter } from './registry';
import { CHAPTER_SECTIONS, CONTENT_RULES } from '../schemas/chapterSchema';
import { sections } from './sections';
import {
  makeChapter,
  makeSingleChoice,
  makeTextInput,
} from '../test/fixtures/chapterFixture';

describe('shipped content', () => {
  it('passes full validation', () => {
    const result = validateAllContent();
    expect(result.issues).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it.each(chapters.map((chapter) => [chapter.number, chapter] as const))(
    'chapter %i satisfies the content rules',
    (_number, chapter) => {
      expect(validateChapter(chapter)).toEqual([]);

      const singleChoice = chapter.exercises.filter((e) => e.type === 'singleChoice');
      const textInput = chapter.exercises.filter((e) => e.type === 'textInput');

      expect(chapter.exercises.length).toBeGreaterThanOrEqual(CONTENT_RULES.minExercises);
      expect(singleChoice.length).toBeGreaterThanOrEqual(CONTENT_RULES.minSingleChoice);
      expect(textInput.length).toBeGreaterThanOrEqual(CONTENT_RULES.minTextInput);
      expect(chapter.explanation.examples.length).toBeGreaterThanOrEqual(
        CONTENT_RULES.minExamples,
      );
      expect(chapter.explanation.commonMistakes.length).toBeGreaterThanOrEqual(
        CONTENT_RULES.minCommonMistakes,
      );
      expect(chapter.explanation.remember.length).toBeGreaterThan(0);

      for (const exercise of chapter.exercises) {
        expect(exercise.chapterNumber).toBe(chapter.number);
        expect(exercise.explanation.length).toBeGreaterThan(0);
        if (exercise.type === 'singleChoice') {
          expect(exercise.options.length).toBeGreaterThanOrEqual(3);
          expect(
            exercise.options.some((option) => option.id === exercise.correctOptionId),
          ).toBe(true);
        } else {
          expect(exercise.acceptedAnswers.length).toBeGreaterThan(0);
        }
      }

      for (const example of chapter.explanation.examples) {
        expect(example.english.trim().length).toBeGreaterThan(0);
      }
    },
  );

  it('ships exactly one demo chapter in Phase 0', () => {
    expect(demoChapters).toHaveLength(1);
    expect(demoChapters[0]?.isDemo).toBe(true);
  });
});

describe('chapter registry', () => {
  it('lists all 85 chapters exactly once and in order', () => {
    expect(chapterRegistry).toHaveLength(85);
    expect(chapterRegistry.map((entry) => entry.number)).toEqual(
      Array.from({ length: 85 }, (_unused, index) => index + 1),
    );
  });

  it('only uses known sections and levels', () => {
    for (const entry of chapterRegistry) {
      expect(CHAPTER_SECTIONS).toContain(entry.section);
      expect(['A1', 'A2', 'B1']).toContain(entry.level);
    }
  });

  it('has a section definition for every section used', () => {
    const defined = new Set(sections.map((section) => section.id));
    for (const entry of chapterRegistry) {
      expect(defined.has(entry.section)).toBe(true);
    }
  });

  it('has unique chapter titles', () => {
    const titles = chapterRegistry.map((entry) => entry.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('resolves content only for chapters that are implemented', () => {
    for (const entry of chapterRegistry) {
      const chapter = getChapter(entry.number);
      if (chapter) {
        expect(chapter.title).toBe(entry.title);
        expect(chapter.level).toBe(entry.level);
        expect(chapter.section).toBe(entry.section);
      }
    }
  });
});

describe('validateChapter rejects invalid content', () => {
  it('accepts the valid fixture', () => {
    expect(validateChapter(makeChapter())).toEqual([]);
  });

  it('rejects a missing chapter number', () => {
    const { number: _number, ...withoutNumber } = makeChapter();
    const issues = validateChapter(withoutNumber);
    expect(issues.some((issue) => issue.path === 'number')).toBe(true);
  });

  it('rejects duplicate exercise ids', () => {
    const exercises = makeChapter().exercises;
    const first = exercises[0];
    const second = exercises[1];
    if (!first || !second) throw new Error('fixture is missing exercises');
    const issues = validateChapter(
      makeChapter({ exercises: [...exercises, { ...second, id: first.id, order: 25 }] }),
    );
    expect(issues.some((issue) => issue.message.includes('Duplicate exercise ids'))).toBe(
      true,
    );
  });

  it('rejects fewer than 24 exercises', () => {
    const issues = validateChapter(
      makeChapter({ exercises: makeChapter().exercises.slice(0, 23) }),
    );
    expect(issues.some((issue) => issue.message.includes('at least 24'))).toBe(true);
  });

  it('rejects fewer than 12 multiple-choice exercises', () => {
    const exercises = [
      ...Array.from({ length: 11 }, (_unused, index) => makeSingleChoice(index + 1)),
      ...Array.from({ length: 13 }, (_unused, index) => makeTextInput(index + 12)),
    ];
    const issues = validateChapter(makeChapter({ exercises }));
    expect(
      issues.some((issue) => issue.message.includes('single-choice exercises')),
    ).toBe(true);
  });

  it('rejects fewer than 12 text-input exercises', () => {
    const exercises = [
      ...Array.from({ length: 13 }, (_unused, index) => makeSingleChoice(index + 1)),
      ...Array.from({ length: 11 }, (_unused, index) => makeTextInput(index + 14)),
    ];
    const issues = validateChapter(makeChapter({ exercises }));
    expect(issues.some((issue) => issue.message.includes('text-input exercises'))).toBe(
      true,
    );
  });

  it('rejects a multiple-choice exercise with fewer than 3 options', () => {
    const exercises = makeChapter().exercises;
    exercises[0] = makeSingleChoice(1, {
      options: [
        { id: 'a', text: 'bin' },
        { id: 'b', text: 'bist' },
      ],
    });
    const issues = validateChapter(makeChapter({ exercises }));
    expect(issues.some((issue) => issue.message.includes('at least 3 options'))).toBe(
      true,
    );
  });

  it('rejects a correct option id that does not exist', () => {
    const exercises = makeChapter().exercises;
    exercises[0] = makeSingleChoice(1, { correctOptionId: 'z' });
    const issues = validateChapter(makeChapter({ exercises }));
    expect(
      issues.some((issue) => issue.message.includes('does not match any option')),
    ).toBe(true);
  });

  it('rejects a text-input exercise without accepted answers', () => {
    const exercises = makeChapter().exercises;
    exercises[23] = makeTextInput(24, { acceptedAnswers: [] });
    const issues = validateChapter(makeChapter({ exercises }));
    expect(
      issues.some((issue) => issue.message.includes('at least one accepted answer')),
    ).toBe(true);
  });

  it('rejects an example without an English translation', () => {
    const chapter = makeChapter();
    const examples = [...chapter.explanation.examples];
    examples[0] = { german: 'Ich bin hier.', english: '' };
    const issues = validateChapter(
      makeChapter({ explanation: { ...chapter.explanation, examples } }),
    );
    expect(issues.some((issue) => issue.message.includes('English translation'))).toBe(
      true,
    );
  });

  it('rejects fewer than 3 common mistakes', () => {
    const chapter = makeChapter();
    const issues = validateChapter(
      makeChapter({
        explanation: {
          ...chapter.explanation,
          commonMistakes: chapter.explanation.commonMistakes.slice(0, 2),
        },
      }),
    );
    expect(issues.some((issue) => issue.message.includes('common mistakes'))).toBe(true);
  });

  it('rejects an exercise that claims the wrong chapter number', () => {
    const exercises = makeChapter().exercises;
    exercises[0] = makeSingleChoice(1, { chapterNumber: 7 });
    const issues = validateChapter(makeChapter({ exercises }));
    expect(issues.some((issue) => issue.message.includes('declares chapter 7'))).toBe(
      true,
    );
  });

  it('rejects a mistyped grammar table', () => {
    const chapter = makeChapter();
    const issues = validateChapter(
      makeChapter({
        explanation: {
          ...chapter.explanation,
          tables: [
            {
              id: 'table-1',
              title: 'Pronouns',
              columns: ['Person', 'Singular'],
              rows: [['1st', 'ich', 'too many cells']],
            },
          ],
        },
      }),
    );
    expect(issues.some((issue) => issue.message.includes('cells'))).toBe(true);
  });
});

describe('validateChapterCollection', () => {
  const registry = [
    {
      number: 1,
      title: 'Personal Pronouns',
      section: 'verbs-1' as const,
      level: 'A1' as const,
    },
    {
      number: 2,
      title: 'Present-Tense Conjugation',
      section: 'verbs-1' as const,
      level: 'A1' as const,
    },
  ];

  it('accepts chapters that match the registry', () => {
    expect(validateChapterCollection([makeChapter()], registry)).toEqual([]);
  });

  it('rejects duplicate chapter numbers', () => {
    const issues = validateChapterCollection([makeChapter(), makeChapter()], registry);
    expect(
      issues.some((issue) => issue.message.includes('Duplicate chapter number')),
    ).toBe(true);
  });

  it('rejects the same exercise id in two chapters', () => {
    const second = makeChapter({
      id: 'chapter-002',
      number: 2,
      slug: 'present-tense-conjugation',
      title: 'Present-Tense Conjugation',
      exercises: makeChapter().exercises.map((exercise) => ({
        ...exercise,
        chapterNumber: 2,
      })),
    });
    const issues = validateChapterCollection([makeChapter(), second], registry);
    expect(
      issues.some((issue) => issue.message.includes('is also used in chapter')),
    ).toBe(true);
  });

  it('rejects a title that drifts from the registry', () => {
    const issues = validateChapterCollection(
      [makeChapter({ title: 'Pronouns, renamed' })],
      registry,
    );
    expect(issues.some((issue) => issue.path === 'title')).toBe(true);
  });

  it('rejects a chapter that is not in the registry', () => {
    const issues = validateChapterCollection([makeChapter({ number: 99 })], registry);
    expect(
      issues.some((issue) =>
        issue.message.includes('not listed in the chapter registry'),
      ),
    ).toBe(true);
  });

  it('rejects a prerequisite that is not an earlier chapter', () => {
    const issues = validateChapterCollection(
      [makeChapter({ number: 1, prerequisites: [2] })],
      registry,
    );
    expect(
      issues.some((issue) => issue.message.includes('does not come before chapter 1')),
    ).toBe(true);
  });

  it('rejects a demo chapter that takes a registry number', () => {
    const issues = validateChapterCollection([makeChapter({ isDemo: true })], registry);
    expect(
      issues.some((issue) =>
        issue.message.includes('must not occupy a registry chapter'),
      ),
    ).toBe(true);
  });
});
