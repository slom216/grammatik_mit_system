import {
  chapterRegistry,
  hasChapter,
  type ChapterRegistryEntry,
} from '../../content/registry';
import { sections, type SectionDefinition } from '../../content/sections';
import { CEFR_LEVELS, type CefrLevel } from '../../schemas/chapterSchema';
import type { ChapterStatus, ExerciseHistory } from '../../schemas/progressSchema';
import { isDue } from '../practice/reviewScheduler';
import { selectChapterProgress, type ProgressState } from '../progress/progressStore';

export const CHAPTER_FILTERS = [
  'all',
  'A1',
  'A2',
  'B1',
  'notStarted',
  'inProgress',
  'mastered',
  'reviewDue',
] as const;
export type ChapterFilter = (typeof CHAPTER_FILTERS)[number];

export const CHAPTER_FILTER_LABELS: Record<ChapterFilter, string> = {
  all: 'All',
  A1: 'A1',
  A2: 'A2',
  B1: 'B1',
  notStarted: 'Not started',
  inProgress: 'In progress',
  mastered: 'Mastered',
  reviewDue: 'Review due',
};

export interface ChapterCardModel {
  number: number;
  title: string;
  level: CefrLevel;
  section: ChapterRegistryEntry['section'];
  /** True when a content file exists for this chapter. */
  available: boolean;
  status: ChapterStatus;
  bestScorePercent: number;
  estimatedMinutes: number;
  bookmarked: boolean;
  reviewDue: boolean;
  /** How many of the chapter's exercises have been answered correctly, ever. */
  coveredCount: number;
  /** How many exercises the chapter holds, read from the registry. */
  exerciseCount: number;
  /** Grammar topics the chapter covers, used by catalogue search. */
  tags: string[];
}

/**
 * Everything the catalogue needs from `exerciseHistory`, in one walk over it.
 * Counting coverage per chapter inside `buildChapterCard` instead would re-read
 * the whole history 85 times on every render of the catalogue.
 */
export interface HistorySummary {
  due: Set<number>;
  covered: Map<number, number>;
}

export function summarizeHistory(state: ProgressState, now: Date): HistorySummary {
  const due = new Set<number>();
  const covered = new Map<number, number>();
  for (const history of Object.values(state.exerciseHistory) as ExerciseHistory[]) {
    if (isDue(history, now)) due.add(history.chapterNumber);
    if (history.timesCorrect > 0) {
      covered.set(history.chapterNumber, (covered.get(history.chapterNumber) ?? 0) + 1);
    }
  }
  return { due, covered };
}

export function buildChapterCard(
  entry: ChapterRegistryEntry,
  state: ProgressState,
  summary: HistorySummary,
): ChapterCardModel {
  const progress = selectChapterProgress(state, entry.number);
  return {
    number: entry.number,
    title: entry.title,
    level: entry.level,
    section: entry.section,
    // Every registry entry has a content file; content validation asserts it.
    available: true,
    status: progress.status,
    bestScorePercent: progress.bestScorePercent,
    estimatedMinutes: entry.estimatedMinutes,
    bookmarked: progress.bookmarked,
    reviewDue: summary.due.has(entry.number),
    coveredCount: summary.covered.get(entry.number) ?? 0,
    exerciseCount: entry.exerciseCount,
    tags: entry.tags,
  };
}

/**
 * Whether a chapter matches a catalogue search. Matches the title, the exact
 * level or chapter number, and any grammar tag — tags are what let a search for
 * "dative" or "Konjunktiv" find chapters whose titles never say the word.
 */
export function matchesQuery(card: ChapterCardModel, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (needle === '') return true;
  return (
    card.title.toLowerCase().includes(needle) ||
    card.level.toLowerCase() === needle ||
    String(card.number) === needle ||
    card.tags.some((tag) => tag.toLowerCase().includes(needle))
  );
}

export function selectChapterCards(
  state: ProgressState,
  now: Date = new Date(),
): ChapterCardModel[] {
  const summary = summarizeHistory(state, now);
  return chapterRegistry.map((entry) => buildChapterCard(entry, state, summary));
}

export function matchesFilter(card: ChapterCardModel, filter: ChapterFilter): boolean {
  switch (filter) {
    case 'all':
      return true;
    case 'A1':
    case 'A2':
    case 'B1':
      return card.level === filter;
    case 'notStarted':
      return card.status === 'notStarted';
    case 'inProgress':
      return card.status === 'inProgress';
    case 'mastered':
      return card.status === 'mastered';
    case 'reviewDue':
      return card.reviewDue;
  }
}

export interface SectionGroup {
  section: SectionDefinition;
  chapters: ChapterCardModel[];
}

export function groupBySection(cards: readonly ChapterCardModel[]): SectionGroup[] {
  const groups: SectionGroup[] = [];

  for (const section of [...sections].sort((a, b) => a.order - b.order)) {
    const chapters = cards.filter((card) => card.section === section.id);
    if (chapters.length > 0) groups.push({ section, chapters });
  }

  return groups;
}

