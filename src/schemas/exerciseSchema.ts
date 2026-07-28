import { z } from 'zod';

/**
 * Exercise data model.
 *
 * The TypeScript interfaces are the source of truth for authoring; the Zod
 * schemas below enforce the same shape plus the content rules from the
 * specification (option counts, accepted answers, ...) at runtime.
 */

export const EXERCISE_TYPES = ['singleChoice', 'textInput'] as const;
export type ExerciseType = (typeof EXERCISE_TYPES)[number];

export const EXERCISE_LEVELS = [
  'recognition',
  'controlled',
  'production',
  'transfer',
] as const;
export type ExerciseLevel = (typeof EXERCISE_LEVELS)[number];

export const ANSWER_MODES = [
  'exact',
  'normalized',
  'caseInsensitive',
  'punctuationInsensitive',
] as const;
export type AnswerMode = (typeof ANSWER_MODES)[number];

export interface DialogueLine {
  speaker: string;
  german: string;
  english?: string;
}

export interface ExerciseBase {
  id: string;
  chapterNumber: number;
  order: number;
  type: ExerciseType;
  prompt: string;
  instruction?: string;
  level: ExerciseLevel;
  grammarFocus: string[];
  hint?: string;
  explanation: string;
  /**
   * Optional short conversational exchange shown above the prompt, for
   * exercises where the answer depends on register or pragmatics (modal
   * particles, connectors, conjunctions) rather than on the sentence alone.
   */
  dialogue?: DialogueLine[];
}

export interface ExerciseOption {
  id: string;
  text: string;
}

export interface SingleChoiceExercise extends ExerciseBase {
  type: 'singleChoice';
  options: ExerciseOption[];
  correctOptionId: string;
}

export interface TextInputExercise extends ExerciseBase {
  type: 'textInput';
  acceptedAnswers: string[];
  answerMode: AnswerMode;
  placeholder?: string;
  maxLength?: number;
  requiredTokens?: string[];
  /** Render a textarea instead of a single-line input (multi-clause sentences). */
  multiline?: boolean;
}

export type Exercise = SingleChoiceExercise | TextInputExercise;

export const dialogueLineSchema = z.object({
  speaker: z.string().min(1),
  german: z.string().min(1),
  english: z.string().min(1).optional(),
});

const exerciseBaseShape = {
  id: z.string().min(1, 'Exercise id is required'),
  chapterNumber: z.number().int().min(0),
  order: z.number().int().min(1),
  prompt: z.string().min(1, 'Exercise prompt is required'),
  instruction: z.string().min(1).optional(),
  level: z.enum(EXERCISE_LEVELS),
  grammarFocus: z.array(z.string().min(1)).min(1, 'At least one grammar focus tag'),
  hint: z.string().min(1).optional(),
  explanation: z.string().min(1, 'Every exercise needs an answer explanation'),
  dialogue: z
    .array(dialogueLineSchema)
    .min(2, 'A dialogue needs at least two lines')
    .optional(),
};

export const exerciseOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

export const singleChoiceExerciseSchema = z
  .object({
    ...exerciseBaseShape,
    type: z.literal('singleChoice'),
    options: z
      .array(exerciseOptionSchema)
      .min(3, 'A single-choice exercise needs at least 3 options')
      .max(5, 'A single-choice exercise may have at most 5 options'),
    correctOptionId: z.string().min(1),
  })
  .superRefine((exercise, ctx) => {
    const ids = exercise.options.map((option) => option.id);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['options'],
        message: `Duplicate option ids in exercise ${exercise.id}`,
      });
    }
    if (!ids.includes(exercise.correctOptionId)) {
      ctx.addIssue({
        code: 'custom',
        path: ['correctOptionId'],
        message: `correctOptionId "${exercise.correctOptionId}" does not match any option in exercise ${exercise.id}`,
      });
    }
    // Compared case-sensitively: some exercises teach capitalisation, so
    // "Sie" and "sie" are legitimately different options.
    const texts = exercise.options.map((option) => option.text.trim());
    if (new Set(texts).size !== texts.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['options'],
        message: `Duplicate option texts in exercise ${exercise.id}`,
      });
    }
  });

export const textInputExerciseSchema = z
  .object({
    ...exerciseBaseShape,
    type: z.literal('textInput'),
    acceptedAnswers: z
      .array(z.string().min(1))
      .min(1, 'A text-input exercise needs at least one accepted answer'),
    answerMode: z.enum(ANSWER_MODES),
    placeholder: z.string().optional(),
    maxLength: z.number().int().positive().optional(),
    requiredTokens: z.array(z.string().min(1)).optional(),
    multiline: z.boolean().optional(),
  })
  .superRefine((exercise, ctx) => {
    const answers = exercise.acceptedAnswers.map((answer) => answer.trim());
    if (new Set(answers).size !== answers.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['acceptedAnswers'],
        message: `Duplicate accepted answers in exercise ${exercise.id}`,
      });
    }
    if (exercise.maxLength !== undefined) {
      const longest = Math.max(...answers.map((answer) => answer.length));
      if (longest > exercise.maxLength) {
        ctx.addIssue({
          code: 'custom',
          path: ['maxLength'],
          message: `maxLength ${exercise.maxLength} is shorter than an accepted answer in exercise ${exercise.id}`,
        });
      }
    }
  });

export const exerciseSchema = z.discriminatedUnion('type', [
  singleChoiceExerciseSchema,
  textInputExerciseSchema,
]);

/** Compile-time proof that the Zod schema and the interfaces stay in sync. */
type AssertAssignable<Target, Value extends Target> = Value;
export type ExerciseSchemaMatchesInterface = AssertAssignable<
  Exercise,
  z.infer<typeof exerciseSchema>
>;

export function isSingleChoice(exercise: Exercise): exercise is SingleChoiceExercise {
  return exercise.type === 'singleChoice';
}

export function isTextInput(exercise: Exercise): exercise is TextInputExercise {
  return exercise.type === 'textInput';
}
