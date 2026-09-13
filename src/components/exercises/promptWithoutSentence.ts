const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Most prompts restate the gapped sentence that is rendered right below them,
 * which puts the same German on screen twice. Strip that restatement and keep
 * only what the sentence itself does not say — the situation, or a hint like
 * "(Dativ, feminin)". Returns null when nothing is left worth showing.
 */
export function promptWithoutSentence(
  prompt: string,
  templateParts: string[],
): string | null {
  const sentence = new RegExp(
    templateParts
      .map((part) => escapeRegExp(part.trim()).replace(/\s+/g, '\\s+'))
      .join('\\s*(?:_{2,}|＿+)\\s*'),
  );
  const match = sentence.exec(prompt);
  // No restatement to strip: leave the prompt exactly as authored.
  if (!match) return prompt;

  const residual = (
    prompt.slice(0, match.index) + prompt.slice(match.index + match[0].length)
  )
    .replace(/["„“”]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^[\s:;,–—-]+|[\s:;,–—-]+$/g, '')
    // "Vervollständige den Satz: (reparieren)" — the colon introduced the
    // sentence that just went away.
    .replace(/:\s*\(/, ' (');
  return /\p{L}/u.test(residual) ? residual : null;
}
