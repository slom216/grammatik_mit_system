import type { ChapterDefinition, Exercise } from '../schemas/chapterSchema';

export interface AuditFinding {
  chapter: number;
  kind:
    | 'duplicate-prompt'
    | 'duplicate-question'
    | 'near-duplicate-prompt'
    | 'whitespace';
  exerciseIds: string[];
  detail: string;
}

/** Lowercase, punctuation-free words, for comparing two prompts by meaning. */
function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,!?;:()"„“”—–]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Case- and whitespace-insensitive, but punctuation is kept: a comma is the
 * whole point of some exercises, so two sentences that differ only by one are
 * not the same exercise.
 */
function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Share of words two prompts have in common (Jaccard). */
export function similarity(a: string, b: string): number {
  const left = new Set(tokens(a));
  const right = new Set(tokens(b));
  if (left.size === 0 || right.size === 0) return 0;
  let shared = 0;
  for (const token of left) if (right.has(token)) shared += 1;
  return shared / (left.size + right.size - shared);
}

/**
 * Everything that makes an exercise distinct: the prompt plus the material the
 * learner works with. Many prompts are shared instructions ("Match the noun to
 * its pronoun."), so comparing prompts alone would flag every one of them.
 */
function promptText(exercise: Exercise): string {
  const parts = [exercise.prompt];
  switch (exercise.type) {
    case 'singleChoice':
      parts.push(exercise.options.map((option) => option.text).join(' '));
      break;
    case 'textInput':
      parts.push(exercise.acceptedAnswers.join(' '));
      break;
    case 'dragToSlots':
      parts.push(exercise.templateParts.join(' ___ '), exercise.wordBank.join(' '));
      break;
    case 'errorSpotting':
      parts.push(exercise.tokens.join(' '));
      break;
    case 'sentenceOrdering':
      parts.push(exercise.segments.map((segment) => segment.text).join(' '));
      break;
    case 'matching':
      parts.push(
        exercise.pairs.map((pair) => `${pair.left}=${pair.right}`).join(' '),
      );
      break;
  }
  return parts.join(' ');
}

/** What counts as the right answer, for spotting two items with one answer. */
function answerText(exercise: Exercise): string {
  switch (exercise.type) {
    case 'singleChoice':
      return (
        exercise.options.find((option) => option.id === exercise.correctOptionId)?.text ??
        ''
      );
    case 'textInput':
      return [...exercise.acceptedAnswers].sort().join('|');
    case 'dragToSlots':
      return exercise.slots.map((slot) => slot.correctWord).join(' ');
    case 'errorSpotting':
      return `${exercise.errorTokenIndex}:${exercise.correction}`;
    case 'sentenceOrdering':
      return exercise.segments.map((segment) => segment.text).join(' ');
    case 'matching':
      return exercise.pairs.map((pair) => `${pair.left}=${pair.right}`).join(' ');
  }
}

/**
 * The identity of an exercise. Two exercises can share a sentence and still ask
 * different questions ("which verb is finite?" / "which closes the bracket?"),
 * so the instruction and the type are part of it.
 */
function identity(exercise: Exercise): string {
  return normalize(
    [exercise.type, exercise.instruction ?? '', promptText(exercise)].join(' | '),
  );
}

/**
 * Quality checks that go beyond the schema: exercises that repeat each other,
 * or that give their own answer away. Reported rather than enforced — these are
 * judgement calls, and a near-duplicate is sometimes deliberate drilling.
 */
export function auditChapter(chapter: ChapterDefinition, threshold = 0.9): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const exercises = chapter.exercises;

  const seen = new Map<string, string>();
  for (const exercise of exercises) {
    const key = identity(exercise);
    const owner = seen.get(key);
    if (owner) {
      findings.push({
        chapter: chapter.number,
        kind: 'duplicate-prompt',
        exerciseIds: [owner, exercise.id],
        detail: `identical prompt: "${exercise.prompt}"`,
      });
    } else {
      seen.set(key, exercise.id);
    }
  }

  // Same sentence, same expected answer, only the wording of the instruction
  // differs: the learner answers the same thing twice.
  const answers = new Map<string, string>();
  for (const exercise of exercises) {
    // promptText, not prompt: for error-spotting the prompt is a generic
    // instruction and the sentence lives in the tokens.
    const key = normalize(
      [exercise.type, promptText(exercise), answerText(exercise)].join(' | '),
    );
    const owner = answers.get(key);
    if (owner && seen.get(identity(exercise)) !== owner) {
      findings.push({
        chapter: chapter.number,
        kind: 'duplicate-question',
        exerciseIds: [owner, exercise.id],
        detail: `same prompt and same answer: "${exercise.prompt}"`,
      });
    } else if (!owner) {
      answers.set(key, exercise.id);
    }
  }

  for (let i = 0; i < exercises.length; i += 1) {
    for (let j = i + 1; j < exercises.length; j += 1) {
      const a = exercises[i];
      const b = exercises[j];
      if (!a || !b || a.type !== b.type) continue;
      const score = similarity(promptText(a), promptText(b));
      if (score >= threshold && score < 1) {
        findings.push({
          chapter: chapter.number,
          kind: 'near-duplicate-prompt',
          exerciseIds: [a.id, b.id],
          detail: `${Math.round(score * 100)}% overlap: "${a.prompt}" / "${b.prompt}"`,
        });
      }
    }
  }

  // Deliberately not checked: whether an accepted answer appears in the prompt.
  // Transformation exercises ("Ihr helft mir." → "Helft mir!") and cue words in
  // brackets reuse the answer's words by design, so every hit was a false one.

  for (const exercise of exercises) {
    const text = exercise.prompt;
    if (/ {2,}/.test(text) || text !== text.trim()) {
      findings.push({
        chapter: chapter.number,
        kind: 'whitespace',
        exerciseIds: [exercise.id],
        detail: `stray whitespace in "${exercise.prompt}"`,
      });
    }
  }

  return findings;
}

export function auditChapters(
  chapters: readonly ChapterDefinition[],
  threshold?: number,
): AuditFinding[] {
  return chapters.flatMap((chapter) => auditChapter(chapter, threshold));
}
