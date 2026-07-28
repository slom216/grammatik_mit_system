import {
  chapterRegistry,
  demoChapters,
  getChapter,
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
  estimatedMinutes?: number;
  bookmarked: boolean;
  reviewDue: boolean;
  isDemo: boolean;
}

function dueChapterNumbers(state: ProgressState, now: Date): Set<number> {
  const due = new Set<number>();
  for (const history of Object.values(state.exerciseHistory) as ExerciseHistory[]) {
    if (isDue(history, now)) due.add(history.chapterNumber);
  }
  return due;
}

export function buildChapterCard(
  entry: ChapterRegistryEntry,
  state: ProgressState,
  due: Set<number>,
): ChapterCardModel {
  const chapter = getChapter(entry.number);
  const progress = selectChapterProgress(state, entry.number);
  const card: ChapterCardModel = {
    number: entry.number,
    title: entry.title,
    level: entry.level,
    section: entry.section,
    available: chapter !== undefined,
    status: progress.status,
    bestScorePercent: progress.bestScorePercent,
    bookmarked: progress.bookmarked,
    reviewDue: due.has(entry.number),
    isDemo: chapter?.isDemo === true,
  };
  if (chapter) card.estimatedMinutes = chapter.estimatedMinutes;
  return card;
}

export function selectChapterCards(
  state: ProgressState,
  now: Date = new Date(),
): ChapterCardModel[] {
  const due = dueChapterNumbers(state, now);
  const registryCards = chapterRegistry.map((entry) =>
    buildChapterCard(entry, state, due),
  );
  const demoCards = demoChapters.map((chapter) =>
    buildChapterCard(
      {
        number: chapter.number,
        title: chapter.title,
        section: chapter.section,
        level: chapter.level,
      },
      state,
      due,
    ),
  );
  return [...demoCards, ...registryCards];
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

export interface DemoSectionDefinition {
  id: 'demo';
  order: number;
  title: string;
  description: string;
}

export interface SectionGroup {
  section: SectionDefinition | DemoSectionDefinition;
  chapters: ChapterCardModel[];
}

const demoSection: DemoSectionDefinition = {
  id: 'demo',
  order: 0,
  title: 'Engine demo (not part of the course)',
  description:
    'A sample chapter used to demonstrate the lesson and practice engine during development.',
};

export function groupBySection(cards: readonly ChapterCardModel[]): SectionGroup[] {
  const groups: SectionGroup[] = [];

  const demo = cards.filter((card) => card.isDemo);
  if (demo.length > 0) groups.push({ section: demoSection, chapters: demo });

  for (const section of [...sections].sort((a, b) => a.order - b.order)) {
    const chapters = cards.filter((card) => !card.isDemo && card.section === section.id);
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
      available: entries.filter((entry) => getChapter(entry.number) !== undefined).length,
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
    if (card && card.status !== 'mastered') return card;
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
];

/** Checkpoints whose full chapter range currently has content. */
export function selectAvailableCheckpoints(): CourseCheckpoint[] {
  return COURSE_CHECKPOINTS.filter((checkpoint) => {
    for (let number = checkpoint.from; number <= checkpoint.to; number += 1) {
      if (getChapter(number) === undefined) return false;
    }
    return true;
  });
}

/** The next chapter with content after the given one. */
export function selectNextChapter(chapterNumber: number): ChapterCardModel | undefined {
  const ordered = [...chapterRegistry].sort((a, b) => a.number - b.number);
  const next = ordered.find(
    (entry) => entry.number > chapterNumber && getChapter(entry.number) !== undefined,
  );
  if (!next) return undefined;
  return {
    number: next.number,
    title: next.title,
    level: next.level,
    section: next.section,
    available: true,
    status: 'notStarted',
    bestScorePercent: 0,
    bookmarked: false,
    reviewDue: false,
    isDemo: false,
  };
}
