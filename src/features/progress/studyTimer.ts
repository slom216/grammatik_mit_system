import { create } from 'zustand';
import { useProgressStore } from './progressStore';

const TICK_MS = 1_000;

/** Time is written to storage this often, so a closed tab loses at most this. */
const FLUSH_EVERY_MS = 15_000;

/**
 * A tick longer than this means the machine slept or the browser throttled the
 * timer while the tab still looked focused. Counting the whole gap would add
 * hours of "study time" for a closed laptop lid, so the gap is capped instead.
 */
const MAX_TICK_MS = 5_000;

export interface StudyTimerState {
  /** The chapter the time is credited to; `null` for a cumulative review. */
  chapterNumber: number | null;
  /** Milliseconds counted for the session on screen, paused time excluded. */
  elapsedMs: number;
  /** False while the tab is hidden or the window has lost focus. */
  counting: boolean;
  /** True between `start` and `stop`, whether or not it is counting. */
  running: boolean;
  start: (chapterNumber: number | null) => void;
  stop: () => void;
}

/* Ticking state is deliberately outside the store: it changes every second and
   nothing renders from it. */
let intervalId: ReturnType<typeof setInterval> | null = null;
/** `null` while paused — the marker that no time is accruing. */
let lastTickAt: number | null = null;
let unflushedMs = 0;
let sinceFlushMs = 0;

function hasFocus(): boolean {
  if (typeof document === 'undefined') return false;
  return document.visibilityState !== 'hidden' && document.hasFocus();
}

function flush(): void {
  const ms = unflushedMs;
  unflushedMs = 0;
  sinceFlushMs = 0;
  if (ms <= 0) return;
  useProgressStore.getState().addStudyTime(useStudyTimer.getState().chapterNumber, ms);
}

function tick(): void {
  if (lastTickAt === null) return;
  const now = Date.now();
  const delta = Math.min(now - lastTickAt, MAX_TICK_MS);
  lastTickAt = now;
  if (delta <= 0) return;

  unflushedMs += delta;
  sinceFlushMs += delta;
  useStudyTimer.setState((state) => ({ elapsedMs: state.elapsedMs + delta }));
  if (sinceFlushMs >= FLUSH_EVERY_MS) flush();
}

/** Counts the time up to now, then stops counting and banks it. */
function pause(): void {
  tick();
  lastTickAt = null;
  flush();
  useStudyTimer.setState({ counting: false });
}

function resume(): void {
  if (!useStudyTimer.getState().running || lastTickAt !== null) return;
  lastTickAt = Date.now();
  useStudyTimer.setState({ counting: true });
}

function syncWithFocus(): void {
  if (hasFocus()) resume();
  else pause();
}

function addListeners(): void {
  document.addEventListener('visibilitychange', syncWithFocus);
  // Focus and blur of the *window*: neither event bubbles, so focusing a
  // button inside the page does not reach this listener.
  window.addEventListener('focus', syncWithFocus);
  window.addEventListener('blur', syncWithFocus);
  // The tab may never get another event after this one.
  window.addEventListener('pagehide', pause);
}

function removeListeners(): void {
  document.removeEventListener('visibilitychange', syncWithFocus);
  window.removeEventListener('focus', syncWithFocus);
  window.removeEventListener('blur', syncWithFocus);
  window.removeEventListener('pagehide', pause);
}

/**
 * Measures how long the learner actually works, and banks it against the
 * chapter. Only one timer runs at a time — starting a second one closes the
 * first, so navigating between chapters never double-counts.
 */
export const useStudyTimer = create<StudyTimerState>()((set, get) => ({
  chapterNumber: null,
  elapsedMs: 0,
  counting: false,
  running: false,

  start: (chapterNumber) => {
    if (get().running) get().stop();

    unflushedMs = 0;
    sinceFlushMs = 0;
    lastTickAt = null;
    set({ chapterNumber, elapsedMs: 0, counting: false, running: true });

    intervalId = setInterval(tick, TICK_MS);
    addListeners();
    // An unfocused tab starts paused rather than counting until the first blur.
    syncWithFocus();
  },

  stop: () => {
    if (!get().running) return;
    pause();
    if (intervalId !== null) clearInterval(intervalId);
    intervalId = null;
    removeListeners();
    set({ chapterNumber: null, elapsedMs: 0, counting: false, running: false });
  },
}));
