import { z } from 'zod';
import {
  exerciseSchema,
  type Exercise,
  type SingleChoiceExercise,
  type TextInputExercise,
} from './exerciseSchema';

/** Content thresholds required by the specification. */
export const CONTENT_RULES = {
  minExercises: 24,
  minSingleChoice: 12,
  minTextInput: 12,
  minExamples: 8,
  minCommonMistakes: 3,
  minRememberPoints: 1,
} as const;

export const CEFR_LEVELS = ['A1', 'A2', 'B1'] as const;
export type CefrLevel = (typeof CEFR_LEVELS)[number];

export const CHAPTER_SECTIONS = [
  'verbs-1',
  'sentences-and-questions',
  'pronouns-nouns-articles',
  'verbs-2',
  'prepositions-1',
  'adjectives-1',
  'sentence-connections-1',
  'words-and-word-formation',
  'verbs-3',
  'nouns-2',
  'sentence-connections-2',
  'prepositions-2',
  'adjectives-2',
] as const;
export type ChapterSection = (typeof CHAPTER_SECTIONS)[number];

/** Grammatical cases a grammar-table column can be tagged with for visual highlighting. */
export const CASE_LABELS = [
  'nominative',
  'accusative',
  'dative',
  'genitive',
  'two-way',
] as const;
export type CaseLabel = (typeof CASE_LABELS)[number];

export interface GrammarRule {
  id: string;
  heading: string;
  paragraphs: string[];
  notes?: string[];
}

export interface GrammarTableDefinition {
  id: string;
  title: string;
  columns: string[];
  rows: string[][];
  note?: string;
  /**
   * Optional case tag per column (same length as `columns`), used to render a
   * color-coded case badge in the column header. `null` leaves a column
   * untagged. Use `'two-way'` for columns covering two-way prepositions that
   * govern either the accusative or the dative depending on context.
   */
  columnCases?: (CaseLabel | null)[];
}

export interface GrammarExample {
  german: string;
  english: string;
  explanation?: string;
  highlight?: string[];
}

export interface CommonMistake {
  incorrect: string;
  correct: string;
  explanation: string;
}

export interface GrammarExplanation {
  introduction: string[];
  rules: GrammarRule[];
  tables: GrammarTableDefinition[];
  examples: GrammarExample[];
  commonMistakes: CommonMistake[];
  remember: string[];
}

export interface MasteryRule {
  passingPercent: number;
  minimumAnswered: number;
  requiredCorrectTextInputs?: number;
  maxOpenReviewFlags?: number;
}

export interface ChapterDefinition {
  id: string;
  number: number;
  slug: string;
  title: string;
  germanTitle?: string;
  level: CefrLevel;
  section: ChapterSection;
  objective: string;
  prerequisites: number[];
  estimatedMinutes: number;
  explanation: GrammarExplanation;
  exercises: Exercise[];
  mastery: MasteryRule;
  tags: string[];
  /** Engine demo content that is not part of the published course. */
  isDemo?: boolean;
}

export const grammarRuleSchema = z.object({
  id: z.string().min(1),
  heading: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
  notes: z.array(z.string().min(1)).optional(),
});

export const grammarTableSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    columns: z.array(z.string().min(1)).min(2),
    rows: z.array(z.array(z.string())).min(1),
    note: z.string().min(1).optional(),
    columnCases: z.array(z.enum(CASE_LABELS).nullable()).optional(),
  })
  .superRefine((table, ctx) => {
    table.rows.forEach((row, index) => {
      if (row.length !== table.columns.length) {
        ctx.addIssue({
          code: 'custom',
          path: ['rows', index],
          message: `Row ${index + 1} of table "${table.id}" has ${row.length} cells but the table has ${table.columns.length} columns`,
        });
      }
    });
    if (table.columnCases && table.columnCases.length !== table.columns.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['columnCases'],
        message: `Table "${table.id}" has ${table.columnCases.length} columnCases entries but ${table.columns.length} columns`,
      });
    }
  });

export const grammarExampleSchema = z.object({
  german: z.string().min(1),
  english: z.string().min(1, 'Every example needs an English translation'),
  explanation: z.string().min(1).optional(),
  highlight: z.array(z.string().min(1)).optional(),
});

export const commonMistakeSchema = z.object({
  incorrect: z.string().min(1),
  correct: z.string().min(1),
  explanation: z.string().min(1),
});

