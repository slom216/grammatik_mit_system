import { useState } from 'react';
import { useProgressStore } from '../../features/progress/progressStore';
import { Button } from './Button';

/**
 * Site-wide, because both problems affect every page: the learner may be
 * mid-lesson when saving starts to fail. The dashboard keeps its own notice for
 * progress that was reset on load.
 */
export function ProgressStorageNotice() {
  const readOnly = useProgressStore((state) => state.readOnly);
  const storageUnavailable = useProgressStore((state) => state.storageUnavailable);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || (!readOnly && !storageUnavailable)) return null;

  return (
    <div className="notice" role="status">
      <p>
        {readOnly ? (
          <>
            <strong>Your progress was saved by a newer version of this app.</strong> This
            tab is out of date, so it will not save anything, to keep that progress safe.
            Reload the page to update.
          </>
        ) : (
          <>
            <strong>Your progress can&rsquo;t be saved in this browser.</strong> Storage
            is blocked or full, for example in a private window. You can keep practising,
            but answers will be lost when you close the tab.
          </>
        )}
      </p>
      <Button variant="ghost" onClick={() => setDismissed(true)}>
        Dismiss
      </Button>
    </div>
  );
}
