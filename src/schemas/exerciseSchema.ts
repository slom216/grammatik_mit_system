import { z } from 'zod';

/**
 * Exercise data model.
 *
 * The TypeScript interfaces are the source of truth for authoring; the Zod
 * schemas below enforce the same shape plus the content rules from the
 * specification (option counts, accepted answers, ...) at runtime.
 */

export const EXERCISE_TYPES = [
  'singleChoice',
  'textInput',
  'sentenceOrdering',
  'dragToSlots',
  'matching',
  'errorSpotting',
] as const;
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

export interface SentenceSegment {
  id: string;
  text: string;
}

export interface SentenceOrderingExercise extends ExerciseBase {
  type: 'sentenceOrdering';
  /**
   * The segments (words or short phrases) in their correct order. Learners see
   * them shuffled and drag them back into this order.
   */
  segments: SentenceSegment[];
}

export interface SlotDefinition {
  id: string;
  correctWord: string;
}

export interface DragToSlotsExercise extends ExerciseBase {
  type: 'dragToSlots';
  /**
   * Fixed sentence text around the slots. Always has exactly `slots.length + 1`
   * entries, interleaved as `templateParts[0] + slot0 + templateParts[1] +
   * slot1 + ... + templateParts[n]`.
   */
  templateParts: string[];
  slots: SlotDefinition[];
  /** All draggable words shown in the word bank, including distractors. */
  wordBank: string[];
}

export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

export interface MatchingExercise extends ExerciseBase {
  type: 'matching';
  /**
   * Related left/right pairs. The left column is shown in this order; the
   * right column is shuffled for display. A pair's `id` is shared by its left
   * and right side, which is how a correct match is defined.
   */
  pairs: MatchPair[];
}

export interface ErrorSpottingExercise extends ExerciseBase {
  type: 'errorSpotting';
  /** Word-level tokens making up the sentence, in display order. */
  tokens: string[];
  /** Index into `tokens` of the token containing the error. */
  errorTokenIndex: number;
  /** The corrected form of that token, shown once the exercise is resolved. */
  correction: string;
}

export type Exercise =
  | SingleChoiceExercise
  | TextInputExercise
  | SentenceOrderingExercise
  | DragToSlotsExercise
  | MatchingExercise
  | ErrorSpottingExercise;

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

export const sentenceSegmentSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

export const sentenceOrderingExerciseSchema = z
  .object({
    ...exerciseBaseShape,
    type: z.literal('sentenceOrdering'),
    segments: z
      .array(sentenceSegmentSchema)
      .min(3, 'A sentence-ordering exercise needs at least 3 segments')
      .max(10, 'A sentence-ordering exercise may have at most 10 segments'),
  })
  .superRefine((exercise, ctx) => {
    const ids = exercise.segments.map((segment) => segment.id);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['segments'],
        message: `Duplicate segment ids in exercise ${exercise.id}`,
      });
    }
  });

export const slotDefinitionSchema = z.object({
  id: z.string().min(1),
  correctWord: z.string().min(1),
});

