import { useState } from 'react';
import { useBlocker } from 'react-router-dom';
import { usePracticeStore } from '../../features/practice/practiceStore';

/**
 * The "leave this session?" dialog, for the exit button and for anything else
 * that leaves the page mid-session: browser Back, a header link. Once the
 * session is finished, paused or exited the store is no longer active, so
 * nothing is blocked.
 */
export function useExitConfirmation() {
  const [requested, setRequested] = useState(false);
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      usePracticeStore.getState().status === 'active' &&
      currentLocation.pathname !== nextLocation.pathname,
  );

  return {
    open: requested || blocker.state === 'blocked',
    request: () => setRequested(true),
    stay: () => {
      setRequested(false);
      if (blocker.state === 'blocked') blocker.reset();
    },
    /**
     * Runs `endSession` (which must leave the store inactive), then continues
     * the navigation that was blocked, or calls `fallback` for the exit button.
     */
    leave: (endSession: () => void, fallback?: () => void) => {
      endSession();
      setRequested(false);
      if (blocker.state === 'blocked') blocker.proceed();
      else fallback?.();
    },
  };
}
