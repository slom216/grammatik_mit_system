import type { GrammarExample } from '../../schemas/chapterSchema';
import { highlightGerman } from './highlightGerman';

export interface ExampleListProps {
  examples: readonly GrammarExample[];
}

export function ExampleList({ examples }: ExampleListProps) {
  return (
    <ul className="example-list">
      {examples.map((example, index) => (
        <li key={`${example.german}-${index}`}>
          <p className="example-list__german" lang="de">
            {highlightGerman(example.german, example.highlight)}
          </p>
          <p className="example-list__english" lang="en">
            {example.english}
          </p>
          {example.explanation && (
            <p className="text-sm text-muted">{example.explanation}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