export interface LevelProgress {
  level: CefrLevel;
  total: number;
  available: number;
  completed: number;
  mastered: number;
  percentComplete: number;
}

export function selectLevelProgress(state: ProgressState): LevelProgress[] {
  return CEFR_LEVELS.map((level) => {
    const entries = chapterRegistry.filter((entry) => entry.level === level);
    const progresses = entries.map((entry) => selectChapterProgress(state, entry.number));
    const completed = progresses.filter(
      (progress) => progress.status === 'completed' || progress.status === 'mastered',
    ).length;
    const mastered = progresses.filter(
      (progress) => progress.status === 'mastered',
    ).length;
    return {
      level,
      total: entries.length,
      available: entries.length,
      completed,
      mastered,
      percentComplete:
        entries.length === 0 ? 0 : Math.round((completed / entries.length) * 100),
    };
  });
}

export interface CourseCompletion {
  totalChapters: number;
  availableChapters: number;
  completedChapters: number;
  masteredChapters: number;
  percentComplete: number;
}

export function selectCourseCompletion(state: ProgressState): CourseCompletion {
  const levels = selectLevelProgress(state);
  const totalChapters: number = chapterRegistry.length;
  const completedChapters = levels.reduce((sum, level) => sum + level.completed, 0);
  return {
    totalChapters,
    availableChapters: levels.reduce((sum, level) => sum + level.available, 0),
    completedChapters,
    masteredChapters: levels.reduce((sum, level) => sum + level.mastered, 0),
    percentComplete:
      totalChapters === 0 ? 0 : Math.round((completedChapters / totalChapters) * 100),
  };
}

/** The chapter the learner should continue with. */
export function selectContinueChapter(
  state: ProgressState,
): ChapterCardModel | undefined {
  const cards = selectChapterCards(state);
  const lastOpened = state.lastOpenedChapter;
  if (lastOpened !== undefined) {
    const card = cards.find((entry) => entry.number === lastOpened && entry.available);
    if (card && card.status !== 'mastered' && card.status !== 'completed') return card;
  }
  return cards.find(
    (card) => card.available && card.status !== 'mastered' && card.status !== 'completed',
  );
}

export interface CourseCheckpoint {
  id: string;
  title: string;
  from: number;
  to: number;
}

/**
 * Ten-chapter review blocks, added as each phase of the course ships, plus
 * the occasional topic-scoped block spanning less than ten chapters (e.g.
 * the Phase 8 "B1 Clause Connections" checkpoint over the whole
 * `sentence-connections-2` section). A checkpoint only appears in the app
 * once every chapter in its range has content (see `selectAvailableCheckpoints`).
 */
export const COURSE_CHECKPOINTS: readonly CourseCheckpoint[] = [
  { id: 'checkpoint-1-10', title: 'Chapters 1-10', from: 1, to: 10 },
  { id: 'checkpoint-11-20', title: 'Chapters 11-20', from: 11, to: 20 },
  { id: 'checkpoint-21-30', title: 'Chapters 21-30', from: 21, to: 30 },
  { id: 'checkpoint-31-40', title: 'Chapters 31-40', from: 31, to: 40 },
  { id: 'checkpoint-41-50', title: 'Chapters 41-50', from: 41, to: 50 },
  { id: 'checkpoint-51-60', title: 'Chapters 51-60', from: 51, to: 60 },
  { id: 'checkpoint-61-70', title: 'Chapters 61-70', from: 61, to: 70 },
  { id: 'checkpoint-71-80', title: 'Chapters 71-80', from: 71, to: 80 },
  {
    id: 'checkpoint-b1-clause-connections',
    title: 'B1 Clause Connections (Ch. 72-80)',
    from: 72,
    to: 80,
  },
  { id: 'checkpoint-81-85', title: 'Chapters 81-85', from: 81, to: 85 },
];

/** Checkpoints whose full chapter range currently has content. */
export function selectAvailableCheckpoints(): CourseCheckpoint[] {
  return COURSE_CHECKPOINTS.filter((checkpoint) => {
    for (let number = checkpoint.from; number <= checkpoint.to; number += 1) {
      if (!hasChapter(number)) return false;
    }
    return true;
  });
}

/** The next chapter with content after the given one. */
export function selectNextChapter(chapterNumber: number): ChapterCardModel | undefined {
  const ordered = [...chapterRegistry].sort((a, b) => a.number - b.number);
  const next = ordered.find((entry) => entry.number > chapterNumber);
  if (!next) return undefined;
  return {
    number: next.number,
    title: next.title,
    level: next.level,
    section: next.section,
    available: true,
    status: 'notStarted',
    bestScorePercent: 0,
    estimatedMinutes: next.estimatedMinutes,
    tags: next.tags,
    bookmarked: false,
    reviewDue: false,
    coveredCount: 0,
    exerciseCount: next.exerciseCount,
  };
}
