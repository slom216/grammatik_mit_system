import type { ExerciseHistory } from '../../schemas/progressSchema';
import { EXERCISE_LEVELS, EXERCISE_TYPES } from '../../schemas/exerciseSchema';

/**
 * Accuracy per grammar topic, aggregated from the `grammarFocus` tags every
 * exercise carries.
 *
 * Chapter scores say where the learner has been; these say what they keep
 * getting wrong. Tags recur across chapters on purpose — `ending-agreement`
 * shows up wherever endings agree — so a weak topic surfaces even when no
 * single chapter's score looks bad.
 */
export interface WeakSpot {
  tag: string;
  /** Human-readable form of the tag, e.g. `ending-agreement` → `Ending agreement`. */
  label: string;
  answered: number;
  correct: number;
  accuracyPercent: number;
  /** Chapters holding exercises tagged with this topic, lowest first. */
  chapterNumbers: number[];
}

/**
 * Below this, one unlucky session would rank a topic as the learner's weakest.
 * The tag vocabulary has a long tail — most tags are used by a handful of
 * exercises — so without a floor the list is mostly noise.
 */
export const MIN_ANSWERS_FOR_WEAK_SPOT = 5;

export interface WeakSpotOptions {
  minimumAnswers?: number;
  limit?: number;
}

// German words whose final "s" is not an English plural.
const NOT_PLURAL = new Set([
  'alles',
  'angesichts',
  'diesseits',
  'durchs',
  'etwas',
  'jenseits',
  'links',
  'nichts',
  'rechts',
]);

/**
 * One key per topic. Content authors spelled the same tag several ways
 * (`dragToSlots` / `drag-to-slots`, `comma-rule` / `comma-rules`,
 * `accusative` / `accusative-case`), which split one weakness in two.
 */
export function topicKey(tag: string): string {
  const key = tag
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/^(nominative|accusative|dative|genitive)-case$/, '$1');
  const last = key.slice(key.lastIndexOf('-') + 1);
  // ponytail: naive English singular (drop a final "s" on words of 5+ letters, not -ss/-is/-us),
  // with a stoplist for German words; swap for an explicit alias map if it misfires.
  return /^[a-z]{3,}[^isu]s$/.test(last) && !NOT_PLURAL.has(last)
    ? key.slice(0, -1)
    : key;
}

/**
 * Tags that name an exercise format or difficulty rather than grammar, so they
 * never rank as a topic. Compared by `topicKey`.
 */
const NON_TOPIC_TAGS = new Set(
  [
    ...EXERCISE_TYPES,
    ...EXERCISE_LEVELS,
    'error-spotting',
    'spot-the-error',
    'error-recognition',
    'common-mistakes',
    'sentence-order',
    'sentence-production',
    'fill-in',
    'fill-in-the-blank',
    'translation',
    'dialogue',
    'sorting',
    'choice',
    'mixed-review',
  ].map(topicKey),
);

export function isTopicTag(tag: string): boolean {
  return !NON_TOPIC_TAGS.has(topicKey(tag));
}

export function humanizeTag(tag: string): string {
  const spaced = tag.replace(/-/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * The learner's weakest topics, least accurate first. Only topics answered at
 * least `minimumAnswers` times are ranked.
 */
export function selectWeakSpots(
  exerciseHistory: Record<string, ExerciseHistory>,
  { minimumAnswers = MIN_ANSWERS_FOR_WEAK_SPOT, limit }: WeakSpotOptions = {},
): WeakSpot[] {
  const byTag = new Map<
    string,
    { answered: number; correct: number; chapters: Set<number> }
  >();

  for (const history of Object.values(exerciseHistory)) {
    if (history.timesAnswered === 0) continue;
    // A Set, so two spellings of one topic on the same exercise count once.
    const tags = new Set(history.grammarFocus.filter(isTopicTag).map(topicKey));
    for (const tag of tags) {
      const entry = byTag.get(tag) ?? { answered: 0, correct: 0, chapters: new Set() };
      entry.answered += history.timesAnswered;
      entry.correct += history.timesCorrect;
      entry.chapters.add(history.chapterNumber);
      byTag.set(tag, entry);
    }
  }

  const ranked = [...byTag.entries()]
    .filter(([, entry]) => entry.answered >= minimumAnswers)
    .map(([tag, entry]) => ({
      tag,
      label: humanizeTag(tag),
      answered: entry.answered,
      correct: entry.correct,
      accuracyPercent: Math.round((entry.correct / entry.answered) * 100),
      chapterNumbers: [...entry.chapters].sort((a, b) => a - b),
    }))
    // Least accurate first; among equals, the topic with more evidence behind
    // it goes first, then the tag name so the order never wobbles.
    .sort(
      (a, b) =>
        a.accuracyPercent - b.accuracyPercent ||
        b.answered - a.answered ||
        a.tag.localeCompare(b.tag),
    );

  return limit === undefined ? ranked : ranked.slice(0, limit);
}
