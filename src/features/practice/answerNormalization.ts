import type {
  AnswerMode,
  DragToSlotsExercise,
  ErrorSpottingExercise,
  MatchingExercise,
  SentenceOrderingExercise,
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

/** Letters only, lowercased. Separators like `/`, `–` and `+` are not words. */
function promptWords(value: string): string[] {
  return normalizeBasic(value)
    .toLocaleLowerCase('de-DE')
    .split(/[^\p{L}]+/u)
    .filter(Boolean);
}

/**
 * True when the prompt already lists every word the learner has to arrange —
 * usually in the answer's own order (`Ich / bin / sehr / müde.`), sometimes as
 * the finished sentence outright. Such a prompt gives the exercise away and
 * says nothing the segments do not, so the UI drops it. A prompt that frames
 * the task instead ("Build a sentence: he works every day in the office.") has
 * words of its own and is kept.
 */
export function promptListsSegments(exercise: SentenceOrderingExercise): boolean {
  const available = new Map<string, number>();
  for (const word of promptWords(exercise.prompt)) {
    available.set(word, (available.get(word) ?? 0) + 1);
  }
  for (const segment of exercise.segments) {
    for (const word of promptWords(segment.text)) {
      const left = available.get(word) ?? 0;
      if (left === 0) return false;
      available.set(word, left - 1);
    }
  }
  return true;
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

/* ------------------------------------------------------------------ */
/* Sentence ordering                                                   */
/* ------------------------------------------------------------------ */

export function checkSentenceOrderingAnswer(
  exercise: SentenceOrderingExercise,
  orderedIds: string[],
): boolean {
  const correctOrder = exercise.segments.map((segment) => segment.id);
  return (
    orderedIds.length === correctOrder.length &&
    orderedIds.every((id, index) => id === correctOrder[index])
  );
}

function sentenceOrderingText(exercise: SentenceOrderingExercise, ids: string[]): string {
  return ids
    .map((id) => exercise.segments.find((segment) => segment.id === id)?.text ?? '')
    .join(' ');
}

export function sentenceOrderingAnswerText(
  exercise: SentenceOrderingExercise,
  orderedIds: string[],
): string {
  return sentenceOrderingText(exercise, orderedIds);
}

export function correctSentenceOrderingText(exercise: SentenceOrderingExercise): string {
  return sentenceOrderingText(
    exercise,
    exercise.segments.map((segment) => segment.id),
  );
}

/* ------------------------------------------------------------------ */
/* Drag words into sentence slots                                      */
/* ------------------------------------------------------------------ */

export function checkDragToSlotsAnswer(
  exercise: DragToSlotsExercise,
  placedWords: Record<string, string>,
): boolean {
  return exercise.slots.every(
    (slot) => placedWords[slot.id]?.trim() === slot.correctWord.trim(),
  );
}

function assembleDragToSlotsSentence(
  exercise: DragToSlotsExercise,
  wordForSlot: (slotId: string) => string,
): string {
  return exercise.templateParts.reduce((sentence, part, index) => {
    const slot = exercise.slots[index];
    return sentence + part + (slot ? wordForSlot(slot.id) : '');
  }, '');
}

export function dragToSlotsAnswerText(
  exercise: DragToSlotsExercise,
  placedWords: Record<string, string>,
): string {
  return assembleDragToSlotsSentence(exercise, (slotId) => placedWords[slotId] ?? '___');
}

export function correctDragToSlotsText(exercise: DragToSlotsExercise): string {
  return assembleDragToSlotsSentence(
    exercise,
    (slotId) => exercise.slots.find((slot) => slot.id === slotId)?.correctWord ?? '',
  );
}

/* ------------------------------------------------------------------ */
/* Matching                                                             */
/* ------------------------------------------------------------------ */

/**
 * `matches` maps a pair's id (the left item chosen) to the pair id of the
 * right item the learner connected it to. A match is correct exactly when a
 * left item is connected to the right item sharing its own pair id.
 */
export function checkMatchingAnswer(
  exercise: MatchingExercise,
  matches: Record<string, string>,
): boolean {
  return exercise.pairs.every((pair) => matches[pair.id] === pair.id);
}

function matchingText(
  exercise: MatchingExercise,
  rightIdFor: (pair: MatchingExercise['pairs'][number]) => string | undefined,
): string {
  return exercise.pairs
    .map((pair) => {
      const rightId = rightIdFor(pair);
      const rightText = exercise.pairs.find(
        (candidate) => candidate.id === rightId,
      )?.right;
      return `${pair.left} → ${rightText ?? '?'}`;
    })
    .join(', ');
}

export function matchingAnswerText(
  exercise: MatchingExercise,
  matches: Record<string, string>,
): string {
  return matchingText(exercise, (pair) => matches[pair.id]);
}

export function correctMatchingText(exercise: MatchingExercise): string {
  return matchingText(exercise, (pair) => pair.id);
}

/* ------------------------------------------------------------------ */
/* Error spotting                                                       */
/* ------------------------------------------------------------------ */

/**
 * True when the exercise also asks the learner to type the correction. Picking
 * the token alone is a one-in-six guess, while producing the right form is the
 * grammar point every one of these exercises is actually about. Multi-word
 * corrections are whole-sentence rewrites rather than a token swap, so those
 * stay recognition-only.
 */
export function requiresCorrectionInput(exercise: ErrorSpottingExercise): boolean {
  return !/\s/.test(exercise.correction);
}

export function checkErrorSpottingAnswer(
  exercise: ErrorSpottingExercise,
  tokenIndex: number,
  correction: string,
): boolean {
  if (tokenIndex !== exercise.errorTokenIndex) return false;
  if (!requiresCorrectionInput(exercise)) return true;
  // Capitalisation carries meaning in German and stays strict. The full stop or
  // comma a correction inherits from its token does not, so it is forgiven.
  return (
    normalizeForMode(correction, 'punctuationInsensitive') ===
    normalizeForMode(exercise.correction, 'punctuationInsensitive')
  );
}

export function errorSpottingAnswerText(
  exercise: ErrorSpottingExercise,
  tokenIndex: number,
  correction: string,
): string {
  const token = exercise.tokens[tokenIndex] ?? '';
  return requiresCorrectionInput(exercise) ? `${token} → ${correction.trim()}` : token;
}

export function correctErrorSpottingText(exercise: ErrorSpottingExercise): string {
  return `${exercise.tokens[exercise.errorTokenIndex] ?? ''} → ${exercise.correction}`;
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
