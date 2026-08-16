import type { ChapterProgress } from '../../schemas/progressSchema';

/**
 * Clock format: `4:07` below an hour, `1:04:07` above it. Seconds are kept —
 * a practice session is often shorter than a minute and "0 min" reads as broken.
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  const pad = (value: number) => String(value).padStart(2, '0');
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`;
}

/** Spoken form for screen readers and summaries: `1 h 4 min`, `47 s`. */
export function describeDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  if (totalSeconds < 60) return `${totalSeconds} s`;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  return hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`;
}

/** Every chapter's practice time plus the time from cumulative reviews. */
export function totalStudyMs(
  chapters: Record<number, ChapterProgress>,
  otherStudyMs: number,
): number {
  return Object.values(chapters).reduce(
    (sum, chapter) => sum + chapter.studyMs,
    otherStudyMs,
  );
}

/**
 * Average length of a finished practice session. `attempts` only counts
 * sessions that were finished, so time from a session the learner walked out
 * of has no attempt to divide by — the average stays undefined until one
 * completes, rather than being inflated by unfinished time.
 */
export function averageSessionMs(chapter: ChapterProgress): number | null {
  return chapter.attempts > 0 ? chapter.studyMs / chapter.attempts : null;
}
