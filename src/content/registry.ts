import type {
  CefrLevel,
  ChapterDefinition,
  ChapterSection,
} from '../schemas/chapterSchema';
import { chapter001 } from './chapters/chapter-001-personal-pronouns';
import { chapter002 } from './chapters/chapter-002-present-tense-conjugation';
import { chapter003 } from './chapters/chapter-003-sein-haben-and-special-irregular-verbs';
import { chapter004 } from './chapters/chapter-004-verbs-with-vowel-changes';
import { chapter005 } from './chapters/chapter-005-modal-verbs-conjugation-and-sentence-position';
import { chapter006 } from './chapters/chapter-006-modal-verbs-usage-part-1';
import { chapter007 } from './chapters/chapter-007-modal-verbs-usage-part-2';
import { chapter008 } from './chapters/chapter-008-separable-verbs';
import { chapter009 } from './chapters/chapter-009-the-imperative';
import { chapter010 } from './chapters/chapter-010-questions-with-interrogative-words';
import { chapter011 } from './chapters/chapter-011-yes-no-questions-and-answers';
import { chapter012 } from './chapters/chapter-012-the-verb-in-position-2';
import { chapter013 } from './chapters/chapter-013-sentences-with-two-fixed-verb-positions';
import { chapter014 } from './chapters/chapter-014-plural-forms-of-nouns';
import { chapter015 } from './chapters/chapter-015-definite-indefinite-and-zero-articles';
import { chapter016 } from './chapters/chapter-016-negation-with-nicht-and-kein';
import { chapter017 } from './chapters/chapter-017-the-accusative-case';
import { chapter018 } from './chapters/chapter-018-the-dative-case';
import { chapter019 } from './chapters/chapter-019-possessive-articles';
import { chapter020 } from './chapters/chapter-020-interrogative-and-demonstrative-articles';
import { chapter021 } from './chapters/chapter-021-personal-pronouns-in-the-accusative-and-dative';
import { chapter022 } from './chapters/chapter-022-verbs-taking-both-accusative-and-dative-objects';
import { chapter023 } from './chapters/chapter-023-verbs-taking-a-dative-object';
import { chapter024 } from './chapters/chapter-024-asking-about-people-and-things-with-the-correct-case';
import { chapter025 } from './chapters/chapter-025-simple-past-of-sein-and-haben';
import { chapter026 } from './chapters/chapter-026-present-perfect-with-haben';
import { chapter027 } from './chapters/chapter-027-present-perfect-with-sein';
import { chapter028 } from './chapters/chapter-028-formation-of-the-past-participle';
import { chapter029 } from './chapters/chapter-029-simple-past-of-modal-verbs';
import { chapter030 } from './chapters/chapter-030-choosing-and-using-past-tenses';
import { chapter031 } from './chapters/chapter-031-reflexive-and-reciprocal-verbs';
import { chapter032 } from './chapters/chapter-032-basic-temporal-prepositions';
import { chapter033 } from './chapters/chapter-033-prepositions-governing-the-dative';
import { chapter034 } from './chapters/chapter-034-prepositions-governing-the-accusative';
import { chapter035 } from './chapters/chapter-035-two-way-prepositions-used-with-the-dative';
import { chapter036 } from './chapters/chapter-036-two-way-prepositions-with-dative-or-accusative';
import { chapter037 } from './chapters/chapter-037-local-prepositions-answering-wohin';
import { chapter038 } from './chapters/chapter-038-local-prepositions-answering-wo';
import { chapter039 } from './chapters/chapter-039-local-prepositions-answering-woher';
import { chapter040 } from './chapters/chapter-040-adjective-endings-in-the-nominative-and-accusative';
import { chapter041 } from './chapters/chapter-041-adjective-endings-in-the-nominative-accusative-and-dative';
import { chapter042 } from './chapters/chapter-042-comparative-forms-and-comparative-sentences';
import { chapter043 } from './chapters/chapter-043-superlative-forms';
import { chapter044 } from './chapters/chapter-044-coordinating-conjunctions';
import { chapter045 } from './chapters/chapter-045-connectors-deshalb-sonst-dann-and-danach';
import { chapter046 } from './chapters/chapter-046-subordinate-clauses-with-weil-wenn-and-dass';
import { chapter047 } from './chapters/chapter-047-compound-nouns';
import { chapter048 } from './chapters/chapter-048-compound-verbs';
import { chapter049 } from './chapters/chapter-049-rules-for-grammatical-gender';
import { chapter050 } from './chapters/chapter-050-modal-and-conversational-particles';
import { chapter051 } from './chapters/chapter-051-forming-new-words-with-prefixes-and-suffixes';
import { chapter052 } from './chapters/chapter-052-negation-expressions';
import { chapter053 } from './chapters/chapter-053-local-adverbs-expressing-position-and-direction';
import { chapter054 } from './chapters/chapter-054-simple-past-of-regular-and-irregular-verbs';
import { chapter055 } from './chapters/chapter-055-the-past-perfect';
import { chapter056 } from './chapters/chapter-056-reflexive-pronouns-in-the-accusative-and-dative';
import { chapter057 } from './chapters/chapter-057-separable-and-inseparable-verbs';
import { chapter058 } from './chapters/chapter-058-verbs-with-fixed-prepositions';
import { chapter059 } from './chapters/chapter-059-pronominal-adverbs-and-prepositional-pronouns';
import { chapter060 } from './chapters/chapter-060-konjunktiv-ii-formation';
import { chapter061 } from './chapters/chapter-061-konjunktiv-ii-usage';
import { chapter062 } from './chapters/chapter-062-the-passive-voice';
import { chapter063 } from './chapters/chapter-063-the-passive-voice-in-the-past';
import { chapter064 } from './chapters/chapter-064-predictions-and-future-events-with-futur-i';
import { chapter065 } from './chapters/chapter-065-different-functions-of-werden';
import { chapter066 } from './chapters/chapter-066-the-verb-lassen';
import { chapter067 } from './chapters/chapter-067-position-and-direction-verbs';
import { chapter068 } from './chapters/chapter-068-the-genitive-case';
import { chapter069 } from './chapters/chapter-069-the-n-declension';
import { chapter070 } from './chapters/chapter-070-adjectives-used-as-nouns-for-people';

