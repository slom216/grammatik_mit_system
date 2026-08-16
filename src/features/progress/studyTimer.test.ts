import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { selectChapterProgress, useProgressStore } from './progressStore';
import { useStudyTimer } from './studyTimer';
import { totalStudyMs } from './studyTime';

/** jsdom has no window manager, so focus is faked at the source the timer reads. */
function setFocused(focused: boolean) {
  vi.spyOn(document, 'hasFocus').mockReturnValue(focused);
  window.dispatchEvent(new Event(focused ? 'focus' : 'blur'));
}

function chapterMs(chapterNumber: number) {
  return selectChapterProgress(useProgressStore.getState(), chapterNumber).studyMs;
}

describe('studyTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
    useProgressStore.getState().resetProgress();
    vi.spyOn(document, 'hasFocus').mockReturnValue(true);
  });

  afterEach(() => {
    useStudyTimer.getState().stop();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('counts the time the learner spends on a chapter', () => {
    useStudyTimer.getState().start(4);
    vi.advanceTimersByTime(5_000);

    expect(useStudyTimer.getState().elapsedMs).toBe(5_000);
    expect(useStudyTimer.getState().counting).toBe(true);

    useStudyTimer.getState().stop();
    expect(chapterMs(4)).toBe(5_000);
  });

  it('stops while the window has lost focus and resumes when it comes back', () => {
    useStudyTimer.getState().start(4);
    vi.advanceTimersByTime(3_000);

    setFocused(false);
    expect(useStudyTimer.getState().counting).toBe(false);
    // Time already spent is banked at the moment the timer pauses.
    expect(chapterMs(4)).toBe(3_000);

    vi.advanceTimersByTime(60_000);
    expect(useStudyTimer.getState().elapsedMs).toBe(3_000);
    expect(chapterMs(4)).toBe(3_000);

    setFocused(true);
    vi.advanceTimersByTime(2_000);
    expect(useStudyTimer.getState().elapsedMs).toBe(5_000);

    useStudyTimer.getState().stop();
    expect(chapterMs(4)).toBe(5_000);
  });

  it('stops while the tab is hidden', () => {
    useStudyTimer.getState().start(4);
    vi.advanceTimersByTime(1_000);

    const visibility = vi
      .spyOn(document, 'visibilityState', 'get')
      .mockReturnValue('hidden');
    document.dispatchEvent(new Event('visibilitychange'));
    vi.advanceTimersByTime(10_000);
    expect(useStudyTimer.getState().elapsedMs).toBe(1_000);

    visibility.mockReturnValue('visible');
    document.dispatchEvent(new Event('visibilitychange'));
    vi.advanceTimersByTime(1_000);
    expect(useStudyTimer.getState().elapsedMs).toBe(2_000);
  });

  it('banks time to storage while a long session is still running', () => {
    useStudyTimer.getState().start(4);
    vi.advanceTimersByTime(20_000);
    // Not stopped, not paused: a crash here must not lose the whole session.
    expect(chapterMs(4)).toBeGreaterThanOrEqual(15_000);
  });

  it('counts a cumulative review towards the total but no single chapter', () => {
    useStudyTimer.getState().start(null);
    vi.advanceTimersByTime(4_000);
    useStudyTimer.getState().stop();

    const progress = useProgressStore.getState();
    expect(progress.otherStudyMs).toBe(4_000);
    expect(chapterMs(4)).toBe(0);
    expect(totalStudyMs(progress.chapters, progress.otherStudyMs)).toBe(4_000);
  });

  it('does not count a gap left by a sleeping machine', () => {
    useStudyTimer.getState().start(4);
    vi.advanceTimersByTime(1_000);

    // The lid was closed for an hour with the tab focused: the wall clock jumps
    // but no tick ran, so the next tick must not bank the whole hour.
    vi.setSystemTime(Date.now() + 60 * 60 * 1_000);
    vi.advanceTimersByTime(1_000);
    useStudyTimer.getState().stop();

    expect(chapterMs(4)).toBe(6_000);
  });

  it('starting a second timer banks the first one', () => {
    useStudyTimer.getState().start(4);
    vi.advanceTimersByTime(2_000);
    useStudyTimer.getState().start(5);
    vi.advanceTimersByTime(3_000);
    useStudyTimer.getState().stop();

    expect(chapterMs(4)).toBe(2_000);
    expect(chapterMs(5)).toBe(3_000);
  });
});
