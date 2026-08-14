const SIZE = 120;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export interface ProgressRingProps {
  /** 0–100. Values outside the range are clamped. */
  percent: number;
  /** Names the figure for screen readers, e.g. "Course completed". */
  label: string;
  /** Small supporting line under the number, e.g. "12 of 85 chapters". */
  caption?: string;
}

/**
 * A single headline percentage. The arc is decorative reinforcement — the
 * number and its caption are real text underneath, so nothing is image-only.
 *
 * `stroke-linecap` stays at its `butt` default: a rounded cap would be the one
 * curve in an interface that is square everywhere else.
 */
export function ProgressRing({ percent, label, caption }: ProgressRingProps) {
  const clamped = Math.min(Math.max(Math.round(percent), 0), 100);

  return (
    <div className="progress-ring">
      {/* Only the percentage sits inside the ring: a caption long enough to be
          useful ("8 of 85 chapters") does not fit across the inner diameter. */}
      <div className="progress-ring__dial">
        <svg
          className="progress-ring__svg"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label={`${label}: ${clamped}%`}
        >
          <circle
            className="progress-ring__track"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
          />
          <circle
            className="progress-ring__value"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - clamped / 100)}
          />
        </svg>
        <span className="display-number">{clamped}%</span>
      </div>
      <p className="progress-ring__caption text-sm text-muted">{caption ?? label}</p>
    </div>
  );
}