export interface ChapterRegistryEntry {
  number: number;
  title: string;
  section: ChapterSection;
  level: CefrLevel;
}

/**
 * Single source of truth for the course outline (all 85 chapters).
 * Chapter content files are checked against this table in a content test.
 */
export const chapterRegistry = [
  { number: 1, title: 'Personal Pronouns', section: 'verbs-1', level: 'A1' },
  { number: 2, title: 'Present-Tense Conjugation', section: 'verbs-1', level: 'A1' },
  {
    number: 3,
    title: 'sein, haben, and Special Irregular Verbs',
    section: 'verbs-1',
    level: 'A1',
  },
  { number: 4, title: 'Verbs with Vowel Changes', section: 'verbs-1', level: 'A1' },
  {
    number: 5,
    title: 'Modal Verbs: Conjugation and Sentence Position',
    section: 'verbs-1',
    level: 'A1',
  },
  { number: 6, title: 'Modal Verbs: Usage, Part 1', section: 'verbs-1', level: 'A1' },
  { number: 7, title: 'Modal Verbs: Usage, Part 2', section: 'verbs-1', level: 'A1' },
  { number: 8, title: 'Separable Verbs', section: 'verbs-1', level: 'A1' },
  { number: 9, title: 'The Imperative', section: 'verbs-1', level: 'A1' },
  {
    number: 10,
    title: 'Questions with Interrogative Words',
    section: 'sentences-and-questions',
    level: 'A1',
  },
  {
    number: 11,
    title: 'Yes/No Questions and Answers',
    section: 'sentences-and-questions',
    level: 'A1',
  },
  {
    number: 12,
    title: 'The Verb in Position 2',
    section: 'sentences-and-questions',
    level: 'A1',
  },
  {
    number: 13,
    title: 'Sentences with Two Fixed Verb Positions',
    section: 'sentences-and-questions',
    level: 'A1',
  },
  {
    number: 14,
    title: 'Plural Forms of Nouns',
    section: 'pronouns-nouns-articles',
    level: 'A1',
  },
  {
    number: 15,
    title: 'Definite, Indefinite, and Zero Articles',
    section: 'pronouns-nouns-articles',
    level: 'A1',
  },
  {
    number: 16,
    title: 'Negation with nicht and kein',
    section: 'pronouns-nouns-articles',
    level: 'A1',
  },
  {
    number: 17,
    title: 'The Accusative Case',
    section: 'pronouns-nouns-articles',
    level: 'A1',
  },
  {
    number: 18,
    title: 'The Dative Case',
    section: 'pronouns-nouns-articles',
    level: 'A1',
  },
  {
    number: 19,
    title: 'Possessive Articles',
    section: 'pronouns-nouns-articles',
    level: 'A1',
  },
  {
    number: 20,
    title: 'Interrogative and Demonstrative Articles',
    section: 'pronouns-nouns-articles',
    level: 'A1',
  },
  {
    number: 21,
    title: 'Personal Pronouns in the Accusative and Dative',
    section: 'pronouns-nouns-articles',
    level: 'A2',
  },
  {
    number: 22,
    title: 'Verbs Taking Both Accusative and Dative Objects',
    section: 'pronouns-nouns-articles',
    level: 'A2',
  },
  {
    number: 23,
    title: 'Verbs Taking a Dative Object',
    section: 'pronouns-nouns-articles',
    level: 'A2',
  },
  {
    number: 24,
    title: 'Asking About People and Things with the Correct Case',
    section: 'pronouns-nouns-articles',
    level: 'A2',
  },
  { number: 25, title: 'Simple Past of sein and haben', section: 'verbs-2', level: 'A1' },
  { number: 26, title: 'Present Perfect with haben', section: 'verbs-2', level: 'A1' },
  { number: 27, title: 'Present Perfect with sein', section: 'verbs-2', level: 'A1' },
  {
    number: 28,
    title: 'Formation of the Past Participle',
    section: 'verbs-2',
    level: 'A2',
  },
  { number: 29, title: 'Simple Past of Modal Verbs', section: 'verbs-2', level: 'A2' },
  {
    number: 30,
    title: 'Choosing and Using Past Tenses',
    section: 'verbs-2',
    level: 'A2',
  },
  {
    number: 31,
    title: 'Reflexive and Reciprocal Verbs',
    section: 'verbs-2',
    level: 'A2',
  },
  {
    number: 32,
    title: 'Basic Temporal Prepositions',
    section: 'prepositions-1',
    level: 'A1',
  },
  {
    number: 33,
    title: 'Prepositions Governing the Dative',
    section: 'prepositions-1',
    level: 'A1',
  },
  {
    number: 34,
    title: 'Prepositions Governing the Accusative',
    section: 'prepositions-1',
    level: 'A1',
  },
  {
    number: 35,
    title: 'Two-Way Prepositions Used with the Dative',
    section: 'prepositions-1',
    level: 'A2',
  },
  {
    number: 36,
    title: 'Two-Way Prepositions with Dative or Accusative',
    section: 'prepositions-1',
    level: 'A2',
  },
  {
    number: 37,
    title: 'Local Prepositions Answering Wohin?',
    section: 'prepositions-1',
    level: 'A2',
  },
  {
    number: 38,
    title: 'Local Prepositions Answering Wo?',
    section: 'prepositions-1',
    level: 'A2',
  },
  {
    number: 39,
    title: 'Local Prepositions Answering Woher?',
    section: 'prepositions-1',
    level: 'A2',
  },
  {
    number: 40,
    title: 'Adjective Endings in the Nominative and Accusative',
    section: 'adjectives-1',
    level: 'A2',
  },
  {
    number: 41,
    title: 'Adjective Endings in the Nominative, Accusative, and Dative',
    section: 'adjectives-1',
    level: 'A2',
  },
  {
    number: 42,
    title: 'Comparative Forms and Comparative Sentences',
    section: 'adjectives-1',
    level: 'A2',
  },
  { number: 43, title: 'Superlative Forms', section: 'adjectives-1', level: 'A2' },
  {
    number: 44,
    title: 'Coordinating Conjunctions',
    section: 'sentence-connections-1',
    level: 'A2',
  },
  {
    number: 45,
    title: 'Connectors: deshalb, sonst, dann, danach',
    section: 'sentence-connections-1',
    level: 'A2',
  },
  {
    number: 46,
    title: 'Subordinate Clauses with weil, wenn, and dass',
    section: 'sentence-connections-1',
    level: 'A2',
  },
  {
    number: 47,
    title: 'Compound Nouns',
    section: 'words-and-word-formation',
    level: 'A2',
  },
  {
    number: 48,
    title: 'Compound Verbs',
    section: 'words-and-word-formation',
    level: 'A2',
  },
  {
    number: 49,
    title: 'Rules for Grammatical Gender',
    section: 'words-and-word-formation',
    level: 'A2',
  },
  {
    number: 50,
    title: 'Modal and Conversational Particles',
    section: 'words-and-word-formation',
    level: 'B1',
  },
  {
    number: 51,
    title: 'Forming New Words with Prefixes and Suffixes',
    section: 'words-and-word-formation',
    level: 'B1',
  },
  {
    number: 52,
    title: 'Negation Expressions',
    section: 'words-and-word-formation',
    level: 'A2',
  },
  {
    number: 53,
    title: 'Local Adverbs Expressing Position and Direction',
    section: 'words-and-word-formation',
    level: 'A2',
  },
  {
    number: 54,
    title: 'Simple Past of Regular and Irregular Verbs',
    section: 'verbs-3',
    level: 'B1',
  },
  { number: 55, title: 'The Past Perfect', section: 'verbs-3', level: 'B1' },
  {
    number: 56,
    title: 'Reflexive Pronouns in the Accusative and Dative',
    section: 'verbs-3',
    level: 'B1',
  },
  {
    number: 57,
    title: 'Separable and Inseparable Verbs',
    section: 'verbs-3',
    level: 'B1',
  },
  { number: 58, title: 'Verbs with Fixed Prepositions', section: 'verbs-3', level: 'B1' },
  {
    number: 59,
    title: 'Pronominal Adverbs and Prepositional Pronouns',
    section: 'verbs-3',
    level: 'B1',
  },
  { number: 60, title: 'Konjunktiv II: Formation', section: 'verbs-3', level: 'B1' },
  { number: 61, title: 'Konjunktiv II: Usage', section: 'verbs-3', level: 'B1' },
  { number: 62, title: 'The Passive Voice', section: 'verbs-3', level: 'B1' },
  { number: 63, title: 'The Passive Voice in the Past', section: 'verbs-3', level: 'B1' },
  {
    number: 64,
    title: 'Predictions and Future Events with Futur I',
    section: 'verbs-3',
    level: 'B1',
  },
  { number: 65, title: 'Different Functions of werden', section: 'verbs-3', level: 'B1' },
  { number: 66, title: 'The Verb lassen', section: 'verbs-3', level: 'B1' },
  { number: 67, title: 'Position and Direction Verbs', section: 'verbs-3', level: 'B1' },
  { number: 68, title: 'The Genitive Case', section: 'nouns-2', level: 'B1' },
  { number: 69, title: 'The N-Declension', section: 'nouns-2', level: 'B1' },
  {
    number: 70,
    title: 'Adjectives Used as Nouns for People',
    section: 'nouns-2',
    level: 'B1',
  },
  {
    number: 71,
    title: 'Adjectives Used as Neuter Nouns',
    section: 'nouns-2',
    level: 'B1',
  },
  {
    number: 72,
    title: 'Indirect Questions',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 73,
    title: 'Infinitive Constructions with zu',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 74,
    title: 'Infinitive Constructions without zu',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 75,
    title: 'Relative Clauses, Part 1',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 76,
    title: 'Relative Clauses, Part 2',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 77,
    title: 'Temporal Clauses with wenn and als',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 78,
    title: 'Temporal Clauses with während, bevor, nachdem, and seit',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 79,
    title: 'Purpose Clauses with um ... zu and damit',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 80,
    title: 'Paired Conjunctions',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 81,
    title: 'Comparative Constructions with je ... desto',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 82,
    title: 'Prepositions Governing the Genitive',
    section: 'prepositions-2',
    level: 'B1',
  },
  {
    number: 83,
    title: 'Advanced Temporal Prepositions and Expressions',
    section: 'prepositions-2',
    level: 'B1',
  },
  {
    number: 84,
    title: 'Adjective Declension with and without an Article',
    section: 'adjectives-2',
    level: 'B1',
  },
  {
    number: 85,
    title: 'Present Participles Used as Adjectives',
    section: 'adjectives-2',
    level: 'B1',
  },
] as const satisfies readonly ChapterRegistryEntry[];

