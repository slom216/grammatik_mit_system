export interface ProgressBarProps {
  value: number;
  max?: number;
  label: string;
  /** Text shown on the right of the label row, e.g. "3 / 24". */
  valueText?: string;
  hideLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  valueText,
  hideLabel = false,
}: ProgressBarProps) {
  const safeMax = max <= 0 ? 100 : max;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const percent = Math.round((clamped / safeMax) * 100);
  const text = valueText ?? `${percent}%`;

  return (
    <div className="progress-bar">
      <div className={hideLabel ? 'visually-hidden' : 'progress-bar__label'}>
        <span>{label}</span>
        <span>{text}</span>
      </div>
      <div
        className="progress-bar__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={clamped}
        aria-valuetext={text}
        aria-label={label}
      >
        <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
