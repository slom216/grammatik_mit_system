import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExerciseRenderer } from './ExerciseRenderer';
import type {
  DragToSlotsExercise,
  ErrorSpottingExercise,
  MatchingExercise,
  SentenceOrderingExercise,
} from '../../schemas/exerciseSchema';

/**
 * Exercises these four new types end to end through the real `ExerciseRenderer`
 * dispatch, since no chapter content authors them yet (this is infrastructure
 * built ahead of a future content-expansion phase) — the live app can't
 * otherwise be used to exercise this UI.
 */
function noop() {
  // intentionally empty
}

function baseProps() {
  return {
    optionOrder: [],
    segmentOrder: [],
    wordBankOrder: [],
    matchingRightOrder: [],
    feedback: null,
    resolved: false,
    isLast: false,
    showHints: false,
    showUmlautHelper: false,
    autoAdvance: false,
    onSubmitChoice: noop,
    onSubmitText: noop,
    onSubmitOrdering: noop,
    onSubmitSlots: noop,
    onSubmitMatching: noop,
    onSubmitErrorSpotting: noop,
    onRetry: noop,
    onReveal: noop,
    onNext: noop,
    onFinish: noop,
    onExit: noop,
  };
}

describe('ExerciseRenderer with sentenceOrdering', () => {
  const exercise: SentenceOrderingExercise = {
    id: 'ex-ordering',
    chapterNumber: 0,
    order: 1,
    type: 'sentenceOrdering',
    prompt: 'Order the words.',
    level: 'production',
    grammarFocus: ['word order'],
    explanation: 'The verb comes second.',
    segments: [
      { id: 's1', text: 'Ich' },
      { id: 's2', text: 'gehe' },
      { id: 's3', text: 'heim' },
    ],
  };

  it('lets the learner reorder segments and submits the resulting order', async () => {
    const user = userEvent.setup();
    const onSubmitOrdering = vi.fn();

    render(
      <ExerciseRenderer
        {...baseProps()}
        exercise={exercise}
        segmentOrder={['s2', 's1', 's3']}
        onSubmitOrdering={onSubmitOrdering}
      />,
    );

    expect(screen.getByText('gehe')).toBeInTheDocument();

    // Move "Ich" (currently second) one step earlier so the order becomes correct.
    await user.click(screen.getByRole('button', { name: /move "ich" earlier/i }));

    await user.click(screen.getByRole('button', { name: /check answer/i }));

    expect(onSubmitOrdering).toHaveBeenCalledWith(['s1', 's2', 's3']);
  });
});

describe('ExerciseRenderer with dragToSlots', () => {
  const singleSlotExercise: DragToSlotsExercise = {
    id: 'ex-slots',
    chapterNumber: 0,
    order: 1,
    type: 'dragToSlots',
    prompt: 'Fill in the modal verb.',
    level: 'controlled',
    grammarFocus: ['modal verbs'],
    explanation: 'ich takes kann.',
    templateParts: ['Ich ', ' heute nicht arbeiten.'],
    slots: [{ id: 'slot1', correctWord: 'kann' }],
    wordBank: ['kann', 'können', 'kannst'],
  };

  const twoSlotExercise: DragToSlotsExercise = {
    id: 'ex-slots-2',
    chapterNumber: 0,
    order: 2,
    type: 'dragToSlots',
    prompt: 'Fill in both modal verbs.',
    level: 'controlled',
    grammarFocus: ['modal verbs'],
    explanation: 'ich takes kann, du takes kannst.',
    templateParts: ['Ich ', ' das, du ', ' das auch.'],
    slots: [
      { id: 'slot1', correctWord: 'kann' },
      { id: 'slot2', correctWord: 'kannst' },
    ],
    wordBank: ['kann', 'kannst'],
  };

  it('fills the sole empty slot immediately when a word is selected', async () => {
    const user = userEvent.setup();
    const onSubmitSlots = vi.fn();

    render(
      <ExerciseRenderer
        {...baseProps()}
        exercise={singleSlotExercise}
        wordBankOrder={[0, 1, 2]}
        onSubmitSlots={onSubmitSlots}
      />,
    );

    expect(screen.getByRole('button', { name: /check answer/i })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'kann' }));

    expect(
      screen.getByRole('button', { name: /slot filled with "kann"/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /check answer/i }));

    expect(onSubmitSlots).toHaveBeenCalledWith({ slot1: 'kann' });
  });

  it('checks the answer by itself once the last slot is filled', async () => {
    const user = userEvent.setup();
    const onSubmitSlots = vi.fn();

    render(
      <ExerciseRenderer
        {...baseProps()}
        exercise={twoSlotExercise}
        wordBankOrder={[0, 1]}
        onSubmitSlots={onSubmitSlots}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'kann' }));
    const emptySlots = screen.getAllByRole('button', { name: /empty slot/i });
    await user.click(emptySlots[0]!);

    // One slot still open: nothing may be submitted yet.
    await new Promise((resolve) => setTimeout(resolve, 700));
    expect(onSubmitSlots).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'kannst' }));

    await waitFor(
      () =>
        expect(onSubmitSlots).toHaveBeenCalledWith({ slot1: 'kann', slot2: 'kannst' }),
      { timeout: 2000 },
    );
    expect(onSubmitSlots).toHaveBeenCalledTimes(1);
  });

  it('lets the learner select a word then click a slot to fill it when multiple slots are empty', async () => {
    const user = userEvent.setup();
    const onSubmitSlots = vi.fn();

    render(
      <ExerciseRenderer
        {...baseProps()}
        exercise={twoSlotExercise}
        wordBankOrder={[0, 1]}
        onSubmitSlots={onSubmitSlots}
      />,
    );

    expect(screen.getByRole('button', { name: /check answer/i })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'kannst' }));
    const emptySlots = screen.getAllByRole('button', { name: /empty slot/i });
    await user.click(emptySlots[1]!);

    expect(
      screen.getByRole('button', { name: /slot filled with "kannst"/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'kann' }));

    expect(
      screen.getByRole('button', { name: /slot filled with "kann"/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /check answer/i }));

    expect(onSubmitSlots).toHaveBeenCalledWith({ slot1: 'kann', slot2: 'kannst' });
  });
});

