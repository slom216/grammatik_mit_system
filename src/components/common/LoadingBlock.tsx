export interface LoadingBlockProps {
  /** Announced to screen readers, which never see the placeholder bars. */
  label?: string;
  /** Include a heading-sized bar. Omit where the page keeps its own h1. */
  withTitle?: boolean;
}

/**
 * Placeholder bars for content still in flight. `aria-busy` plus one hidden
 * label is the whole accessible story — the bars themselves are decorative and
 * would otherwise be announced as meaningless empty elements.
 */
export function LoadingBlock({ label = 'Loading', withTitle = true }: LoadingBlockProps) {
  return (
    <div className="stack" aria-busy="true">
      <span className="visually-hidden">{label}</span>
      {withTitle && <span className="skeleton skeleton--title" aria-hidden="true" />}
      <span className="skeleton" aria-hidden="true" />
      <span className="skeleton skeleton--line-short" aria-hidden="true" />
    </div>
  );
}
