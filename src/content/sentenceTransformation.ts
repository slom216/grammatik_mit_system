/**
 * Validators for German sentence-level transformations that build on top of
 * morphologyValidation's word-level forms: active/passive conversion across
 * present, simple-past, and present-perfect tense, Futur I, genitive noun
 * endings, and the N-declension. Used by sentenceTransformation.test.ts to
 * catch authoring slips in generated transformation exercises across
 * chapters 62-70, and exported for reuse by any future chapter that
 * transforms sentences rather than single words.
 */

import { isValidPastParticiple, isValidSimplePastForm, type Person } from './morphologyValidation';

export type { Person };

/** Present-tense conjugation of werden, irregular in du/er (e→i). */
export const PRESENT_WERDEN: Record<Person, string> = {
  ich: 'werde',
  du: 'wirst',
  er: 'wird',
  wir: 'werden',
  ihr: 'werdet',
  sie: 'werden',
};

/** Present-tense conjugation of sein, used as the present-perfect-passive auxiliary. */
export const PRESENT_SEIN: Record<Person, string> = {
  ich: 'bin',
  du: 'bist',
  er: 'ist',
  wir: 'sind',
  ihr: 'seid',
  sie: 'sind',
};

export function isValidPresentWerdenForm(person: Person, form: string): boolean {
  return PRESENT_WERDEN[person] === form.trim().toLowerCase();
}

/** Futur I: werden (present) + infinitive at the end of the clause. */
export function isValidFuturI(person: Person, form: string): boolean {
  return isValidPresentWerdenForm(person, form);
}

/** Present passive: werden (present) + past participle. */
export function isValidPresentPassiveAuxiliary(person: Person, form: string): boolean {
  return isValidPresentWerdenForm(person, form);
}

/** Simple-past passive: wurde (simple past of werden) + past participle. */
export function isValidSimplePastPassiveAuxiliary(person: Person, form: string): boolean {
  return isValidSimplePastForm('werden', person, form);
}

/**
 * Present-perfect passive: sein (present) + past participle of the main verb
 * + "worden" — werden's own special passive-perfect participle, used instead
 * of the ordinary "geworden" whenever werden itself functions as the passive
 * auxiliary in a perfect tense.
 */
export function isValidPresentPerfectPassiveAuxiliary(person: Person, form: string): boolean {
  return PRESENT_SEIN[person] === form.trim().toLowerCase();
}

export function isValidPassivePerfectParticiple(form: string): boolean {
  return form.trim().toLowerCase() === 'worden';
}

/** The main verb's past participle, shared by every passive tense. */
export function isValidPassiveParticiple(infinitive: string, participle: string): boolean {
  return isValidPastParticiple(infinitive, participle);
}

export const AGENT_PREPOSITIONS = ['von', 'durch'] as const;
export type AgentPreposition = (typeof AGENT_PREPOSITIONS)[number];

/** von marks a personal/animate agent (+dative); durch marks an impersonal means/cause (+accusative). */
export const AGENT_PREPOSITION_CASE: Record<AgentPreposition, 'dative' | 'accusative'> = {
  von: 'dative',
  durch: 'accusative',
};

export function isValidAgentPreposition(word: string): word is AgentPreposition {
  return (AGENT_PREPOSITIONS as readonly string[]).includes(word.trim().toLowerCase());
}

const GENITIVE_ES_ENDING = /(s|ß|x|z|sch)$/;

/**
 * Common monosyllabic (or dental-cluster) nouns that take -es even though
 * they do not end in a sibilant — des Mannes, des Kindes, des Tages. Real
 * German also allows -s for some of these informally; this course teaches
 * only the -es form, so the list is hand-picked to the nouns chapter 68
 * actually uses, not derived from a syllable-counting rule.
 */
const EXTRA_ES_NOUNS = new Set([
  'Mann', 'Kind', 'Tag', 'Jahr', 'Land', 'Buch', 'Wort', 'Volk', 'Berg',
  'Wald', 'Brief', 'Sohn', 'Arzt', 'Freund', 'Herbst',
]);

/**
 * Regular genitive noun ending: nouns whose stem ends in a sibilant (or the
 * "sch" cluster), plus the hand-picked monosyllabic nouns above, take -es
 * (des Hauses, des Mannes); every other masculine or neuter noun takes plain
 * -s (des Autos, des Computers). Feminine nouns take no ending at all in the
 * genitive singular and are out of scope here.
 */
export function genitiveNounEnding(noun: string): 'es' | 's' {
  return GENITIVE_ES_ENDING.test(noun) || EXTRA_ES_NOUNS.has(noun) ? 'es' : 's';
}

export function isValidGenitiveNoun(noun: string, form: string): boolean {
  return `${noun}${genitiveNounEnding(noun)}` === form.trim();
}

/**
 * Genitive of a proper name: plain -s for most names (Annas), but a bare
 * apostrophe (no extra -s) for names already ending in a sibilant (Max',
 * Felix', Hans').
 */
export function nameGenitive(name: string): string {
  return GENITIVE_ES_ENDING.test(name) ? `${name}'` : `${name}s`;
}

export function isValidNameGenitive(name: string, form: string): boolean {
  return nameGenitive(name) === form.trim();
}

interface WeakNounEntry {
  /** Ending added outside the nominative singular (accusative/dative/genitive singular). */
  oblique: 'n' | 'en';
  /** Ending added in the plural (identical to oblique for every noun except Herr). */
  plural: 'n' | 'en';
}

/**
 * Masculine weak nouns (N-declension): known nouns and the ending they add
 * in every case/number except the nominative singular. Herr is the course's
 * flagship irregular case: -n in the oblique singular (den/dem/des Herrn)
 * but -en in the plural (die Herren).
 */
export const WEAK_NOUNS: Record<string, WeakNounEntry> = {
  Junge: { oblique: 'n', plural: 'n' },
  Kunde: { oblique: 'n', plural: 'n' },
  Kollege: { oblique: 'n', plural: 'n' },
  Patient: { oblique: 'en', plural: 'en' },
  Student: { oblique: 'en', plural: 'en' },
  Tourist: { oblique: 'en', plural: 'en' },
  Mensch: { oblique: 'en', plural: 'en' },
  Herr: { oblique: 'n', plural: 'en' },
  Nachbar: { oblique: 'n', plural: 'n' },
  Name: { oblique: 'n', plural: 'n' },
};

export function isValidWeakNounObliqueSingular(baseNoun: string, form: string): boolean {
  const entry = WEAK_NOUNS[baseNoun];
  if (!entry) return false;
  return `${baseNoun}${entry.oblique}` === form.trim();
}

export function isValidWeakNounPlural(baseNoun: string, form: string): boolean {
  const entry = WEAK_NOUNS[baseNoun];
  if (!entry) return false;
  return `${baseNoun}${entry.plural}` === form.trim();
}
