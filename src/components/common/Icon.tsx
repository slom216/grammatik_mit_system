/**
 * The one icon family (design.md: outline only, 2px stroke, rounded joins,
 * simple geometry). Paths live in a lookup map rather than one module per icon
 * — the whole set is about a kilobyte, and a single `d` string per name forces
 * every icon to be expressible as stroked subpaths with no fills.
 *
 * Icons never carry meaning on their own: they are always `aria-hidden`, and
 * every call site keeps the `visually-hidden` label or `aria-label` it already
 * had. That is also what keeps accessible names — and the e2e selectors that
 * match on them — unchanged.
 *
 * Size and colour come from CSS: `.icon` sizes it, `currentColor` inherits the
 * surrounding text colour, so light/dark works with no extra rules.
 */
export type IconName =
  | 'check'
  | 'cross'
  | 'alert'
  | 'speaker'
  | 'clock'
  | 'flame'
  | 'star'
  | 'circle'
  | 'circle-half'
  | 'circle-check'
  | 'arrow-left'
  | 'arrow-right'
  | 'grip'
  | 'sun'
  | 'moon';

const ICON_PATHS: Record<IconName, string> = {
  check: 'M4 12.5 9 17.5 20 6.5',
  cross: 'M6 6 18 18M18 6 6 18',
  alert: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 7.5v5 M12 16.5h.01',
  speaker:
    'M11 5 6.5 9H3v6h3.5L11 19V5Z M15 9.5a3.5 3.5 0 0 1 0 5 M17.8 6.8a7.5 7.5 0 0 1 0 10.4',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 7v5l3 2',
  flame:
    'M12 22a7 7 0 0 0 7-7c0-4-3-6-4-9-2 1.5-3 3.5-3 5-1-1-1.5-2-1.5-3.5C8 9.5 5 11.5 5 15a7 7 0 0 0 7 7Z',
  star: 'M12 3.5l2.6 5.4 5.9.85-4.3 4.15 1.02 5.85L12 17l-5.22 2.75 1.02-5.85-4.3-4.15 5.9-.85z',
  circle: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
  'circle-half': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 12V3a9 9 0 0 1 9 9Z',
  'circle-check': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M8 12l3 3 5-6',
  'arrow-left': 'M19 12H5 M11 6l-6 6 6 6',
  'arrow-right': 'M5 12h14 M13 6l6 6-6 6',
  grip: 'M9 6h.01 M9 12h.01 M9 18h.01 M15 6h.01 M15 12h.01 M15 18h.01',
  sun:
    'M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z M12 2.5v2 M12 19.5v2 ' +
    'M2.5 12h2 M19.5 12h2 M5.2 5.2l1.4 1.4 M17.4 17.4l1.4 1.4 ' +
    'M18.8 5.2l-1.4 1.4 M6.6 17.4l-1.4 1.4',
  moon: 'M20.5 14.8A8.5 8.5 0 1 1 9.2 3.5a7 7 0 0 0 11.3 11.3Z',
};

export interface IconProps {
  name: IconName;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  return (
    <svg
      className={['icon', className].filter(Boolean).join(' ')}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}
