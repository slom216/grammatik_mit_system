import type { CommonMistake } from '../../schemas/chapterSchema';
import { Icon } from '../common/Icon';

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
            <Icon name="cross" />
            <span className="mistake-list__incorrect">{mistake.incorrect}</span>
          </p>
          <p lang="de">
            <span className="visually-hidden">Correct: </span>
            <Icon name="check" />
            <span className="mistake-list__correct">{mistake.correct}</span>
          </p>
          <p className="text-sm text-muted">{mistake.explanation}</p>
        </li>
      ))}
    </ul>
  );
}
