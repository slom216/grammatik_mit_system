import type { Exercise } from '../../schemas/exerciseSchema';
import { expectedAnswerFor } from '../../features/practice/practiceStore';
import { SpeakButton } from '../common/SpeakButton';

export interface MissedExercisesProps {
  exercises: readonly Exercise[];
}

/**
 * What the session got wrong, with the right answer beside it.
 *
 * The list was already computed to score the session (`incorrectExerciseIds`)
 * and then thrown away, so a learner who wanted to know what they missed had to
 * run the whole chapter again to find out.
 */
export function MissedExercises({ exercises }: MissedExercisesProps) {
  return (
    <ul className="stack stack--tight missed-list">
      {exercises.map((exercise) => (
        <li key={exercise.id} className="missed-list__item">
          <p className="missed-list__prompt" lang="de">
            {exercise.prompt}
          </p>
          <p className="text-sm">
            <span className="text-muted">Correct answer: </span>
            <strong lang="de">{expectedAnswerFor(exercise)}</strong>{' '}
            <SpeakButton text={expectedAnswerFor(exercise)} />
          </p>
          <p className="text-sm text-muted">{exercise.explanation}</p>
        </li>
      ))}
    </ul>
  );
}
