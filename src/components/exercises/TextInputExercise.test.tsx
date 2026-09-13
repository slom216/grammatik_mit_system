import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TextInputExercise } from './TextInputExercise';
import type { TextInputExercise as TextInputExerciseData } from '../../schemas/exerciseSchema';

const exercise: TextInputExerciseData = {
  id: 'ex-text',
  chapterNumber: 0,
  order: 1,
  type: 'textInput',
  prompt: 'Wir ___ im Kino.',
  level: 'controlled',
  grammarFocus: ['sein'],
  explanation: 'wir takes sind.',
  acceptedAnswers: ['sind'],
  answerMode: 'normalized',
};

describe('TextInputExercise', () => {
  it.each([false, true])(
    'turns off phone auto-capitalisation (multiline %s)',
    (multiline) => {
      render(
        <TextInputExercise
          exercise={{ ...exercise, multiline }}
          value=""
          onChange={() => undefined}
          disabled={false}
          showUmlautHelper={false}
        />,
      );
      const field = screen.getByLabelText('Wir ___ im Kino.');
      expect(field.getAttribute('autocapitalize')).toBe('none');
      expect(field.getAttribute('autocorrect')).toBe('off');
    },
  );
});
