import type { ChapterSection } from '../schemas/chapterSchema';

export interface SectionDefinition {
  id: ChapterSection;
  order: number;
  title: string;
  description: string;
}

/**
 * Catalogue sections, in course order. Section titles follow the course outline
 * in DEVELOPMENT_INSTRUCTIONS.md.
 */
export const sections: readonly SectionDefinition[] = [
  {
    id: 'verbs-1',
    order: 1,
    title: 'Verbs 1',
    description:
      'Pronouns, present tense, modal verbs, separable verbs, and the imperative.',
  },
  {
    id: 'sentences-and-questions',
    order: 2,
    title: 'Sentences and Questions',
    description: 'Question words, yes/no questions, and the position of the finite verb.',
  },
  {
    id: 'pronouns-nouns-articles',
    order: 3,
    title: 'Pronouns, Nouns, and Articles',
    description: 'Plurals, articles, negation, and the accusative and dative cases.',
  },
  {
    id: 'verbs-2',
    order: 4,
    title: 'Verbs 2',
    description: 'Past tenses, participle formation, and reflexive verbs.',
  },
  {
    id: 'prepositions-1',
    order: 5,
    title: 'Prepositions 1',
    description: 'Temporal prepositions, case government, and two-way prepositions.',
  },
  {
    id: 'adjectives-1',
    order: 6,
    title: 'Adjectives 1',
    description: 'Adjective endings, comparatives, and superlatives.',
  },
  {
    id: 'sentence-connections-1',
    order: 7,
    title: 'Sentences and Sentence Connections 1',
    description: 'Coordinating conjunctions, connectors, and first subordinate clauses.',
  },
  {
    id: 'words-and-word-formation',
    order: 8,
    title: 'Words and Word Formation',
    description: 'Compounds, gender rules, particles, negation words, and local adverbs.',
  },
  {
    id: 'verbs-3',
    order: 9,
    title: 'Verbs 3',
    description: 'Simple past, past perfect, Konjunktiv II, passive voice, and future.',
  },
  {
    id: 'nouns-2',
    order: 10,
    title: 'Nouns 2',
    description: 'Genitive case, n-declension, and adjectives used as nouns.',
  },
  {
    id: 'sentence-connections-2',
    order: 11,
    title: 'Sentences and Sentence Connections 2',
    description:
      'Indirect questions, infinitive clauses, relative clauses, and connectors.',
  },
  {
    id: 'prepositions-2',
    order: 12,
    title: 'Prepositions 2',
    description: 'Genitive prepositions and advanced temporal expressions.',
  },
  {
    id: 'adjectives-2',
    order: 13,
    title: 'Adjectives 2',
    description: 'Full adjective declension and participles used as adjectives.',
  },
] as const;

const sectionById = new Map(sections.map((section) => [section.id, section]));

export function getSection(id: ChapterSection): SectionDefinition {
  const section = sectionById.get(id);
  if (!section) {
    throw new Error(`Unknown chapter section: ${id}`);
  }
  return section;
}