/**
 * Chapter content that currently ships. Phase 4 ships chapters 1-40;
 * further chapters are added phase by phase. The Phase 0 engine demo
 * (chapter-000-demo.ts) is no longer part of the shipped catalogue but
 * stays in the repo as a fixture for engine-level tests.
 */
export const chapters: readonly ChapterDefinition[] = [
  chapter001,
  chapter002,
  chapter003,
  chapter004,
  chapter005,
  chapter006,
  chapter007,
  chapter008,
  chapter009,
  chapter010,
  chapter011,
  chapter012,
  chapter013,
  chapter014,
  chapter015,
  chapter016,
  chapter017,
  chapter018,
  chapter019,
  chapter020,
  chapter021,
  chapter022,
  chapter023,
  chapter024,
  chapter025,
  chapter026,
  chapter027,
  chapter028,
  chapter029,
  chapter030,
  chapter031,
  chapter032,
  chapter033,
  chapter034,
  chapter035,
  chapter036,
  chapter037,
  chapter038,
  chapter039,
  chapter040,
  chapter041,
  chapter042,
  chapter043,
  chapter044,
  chapter045,
  chapter046,
  chapter047,
  chapter048,
  chapter049,
  chapter050,
  chapter051,
  chapter052,
  chapter053,
  chapter054,
  chapter055,
  chapter056,
  chapter057,
  chapter058,
  chapter059,
  chapter060,
  chapter061,
  chapter062,
  chapter063,
  chapter064,
  chapter065,
  chapter066,
  chapter067,
  chapter068,
  chapter069,
  chapter070,
];

const chaptersByNumber = new Map(chapters.map((chapter) => [chapter.number, chapter]));
const registryByNumber = new Map<number, ChapterRegistryEntry>(
  chapterRegistry.map((entry) => [entry.number, entry]),
);

export function getChapter(chapterNumber: number): ChapterDefinition | undefined {
  return chaptersByNumber.get(chapterNumber);
}

export function getRegistryEntry(
  chapterNumber: number,
): ChapterRegistryEntry | undefined {
  return registryByNumber.get(chapterNumber);
}

export function hasChapterContent(chapterNumber: number): boolean {
  return chaptersByNumber.has(chapterNumber);
}

/** Registry chapters that already have content, in course order. */
export const availableChapterNumbers: readonly number[] = chapterRegistry
  .filter((entry) => chaptersByNumber.has(entry.number))
  .map((entry) => entry.number);

/** Demo/engine chapters, which are intentionally absent from the registry. */
export const demoChapters: readonly ChapterDefinition[] = chapters.filter(
  (chapter) => chapter.isDemo === true,
);

export const productionChapters: readonly ChapterDefinition[] = chapters.filter(
  (chapter) => chapter.isDemo !== true,
);