describe('ExerciseRenderer with matching', () => {
  const exercise: MatchingExercise = {
    id: 'ex-matching',
    chapterNumber: 0,
    order: 1,
    type: 'matching',
    prompt: 'Match the pronoun to its possessive.',
    level: 'recognition',
    grammarFocus: ['possessives'],
    explanation: 'Each pronoun has one matching possessive.',
    pairs: [
      { id: 'p1', left: 'ich', right: 'mein' },
      { id: 'p2', left: 'du', right: 'dein' },
      { id: 'p3', left: 'er', right: 'sein' },
    ],
  };

  it('lets the learner connect all pairs and submits the pairing', async () => {
    const user = userEvent.setup();
    const onSubmitMatching = vi.fn();

    render(
      <ExerciseRenderer
        {...baseProps()}
        exercise={exercise}
        matchingRightOrder={['p1', 'p2', 'p3']}
        onSubmitMatching={onSubmitMatching}
      />,
    );

    await user.click(screen.getByRole('button', { name: '1. ich' }));
    await user.click(screen.getByRole('button', { name: 'mein — not matched' }));
    await user.click(screen.getByRole('button', { name: '2. du' }));
    await user.click(screen.getByRole('button', { name: 'dein — not matched' }));
    await user.click(screen.getByRole('button', { name: '3. er' }));
    await user.click(screen.getByRole('button', { name: 'sein — not matched' }));

    // The pair number is what tells the learner which two items belong together.
    expect(
      screen.getByRole('button', { name: '1. ich — matched with mein' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'mein — matched with 1. ich' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /check answer/i }));

    expect(onSubmitMatching).toHaveBeenCalledWith({ p1: 'p1', p2: 'p2', p3: 'p3' });
  });
});

describe('ExerciseRenderer with errorSpotting', () => {
  const exercise: ErrorSpottingExercise = {
    id: 'ex-errorspotting',
    chapterNumber: 0,
    order: 1,
    type: 'errorSpotting',
    prompt: 'Click the word that is wrong.',
    level: 'controlled',
    grammarFocus: ['verb conjugation'],
    explanation: 'ihr takes seid, not sind.',
    tokens: ['Ihr', 'sind', 'sehr', 'freundlich.'],
    errorTokenIndex: 1,
    correction: 'seid',
  };

  it('auto-submits the clicked token with no separate submit button', async () => {
    const user = userEvent.setup();
    const onSubmitErrorSpotting = vi.fn();

    render(
      <ExerciseRenderer
        {...baseProps()}
        exercise={exercise}
        onSubmitErrorSpotting={onSubmitErrorSpotting}
      />,
    );

    expect(
      screen.queryByRole('button', { name: /check answer/i }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'sind' }));

    await waitFor(() => expect(onSubmitErrorSpotting).toHaveBeenCalledWith(1));
  });
});
