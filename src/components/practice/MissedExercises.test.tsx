import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MissedExercises } from './MissedExercises';
import type { Exercise } from '../../schemas/exerciseSchema';

describe('MissedExercises', () => {
  it('does not print an ordering prompt that is the answer itself', () => {
    const exercise = {
      id: 'x-1',
      type: 'sentenceOrdering',
      prompt: 'Wir bleiben / zu Hause.',
      instruction: 'Put the segments in the correct order.',
      segments: [
        { id: 's1', text: 'Wir bleiben' },
        { id: 's2', text: 'zu Hause.' },
      ],
      explanation: 'Verb second.',
    } as unknown as Exercise;

    render(<MissedExercises exercises={[exercise]} />);

    expect(
      screen.getByText('Put the segments in the correct order.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Wir bleiben / zu Hause.')).not.toBeInTheDocument();
  });
});
