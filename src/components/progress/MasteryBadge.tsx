import type { ChapterStatus } from '../../schemas/progressSchema';

export interface MasteryBadgeProps {
  status: ChapterStatus;
  bestScorePercent?: number;
}

const LABELS: Record<ChapterStatus, { text: string; icon: string; className: string }> = {
  notStarted: { text: 'Not started', icon: '○', className: 'badge' },
  inProgress: { text: 'In progress', icon: '◐', className: 'badge badge--accent' },
  completed: { text: 'Completed', icon: '●', className: 'badge badge--accent' },
  mastered: { text: 'Mastered', icon: '★', className: 'badge badge--success' },
};

export function MasteryBadge({ status, bestScorePercent }: MasteryBadgeProps) {
  const label = LABELS[status];
  return (
    <span className={label.className}>
      <span aria-hidden="true">{label.icon}</span>
      <span>
        {label.text}
        {status !== 'notStarted' && bestScorePercent !== undefined
          ? ` · best ${bestScorePercent}%`
          : ''}
      </span>
    </span>
  );
}
