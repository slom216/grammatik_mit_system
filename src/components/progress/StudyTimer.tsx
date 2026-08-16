import { useEffect } from 'react';
import { Icon } from '../common/Icon';
import { formatDuration } from '../../features/progress/studyTime';
import { useStudyTimer } from '../../features/progress/studyTimer';

export interface StudyTimerProps {
  /** The chapter the time counts towards; `null` for a cumulative review. */
  chapterNumber: number | null;
}

/**
 * The session clock. Mounting it starts the timer, unmounting it banks the
 * time — so leaving the practice screen by any route (finish, exit, the
 * browser's back button) stops the count.
 */
export function StudyTimer({ chapterNumber }: StudyTimerProps) {
  const elapsedMs = useStudyTimer((state) => state.elapsedMs);
  const counting = useStudyTimer((state) => state.counting);

  useEffect(() => {
    useStudyTimer.getState().start(chapterNumber);
    return () => useStudyTimer.getState().stop();
  }, [chapterNumber]);

  const time = formatDuration(elapsedMs);
  return (
    <span
      className={`badge study-timer${counting ? '' : ' study-timer--paused'}`}
      // `timer` keeps assistive tech from announcing every second on its own.
      role="timer"
      aria-label={`Time on this session: ${time}${counting ? '' : ', paused'}`}
      data-testid="study-timer"
    >
      <Icon name="clock" />
      {time}
      {!counting && <span className="study-timer__state">paused</span>}
    </span>
  );
}
