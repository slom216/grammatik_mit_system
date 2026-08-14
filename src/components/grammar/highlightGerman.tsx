import type { ReactNode } from 'react';

/** Wraps every highlighted fragment of a German sentence in a <mark>. */
/** German fragments are wrapped by callers that already set `lang="de"`. */
export function highlightGerman(
  sentence: string,
  highlight?: readonly string[],
): ReactNode {
  if (!highlight || highlight.length === 0) return sentence;

  const escaped = highlight
    .filter((fragment) => fragment.length > 0)
    .map((fragment) => fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (escaped.length === 0) return sentence;

  const pattern = new RegExp(`(${escaped.join('|')})`, 'g');

  return sentence
    .split(pattern)
    .map((part, index) =>
      highlight.includes(part) ? <mark key={`${part}-${index}`}>{part}</mark> : part,
    );
}
