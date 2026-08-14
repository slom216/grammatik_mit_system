import type { ChapterProgress, ExerciseHistory } from '../../schemas/progressSchema';
import { calculateStreak } from './streak';
import { selectWeakSpots } from './weakSpots';

/**
 * Achievements are **derived**, never stored.
 *
 * Everything they describe is already in the progress state, so computing them
 * on read means no extra persisted field, no migration, and no chance of a
 * badge disagreeing with the numbers on the same page. It also means a restored
 * backup arrives with its achievements already intact.
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  /** How far along the learner is, in the same unit as `target`. */
  progress: number;
  target: number;
  earned: boolean;
}

export interface AchievementInput {
  chapters: Record<number, ChapterProgress>;
  exerciseHistory: Record<string, ExerciseHistory>;
  answersByDay: Record<string, number>;
  now?: Date;
}

interface Tier {
  id: string;
  title: string;
  description: string;
  target: number;
}

function tiers(value: number, definitions: Tier[]): Achievement[] {
  return definitions.map((definition) => ({
    ...definition,
    progress: Math.min(value, definition.target),
    earned: value >= definition.target,
  }));
}

export function selectAchievements({
  chapters,
  exerciseHistory,
  answersByDay,
  now = new Date(),
}: AchievementInput): Achievement[] {
  const histories = Object.values(exerciseHistory);
  const totalAnswers = histories.reduce((sum, entry) => sum + entry.timesAnswered, 0);
  const mastered = Object.values(chapters).filter(
    (chapter) => chapter.status === 'mastered',
  ).length;
  const streak = calculateStreak(answersByDay, now);
  // "Retired" is the scheduler's own end state: three correct answers in a row.
  const retired = histories.filter((entry) => entry.stage === 'stable').length;
  const strongTopics = selectWeakSpots(exerciseHistory).filter(
    (spot) => spot.accuracyPercent >= 90,
  ).length;

  return [
    ...tiers(totalAnswers, [
      {
        id: 'answers-100',
        title: 'Getting started',
        description: 'Answer 100 exercises',
        target: 100,
      },
      {
        id: 'answers-1000',
        title: 'Well practised',
        description: 'Answer 1,000 exercises',
        target: 1000,
      },
    ]),
    ...tiers(streak, [
      {
        id: 'streak-7',
        title: 'A full week',
        description: 'Practise seven days in a row',
        target: 7,
      },
      {
        id: 'streak-30',
        title: 'A full month',
        description: 'Practise thirty days in a row',
        target: 30,
      },
    ]),
    ...tiers(mastered, [
      {
        id: 'mastered-1',
        title: 'First chapter mastered',
        description: 'Master a chapter',
        target: 1,
      },
      {
        id: 'mastered-10',
        title: 'Ten down',
        description: 'Master ten chapters',
        target: 10,
      },
      {
        id: 'mastered-85',
        title: 'The whole course',
        description: 'Master all 85 chapters',
        target: 85,
      },
    ]),
    ...tiers(retired, [
      {
        id: 'retired-50',
        title: 'Committed to memory',
        description:
          'Retire 50 exercises by answering them correctly three times running',
        target: 50,
      },
    ]),
    ...tiers(strongTopics, [
      {
        id: 'topics-10',
        title: 'Ten topics solid',
        description: 'Reach 90% accuracy in ten grammar topics',
        target: 10,
      },
    ]),
  ];
}

/** Earned first, then the closest to being earned — the next one to aim at. */
export function sortAchievements(achievements: readonly Achievement[]): Achievement[] {
  return [...achievements].sort((a, b) => {
    if (a.earned !== b.earned) return a.earned ? -1 : 1;
    return b.progress / b.target - a.progress / a.target;
  });
}
