import type {
  CefrLevel,
  ChapterDefinition,
  ChapterSection,
} from '../schemas/chapterSchema';
import { demoChapter } from './chapters/chapter-000-demo';

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
 * Chapter content that currently ships. Phase 0 ships the engine demo only;
 * production chapters are added phase by phase.
 */
export const chapters: readonly ChapterDefinition[] = [demoChapter];

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