export const dragToSlotsExerciseSchema = z
  .object({
    ...exerciseBaseShape,
    type: z.literal('dragToSlots'),
    templateParts: z
      .array(z.string())
      .min(2, 'A sentence template needs at least 2 parts around a slot'),
    slots: z
      .array(slotDefinitionSchema)
      .min(1, 'A drag-to-slots exercise needs at least one slot')
      .max(5, 'A drag-to-slots exercise may have at most 5 slots'),
    wordBank: z.array(z.string().min(1)).min(1),
  })
  .superRefine((exercise, ctx) => {
    if (exercise.templateParts.length !== exercise.slots.length + 1) {
      ctx.addIssue({
        code: 'custom',
        path: ['templateParts'],
        message: `Exercise ${exercise.id} has ${exercise.slots.length} slots but ${exercise.templateParts.length} template parts (expected ${exercise.slots.length + 1})`,
      });
    }

    const slotIds = exercise.slots.map((slot) => slot.id);
    if (new Set(slotIds).size !== slotIds.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['slots'],
        message: `Duplicate slot ids in exercise ${exercise.id}`,
      });
    }

    const bankCounts = new Map<string, number>();
    for (const word of exercise.wordBank) {
      bankCounts.set(word, (bankCounts.get(word) ?? 0) + 1);
    }
    const neededCounts = new Map<string, number>();
    for (const slot of exercise.slots) {
      neededCounts.set(slot.correctWord, (neededCounts.get(slot.correctWord) ?? 0) + 1);
    }
    for (const [word, needed] of neededCounts) {
      if ((bankCounts.get(word) ?? 0) < needed) {
        ctx.addIssue({
          code: 'custom',
          path: ['wordBank'],
          message: `Exercise ${exercise.id} needs "${word}" in the word bank at least ${needed} time(s) to fill its slots`,
        });
      }
    }

    if (exercise.wordBank.length <= exercise.slots.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['wordBank'],
        message: `Exercise ${exercise.id} should offer at least one distractor beyond its ${exercise.slots.length} slot(s)`,
      });
    }
  });

export const matchPairSchema = z.object({
  id: z.string().min(1),
  left: z.string().min(1),
  right: z.string().min(1),
});

export const matchingExerciseSchema = z
  .object({
    ...exerciseBaseShape,
    type: z.literal('matching'),
    pairs: z
      .array(matchPairSchema)
      .min(3, 'A matching exercise needs at least 3 pairs')
      .max(8, 'A matching exercise may have at most 8 pairs'),
  })
  .superRefine((exercise, ctx) => {
    const ids = exercise.pairs.map((pair) => pair.id);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['pairs'],
        message: `Duplicate pair ids in exercise ${exercise.id}`,
      });
    }

    const lefts = exercise.pairs.map((pair) => pair.left.trim());
    if (new Set(lefts).size !== lefts.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['pairs'],
        message: `Duplicate left-column text in exercise ${exercise.id}`,
      });
    }

    const rights = exercise.pairs.map((pair) => pair.right.trim());
    if (new Set(rights).size !== rights.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['pairs'],
        message: `Duplicate right-column text in exercise ${exercise.id}`,
      });
    }
  });

export const errorSpottingExerciseSchema = z
  .object({
    ...exerciseBaseShape,
    type: z.literal('errorSpotting'),
    tokens: z
      .array(z.string().min(1))
      .min(4, 'An error-spotting sentence needs at least 4 tokens'),
    errorTokenIndex: z.number().int().min(0),
    correction: z.string().min(1),
  })
  .superRefine((exercise, ctx) => {
    if (exercise.errorTokenIndex >= exercise.tokens.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['errorTokenIndex'],
        message: `errorTokenIndex ${exercise.errorTokenIndex} is out of bounds in exercise ${exercise.id}`,
      });
      return;
    }
    if (exercise.tokens[exercise.errorTokenIndex]?.trim() === exercise.correction.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['correction'],
        message: `correction must differ from the erroneous token in exercise ${exercise.id}`,
      });
    }
  });

export const exerciseSchema = z.discriminatedUnion('type', [
  singleChoiceExerciseSchema,
  textInputExerciseSchema,
  sentenceOrderingExerciseSchema,
  dragToSlotsExerciseSchema,
  matchingExerciseSchema,
  errorSpottingExerciseSchema,
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

export function isSentenceOrdering(
  exercise: Exercise,
): exercise is SentenceOrderingExercise {
  return exercise.type === 'sentenceOrdering';
}

export function isDragToSlots(exercise: Exercise): exercise is DragToSlotsExercise {
  return exercise.type === 'dragToSlots';
}

export function isMatching(exercise: Exercise): exercise is MatchingExercise {
  return exercise.type === 'matching';
}

export function isErrorSpotting(exercise: Exercise): exercise is ErrorSpottingExercise {
  return exercise.type === 'errorSpotting';
}
