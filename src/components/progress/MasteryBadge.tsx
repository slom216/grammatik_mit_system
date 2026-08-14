import type { ChapterStatus } from '../../schemas/progressSchema';
import { Icon, type IconName } from '../common/Icon';

export interface MasteryBadgeProps {
  status: ChapterStatus;
  bestScorePercent?: number;
}

const LABELS: Record<ChapterStatus, { text: string; icon: IconName; className: string }> =
  {
    notStarted: { text: 'Not started', icon: 'circle', className: 'badge' },
    inProgress: {
      text: 'In progress',
      icon: 'circle-half',
      className: 'badge badge--accent',
    },
    completed: {
      text: 'Completed',
      icon: 'circle-check',
      className: 'badge badge--accent',
    },
    mastered: { text: 'Mastered', icon: 'star', className: 'badge badge--success' },
  };

export function MasteryBadge({ status, bestScorePercent }: MasteryBadgeProps) {
  const label = LABELS[status];
  return (
    <span className={label.className}>
      <Icon name={label.icon} />
      <span>
        {label.text}
        {status !== 'notStarted' && bestScorePercent !== undefined
          ? ` · best ${bestScorePercent}%`
          : ''}
      </span>
    </span>
  );
}
