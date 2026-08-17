import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExerciseRenderer } from './ExerciseRenderer';
import type { TextInputExercise } from '../../schemas/exerciseSchema';

function noop() {
  // intentionally empty
}

function translation(overrides: Partial<TextInputExercise> = {}): TextInputExercise {
  return {
    id: 'ex-translate',
    chapterNumber: 7,
    order: 59,
    type: 'textInput',
    prompt: 'My grandmother says I should visit her more often.',
    level: 'transfer',
    grammarFocus: ['sollen'],
    explanation: 'Reported advice uses sollen.',
    acceptedAnswers: ['Meine Oma sagt, ich soll sie öfter besuchen.'],
    answerMode: 'normalized',
    ...overrides,
  };
}

function renderText(exercise: TextInputExercise, showHints = true) {
  render(
    <ExerciseRenderer
      exercise={exercise}
      optionOrder={[]}
      segmentOrder={[]}
      wordBankOrder={[]}
      matchingRightOrder={[]}
      feedback={null}
      resolved={false}
      isLast={false}
      showHints={showHints}
      showUmlautHelper={false}
      autoAdvance={false}
      onSubmitChoice={noop}
      onSubmitText={noop}
      onSubmitOrdering={noop}
      onSubmitSlots={noop}
      onSubmitMatching={noop}
      onSubmitErrorSpotting={noop}
      onRetry={noop}
      onReveal={noop}
      onNext={noop}
      onFinish={noop}
      onExit={noop}
    />,
  );
}

const bankButton = /stuck\? show the words/i;

describe('text-input word bank', () => {
  it('reveals the answer’s words without their final full stop', async () => {
    renderText(translation());

    await userEvent.click(screen.getByRole('button', { name: bankButton }));

    const words = screen.getAllByRole('listitem').map((item) => item.textContent);
    expect([...words].sort()).toEqual(
      ['Meine', 'Oma', 'besuchen', 'ich', 'sagt,', 'sie', 'soll', 'öfter'].sort(),
    );
    // The full stop would mark which word ends the sentence.
    expect(words).not.toContain('besuchen.');
  });

  it('offers nothing when the answer is too short to be worth splitting', () => {
    renderText(translation({ acceptedAnswers: ['Wir sind da.'] }));
    expect(screen.queryByRole('button', { name: bankButton })).not.toBeInTheDocument();
  });

  it('follows the "show hints" setting', () => {
    renderText(translation(), false);
    expect(screen.queryByRole('button', { name: bankButton })).not.toBeInTheDocument();
  });

  it('is gone once the exercise is resolved', () => {
    render(
      <ExerciseRenderer
        exercise={translation()}
        optionOrder={[]}
        segmentOrder={[]}
        wordBankOrder={[]}
        matchingRightOrder={[]}
        feedback={{
          exerciseId: 'ex-translate',
          kind: 'correct',
          attempts: 1,
          canRetry: false,
          submittedAnswer: 'Meine Oma sagt, ich soll sie öfter besuchen.',
        }}
        resolved
        isLast={false}
        showHints
        showUmlautHelper={false}
        autoAdvance={false}
        onSubmitChoice={noop}
        onSubmitText={noop}
        onSubmitOrdering={noop}
        onSubmitSlots={noop}
        onSubmitMatching={noop}
        onSubmitErrorSpotting={noop}
        onRetry={noop}
        onReveal={noop}
        onNext={noop}
        onFinish={noop}
        onExit={noop}
      />,
    );
    expect(screen.queryByRole('button', { name: bankButton })).not.toBeInTheDocument();
  });
});
