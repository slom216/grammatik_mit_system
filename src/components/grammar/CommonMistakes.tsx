import type { CommonMistake } from '../../schemas/chapterSchema';

export interface CommonMistakesProps {
  mistakes: readonly CommonMistake[];
}

export function CommonMistakes({ mistakes }: CommonMistakesProps) {
  return (
    <ul className="mistake-list">
      {mistakes.map((mistake, index) => (
        <li key={`${mistake.incorrect}-${index}`}>
          <p lang="de">
            <span className="visually-hidden">Incorrect: </span>
            <span aria-hidden="true">✗ </span>
            <span className="mistake-list__incorrect">{mistake.incorrect}</span>
          </p>
          <p lang="de">
            <span className="visually-hidden">Correct: </span>
            <span aria-hidden="true">✓ </span>
            <span className="mistake-list__correct">{mistake.correct}</span>
          </p>
          <p className="text-sm text-muted">{mistake.explanation}</p>
        </li>
      ))}
    </ul>
  );
}
