import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExerciseRenderer } from './ExerciseRenderer';
import type { SingleChoiceExercise } from '../../schemas/exerciseSchema';

function noop() {
  // intentionally empty
}

const exercise: SingleChoiceExercise = {
  id: 'ex-choice',
  chapterNumber: 0,
  order: 1,
  type: 'singleChoice',
  prompt: 'Wähle die richtige Form.',
  level: 'recognition',
  grammarFocus: ['articles'],
  explanation: 'Nominative masculine takes "der".',
  options: [
    { id: 'o1', text: 'die' },
    { id: 'o2', text: 'der' },
    { id: 'o3', text: 'das' },
  ],
  correctOptionId: 'o2',
};

function renderChoice(overrides: Partial<Parameters<typeof ExerciseRenderer>[0]> = {}) {
  const onSubmitChoice = vi.fn();
  render(
    <ExerciseRenderer
      exercise={exercise}
      optionOrder={['o1', 'o2', 'o3']}
      segmentOrder={[]}
      wordBankOrder={[]}
      matchingRightOrder={[]}
      feedback={null}
      resolved={false}
      isLast={false}
      showHints={false}
      showUmlautHelper={false}
      autoAdvance={false}
      onSubmitChoice={onSubmitChoice}
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
      {...overrides}
    />,
  );
  return { onSubmitChoice };
}

describe('single-choice number keys', () => {
  it('numbers the options in display order', () => {
    renderChoice();
    expect(screen.getByRole('radio', { name: 'der' }).closest('label')).toHaveTextContent(
      /^2der$/,
    );
  });

  it('submits the matching option immediately when its number is pressed', async () => {
    const { onSubmitChoice } = renderChoice();
    await userEvent.keyboard('2');
    expect(onSubmitChoice).toHaveBeenCalledWith('o2');
    expect(screen.getByRole('radio', { name: 'der' })).toBeChecked();
  });

  it('ignores numbers without a matching option and keys once resolved', async () => {
    const { onSubmitChoice } = renderChoice();
    await userEvent.keyboard('9');
    expect(onSubmitChoice).not.toHaveBeenCalled();

    const resolved = renderChoice({ resolved: true });
    await userEvent.keyboard('1');
    expect(resolved.onSubmitChoice).not.toHaveBeenCalled();
  });
});
