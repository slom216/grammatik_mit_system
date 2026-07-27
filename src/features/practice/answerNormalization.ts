import type {
  AnswerMode,
  SingleChoiceExercise,
  TextInputExercise,
} from '../../schemas/exerciseSchema';

/**
 * Answer checking is a pure service: no React, no store access, no side effects.
 * Normalization is always exercise-specific — German capitalisation carries
 * meaning, so nothing is lowercased unless the exercise asks for it.
 */

const PUNCTUATION = /[.,!?;:…„“”"'’`()[\]{}]/g;

/** Whitespace, quotation marks and Unicode composition only. Case is preserved. */
export function normalizeBasic(value: string): string {
  // \s already covers regular spaces, tabs, newlines and non-breaking spaces.
  return value
    .normalize('NFC')
    .replace(/[\u201e\u201c\u201d]/g, '"')
    .replace(/[\u201a\u2018\u2019\u00b4`]/g, "'")
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeForMode(value: string, mode: AnswerMode): string {
  switch (mode) {
    case 'exact':
      // Only surrounding whitespace and Unicode composition are forgiven.
      return value.normalize('NFC').trim();
    case 'normalized':
      return normalizeBasic(value);
    case 'caseInsensitive':
      return normalizeBasic(value).toLocaleLowerCase('de-DE');
    case 'punctuationInsensitive':
      return normalizeBasic(value).replace(PUNCTUATION, '').replace(/\s+/g, ' ').trim();
  }
}

/** Strips a single trailing full stop, if present. Question and exclamation marks are untouched. */
function withoutOptionalFullStop(value: string): string {
  return value.endsWith('.') ? value.slice(0, -1) : value;
}

export function tokenize(value: string): string[] {
  return normalizeBasic(value)
    .replace(PUNCTUATION, ' ')
    .toLocaleLowerCase('de-DE')
    .split(/\s+/)
    .filter((token) => token.length > 0);
}

export interface TextAnswerCheck {
  correct: boolean;
  normalizedAnswer: string;
  matchedAnswer?: string;
  /** Required tokens from the exercise that the learner did not write. */
  missingTokens: string[];
  /** True when the answer only differs from an accepted answer in capitalisation. */
  capitalisationOnlyMismatch: boolean;
}

/**
 * Checks a learner answer against a text-input exercise.
 *
 * An answer is correct when it matches one of the accepted answers under the
 * exercise's answer mode AND contains every required token.
 */
export function checkTextAnswer(
  exercise: TextInputExercise,
  rawAnswer: string,
): TextAnswerCheck {
  const mode = exercise.answerMode;
  const normalizedAnswer = normalizeForMode(rawAnswer, mode);

  // A missing final full stop still counts as correct for a declarative
  // sentence — but a question mark is never optional, so a question is only
  // matched when it was actually asked. 'exact' stays byte-strict on request;
  // 'punctuationInsensitive' already ignores all punctuation.
  const fullStopOptional = mode === 'normalized' || mode === 'caseInsensitive';
  const matchedAnswer = exercise.acceptedAnswers.find((accepted) => {
    const normalizedAccepted = normalizeForMode(accepted, mode);
    if (normalizedAccepted === normalizedAnswer) return true;
    if (!fullStopOptional || normalizedAccepted.endsWith('?')) return false;
    return (
      withoutOptionalFullStop(normalizedAccepted) ===
      withoutOptionalFullStop(normalizedAnswer)
    );
  });

  const answerTokens = new Set(tokenize(rawAnswer));
  const missingTokens = (exercise.requiredTokens ?? []).filter(
    (token) => !answerTokens.has(token.toLocaleLowerCase('de-DE')),
  );

  const capitalisationOnlyMismatch =
    matchedAnswer === undefined &&
    normalizedAnswer.length > 0 &&
    exercise.acceptedAnswers.some(
      (accepted) =>
        normalizeForMode(accepted, 'caseInsensitive') ===
        normalizeForMode(rawAnswer, 'caseInsensitive'),
    );

  return {
    correct: matchedAnswer !== undefined && missingTokens.length === 0,
    normalizedAnswer,
    matchedAnswer,
    missingTokens,
    capitalisationOnlyMismatch,
  };
}

export function checkSingleChoiceAnswer(
  exercise: SingleChoiceExercise,
  optionId: string | null,
): boolean {
  return optionId !== null && optionId === exercise.correctOptionId;
}

/** The answer shown to the learner when an answer is revealed. */
export function primaryAcceptedAnswer(exercise: TextInputExercise): string {
  return exercise.acceptedAnswers[0] ?? '';
}

/** Characters offered by the umlaut helper next to every text input. */
export const GERMAN_SPECIAL_CHARACTERS = [
  { character: 'ä', label: 'a umlaut, lowercase' },
  { character: 'ö', label: 'o umlaut, lowercase' },
  { character: 'ü', label: 'u umlaut, lowercase' },
  { character: 'ß', label: 'sharp s, eszett' },
  { character: 'Ä', label: 'A umlaut, uppercase' },
  { character: 'Ö', label: 'O umlaut, uppercase' },
  { character: 'Ü', label: 'U umlaut, uppercase' },
] as const;
