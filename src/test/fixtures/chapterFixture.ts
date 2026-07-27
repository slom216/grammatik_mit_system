import type { ChapterDefinition } from '../../schemas/chapterSchema';
import type {
  Exercise,
  SingleChoiceExercise,
  TextInputExercise,
} from '../../schemas/exerciseSchema';

/** A single-choice exercise that satisfies every content rule. */
export function makeSingleChoice(
  order: number,
  overrides: Partial<SingleChoiceExercise> = {},
): SingleChoiceExercise {
  return {
    id: `fixture-ex-${order}`,
    chapterNumber: 1,
    order,
    type: 'singleChoice',
    prompt: `Ich ___ Lehrer. (${order})`,
    level: 'recognition',
    grammarFocus: ['sein'],
    explanation: 'ich takes bin.',
    options: [
      { id: 'a', text: 'bin' },
      { id: 'b', text: 'bist' },
      { id: 'c', text: 'ist' },
    ],
    correctOptionId: 'a',
    ...overrides,
  };
}

/** A text-input exercise that satisfies every content rule. */
export function makeTextInput(
  order: number,
  overrides: Partial<TextInputExercise> = {},
): TextInputExercise {
  return {
    id: `fixture-ex-${order}`,
    chapterNumber: 1,
    order,
    type: 'textInput',
    prompt: `Du ___ freundlich. (${order})`,
    level: 'production',
    grammarFocus: ['sein'],
    explanation: 'du takes bist.',
    acceptedAnswers: ['bist'],
    answerMode: 'caseInsensitive',
    ...overrides,
  };
}

export function makeExercises(): Exercise[] {
  return [
    ...Array.from({ length: 12 }, (_unused, index) => makeSingleChoice(index + 1)),
    ...Array.from({ length: 12 }, (_unused, index) => makeTextInput(index + 13)),
  ];
}

/**
 * A chapter that passes validation. Overrides are applied on top so tests can
 * break exactly one rule at a time.
 */
export function makeChapter(
  overrides: Partial<ChapterDefinition> = {},
): ChapterDefinition {
  return {
    id: 'chapter-001',
    number: 1,
    slug: 'personal-pronouns',
    title: 'Personal Pronouns',
    level: 'A1',
    section: 'verbs-1',
    objective: 'Use German subject pronouns correctly.',
    prerequisites: [],
    estimatedMinutes: 20,
    tags: ['pronouns'],
    explanation: {
      introduction: ['German subject pronouns replace the acting person.'],
      rules: [
        {
          id: 'rule-1',
          heading: 'Singular pronouns',
          paragraphs: ['ich is the speaker, du is one person addressed informally.'],
        },
      ],
      tables: [],
      examples: Array.from({ length: 8 }, (_unused, index) => ({
        german: `Ich bin Nummer ${index + 1}.`,
        english: `I am number ${index + 1}.`,
      })),
      commonMistakes: Array.from({ length: 3 }, (_unused, index) => ({
        incorrect: `Ihr sind ${index}.`,
        correct: `Ihr seid ${index}.`,
        explanation: 'ihr takes seid.',
      })),
      remember: ['bin – bist – ist – sind – seid – sind'],
    },
    exercises: makeExercises(),
    mastery: {
      passingPercent: 80,
      minimumAnswered: 24,
      requiredCorrectTextInputs: 8,
    },
    ...overrides,
  };
}