export const grammarExplanationSchema = z.object({
  introduction: z
    .array(z.string().min(1))
    .min(1, 'An introduction paragraph is required'),
  rules: z.array(grammarRuleSchema).min(1, 'At least one grammar rule is required'),
  tables: z.array(grammarTableSchema),
  examples: z
    .array(grammarExampleSchema)
    .min(CONTENT_RULES.minExamples, `At least ${CONTENT_RULES.minExamples} examples`),
  commonMistakes: z
    .array(commonMistakeSchema)
    .min(
      CONTENT_RULES.minCommonMistakes,
      `At least ${CONTENT_RULES.minCommonMistakes} common mistakes`,
    ),
  remember: z
    .array(z.string().min(1))
    .min(CONTENT_RULES.minRememberPoints, 'A "Remember" summary is required'),
});

export const masteryRuleSchema = z.object({
  passingPercent: z.number().min(1).max(100),
  minimumAnswered: z.number().int().min(1),
  requiredCorrectTextInputs: z.number().int().min(0).optional(),
  maxOpenReviewFlags: z.number().int().min(0).optional(),
});

export const chapterSchema = z
  .object({
    id: z.string().min(1),
    number: z.number({ error: 'Chapter number is required' }).int().min(0),
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase kebab-case'),
    title: z.string().min(1),
    germanTitle: z.string().min(1).optional(),
    level: z.enum(CEFR_LEVELS),
    section: z.enum(CHAPTER_SECTIONS),
    objective: z.string().min(1),
    prerequisites: z.array(z.number().int().min(1)),
    estimatedMinutes: z.number().int().positive(),
    explanation: grammarExplanationSchema,
    exercises: z.array(exerciseSchema),
    mastery: masteryRuleSchema,
    tags: z.array(z.string().min(1)),
    isDemo: z.boolean().optional(),
  })
  .superRefine((chapter, ctx) => {
    const { exercises } = chapter;

    if (exercises.length < CONTENT_RULES.minExercises) {
      ctx.addIssue({
        code: 'custom',
        path: ['exercises'],
        message: `Chapter ${chapter.number} has ${exercises.length} exercises, at least ${CONTENT_RULES.minExercises} are required`,
      });
    }

    const singleChoiceCount = exercises.filter((e) => e.type === 'singleChoice').length;
    if (singleChoiceCount < CONTENT_RULES.minSingleChoice) {
      ctx.addIssue({
        code: 'custom',
        path: ['exercises'],
        message: `Chapter ${chapter.number} has ${singleChoiceCount} single-choice exercises, at least ${CONTENT_RULES.minSingleChoice} are required`,
      });
    }

    const textInputCount = exercises.filter((e) => e.type === 'textInput').length;
    if (textInputCount < CONTENT_RULES.minTextInput) {
      ctx.addIssue({
        code: 'custom',
        path: ['exercises'],
        message: `Chapter ${chapter.number} has ${textInputCount} text-input exercises, at least ${CONTENT_RULES.minTextInput} are required`,
      });
    }

    const ids = exercises.map((exercise) => exercise.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['exercises'],
        message: `Duplicate exercise ids in chapter ${chapter.number}: ${[...new Set(duplicateIds)].join(', ')}`,
      });
    }

    exercises.forEach((exercise, index) => {
      if (exercise.chapterNumber !== chapter.number) {
        ctx.addIssue({
          code: 'custom',
          path: ['exercises', index, 'chapterNumber'],
          message: `Exercise ${exercise.id} declares chapter ${exercise.chapterNumber} but lives in chapter ${chapter.number}`,
        });
      }
    });

    const orders = exercises.map((exercise) => exercise.order);
    if (new Set(orders).size !== orders.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['exercises'],
        message: `Duplicate exercise order values in chapter ${chapter.number}`,
      });
    }

    if (chapter.prerequisites.includes(chapter.number)) {
      ctx.addIssue({
        code: 'custom',
        path: ['prerequisites'],
        message: `Chapter ${chapter.number} lists itself as a prerequisite`,
      });
    }

    if (chapter.mastery.minimumAnswered > exercises.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['mastery', 'minimumAnswered'],
        message: `Chapter ${chapter.number} requires ${chapter.mastery.minimumAnswered} answered exercises but only has ${exercises.length}`,
      });
    }

    const requiredTextInputs = chapter.mastery.requiredCorrectTextInputs ?? 0;
    if (requiredTextInputs > textInputCount) {
      ctx.addIssue({
        code: 'custom',
        path: ['mastery', 'requiredCorrectTextInputs'],
        message: `Chapter ${chapter.number} requires ${requiredTextInputs} correct text inputs but only has ${textInputCount} text-input exercises`,
      });
    }
  });

/** Compile-time proof that the Zod schema and the interfaces stay in sync. */
type AssertAssignable<Target, Value extends Target> = Value;
export type ChapterSchemaMatchesInterface = AssertAssignable<
  ChapterDefinition,
  z.infer<typeof chapterSchema>
>;

export type { Exercise, SingleChoiceExercise, TextInputExercise };
