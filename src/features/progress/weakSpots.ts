import type { ExerciseHistory } from '../../schemas/progressSchema';

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
    for (const tag of history.grammarFocus) {
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
