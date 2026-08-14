import { beforeEach, describe, expect, it } from 'vitest';
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PracticePage } from './PracticePage';
import { renderWithRouter } from '../test/helpers/renderWithRouter';
import { usePracticeStore } from '../features/practice/practiceStore';
import { useProgressStore } from '../features/progress/progressStore';
import { useSettingsStore } from '../features/settings/settingsStore';
import { chapter001 } from '../content/chapters/chapter-001-personal-pronouns';

const CHAPTER_1_EXERCISE_COUNT = chapter001.exercises.length;

function renderPractice(search = '') {
  return renderWithRouter(<PracticePage />, {
    route: `/chapter/1/practice${search}`,
    path: '/chapter/:chapterNumber/practice',
  });
}

/**
 * Selects a single-choice option. The answer is checked automatically a
 * moment after selection, with no separate submit step.
 */
async function selectOption(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.click(screen.getByRole('radio', { name: new RegExp(text) }));
}

/** Answers the current single-choice exercise correctly and waits for feedback. */
async function answerChoiceCorrectly(
  user: ReturnType<typeof userEvent.setup>,
  text: string,
) {
  await selectOption(user, text);
  await waitFor(() =>
    expect(screen.getByTestId('exercise-feedback')).toHaveTextContent('Correct'),
  );
}

describe('PracticePage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useProgressStore.getState().resetProgress();
    usePracticeStore.getState().exitSession();
    useSettingsStore.setState({ shuffleOptions: false });
  });

  it('starts a session and shows the first exercise', () => {
    renderPractice();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/practice/i);
    expect(screen.getByTestId('exercise-counter')).toHaveTextContent(
      `Exercise 1 of ${CHAPTER_1_EXERCISE_COUNT} · multiple choice`,
    );
    expect(screen.getByText('Wir sind heute im Park.')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('runs a 24-exercise sample in quick mode', () => {
    renderPractice('?mode=quick');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/\(quick\)/i);
    expect(screen.getByTestId('exercise-counter')).toHaveTextContent('Exercise 1 of 24');
    expect(usePracticeStore.getState().mode).toBe('quick');
    expect(usePracticeStore.getState().exerciseIds).toHaveLength(24);
  });

  it('checks a single-choice answer automatically, with no submit button', async () => {
    const user = userEvent.setup();
    renderPractice();

    expect(
      screen.queryByRole('button', { name: /check answer/i }),
    ).not.toBeInTheDocument();

    await answerChoiceCorrectly(user, 'wir');
    expect(
      within(screen.getByTestId('exercise-feedback')).getByText('Correct'),
    ).toBeInTheDocument();
  });

  it('scores a correct first attempt with one point and shows feedback', async () => {
    const user = userEvent.setup();
    renderPractice();

    await answerChoiceCorrectly(user, 'wir');

    const feedback = screen.getByTestId('exercise-feedback');
    expect(within(feedback).getByText('Correct')).toBeInTheDocument();
    expect(feedback).toHaveTextContent(/The subject of the sentence is wir/);

    const result = usePracticeStore.getState().results['ch01-ex-01'];
    expect(result?.outcome).toBe('correctFirstAttempt');
    expect(result?.score).toBe(1);
  });

  it('offers a second attempt after a wrong answer and scores it with half a point', async () => {
    const user = userEvent.setup();
    renderPractice();

    await selectOption(user, '^ihr$');
    await waitFor(() =>
      expect(screen.getByTestId('exercise-feedback')).toHaveTextContent(
        'Not correct yet',
      ),
    );
    expect(screen.getByText(/one more attempt/i)).toBeInTheDocument();
    expect(usePracticeStore.getState().results['ch01-ex-01']).toBeUndefined();

    await user.click(screen.getByRole('button', { name: /try again/i }));
    await answerChoiceCorrectly(user, 'wir');

    const result = usePracticeStore.getState().results['ch01-ex-01'];
    expect(result?.outcome).toBe('correctSecondAttempt');
    expect(result?.score).toBe(0.5);
  });

  it('shows the expected answer after the second incorrect attempt', async () => {
    const user = userEvent.setup();
    renderPractice();

    await selectOption(user, '^ihr$');
    await waitFor(() =>
      expect(screen.getByTestId('exercise-feedback')).toHaveTextContent(
        'Not correct yet',
      ),
    );
    await user.click(screen.getByRole('button', { name: /try again/i }));
    await selectOption(user, '^sie$');
    await waitFor(() =>
      expect(screen.getByTestId('exercise-feedback')).toHaveTextContent(
        /Expected answer/,
      ),
    );

    expect(usePracticeStore.getState().results['ch01-ex-01']?.outcome).toBe('incorrect');
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });

  it('reveals the answer on request and scores it with zero', async () => {
    const user = userEvent.setup();
    renderPractice();

    await selectOption(user, '^ihr$');
    await waitFor(() =>
      expect(screen.getByTestId('exercise-feedback')).toHaveTextContent(
        'Not correct yet',
      ),
    );
    await user.click(screen.getByRole('button', { name: /show answer/i }));

    const feedback = screen.getByTestId('exercise-feedback');
    expect(feedback).toHaveTextContent('Answer shown');
    expect(feedback).toHaveTextContent('wir');
    expect(usePracticeStore.getState().results['ch01-ex-01']?.outcome).toBe('revealed');
    expect(usePracticeStore.getState().results['ch01-ex-01']?.score).toBe(0);
  });

  it('moves to the next exercise and updates the progress bar', async () => {
    const user = userEvent.setup();
    renderPractice();

    await answerChoiceCorrectly(user, 'wir');
    await user.click(screen.getByRole('button', { name: /next exercise/i }));

    expect(screen.getByTestId('exercise-counter')).toHaveTextContent(
      `Exercise 2 of ${CHAPTER_1_EXERCISE_COUNT}`,
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    expect(screen.queryByTestId('exercise-feedback')).not.toBeInTheDocument();
  });

  it('checks a text answer, keeps it visible and accepts a retry', async () => {
    const user = userEvent.setup();
    renderPractice();

    // Jump to the first text-input exercise.
    act(() => usePracticeStore.setState({ currentIndex: 12 }));

    const field = screen.getByLabelText('Der Mann ist müde. → ___ ist müde.');
    await user.type(field, 'sie');
    await user.click(screen.getByRole('button', { name: /check answer/i }));

    const feedback = screen.getByTestId('exercise-feedback');
    expect(feedback).toHaveTextContent('Not correct yet');
    expect(feedback).toHaveTextContent('sie');
    expect(field).toHaveValue('sie');

    await user.click(screen.getByRole('button', { name: /try again/i }));
    await user.clear(field);
    await user.type(field, 'er');
    await user.click(screen.getByRole('button', { name: /check answer/i }));

    expect(screen.getByTestId('exercise-feedback')).toHaveTextContent('Correct');
    expect(usePracticeStore.getState().results['ch01-ex-13']?.outcome).toBe(
      'correctSecondAttempt',
    );
  });

  it('writes umlauts through the helper buttons', async () => {
    const user = userEvent.setup();
    renderPractice();

    act(() => usePracticeStore.setState({ currentIndex: 22 }));

    const field = screen.getByLabelText(/You \(several friends\) are late/);
    await user.type(field, 'Ihr seid sp');
    await user.click(screen.getByRole('button', { name: /insert a umlaut, lowercase/i }));
    await user.type(field, 't.');

    expect(field).toHaveValue('Ihr seid spät.');

    await user.click(screen.getByRole('button', { name: /check answer/i }));
    expect(screen.getByTestId('exercise-feedback')).toHaveTextContent('Correct');
  });

  it('can be completed with the keyboard alone', async () => {
    const user = userEvent.setup();
    renderPractice();

    await user.tab(); // first radio option
    expect(screen.getByRole('radio', { name: /wir/ })).toHaveFocus();

    await user.keyboard(' '); // select with the space bar
    expect(screen.getByRole('radio', { name: /wir/ })).toBeChecked();

    // The answer is checked automatically a moment after selection.
    await waitFor(() =>
      expect(screen.getByTestId('exercise-feedback')).toHaveTextContent('Correct'),
    );

    // Focus moves straight to "Next exercise" so the learner can keep going.
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /next exercise/i })).toHaveFocus(),
    );

    await user.keyboard('{Enter}');
    expect(screen.getByTestId('exercise-counter')).toHaveTextContent(
      `Exercise 2 of ${CHAPTER_1_EXERCISE_COUNT}`,
    );
  });

  it('moves focus to "Try again" after an incorrect answer', async () => {
    const user = userEvent.setup();
    renderPractice();

    await selectOption(user, '^ihr$');

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /try again/i })).toHaveFocus(),
    );
  });

  it('asks for confirmation before leaving and resumes the session afterwards', async () => {
    const user = userEvent.setup();
    const view = renderPractice();

    await answerChoiceCorrectly(user, 'wir');
    await user.click(screen.getByRole('button', { name: /next exercise/i }));
    await user.click(screen.getByRole('button', { name: /exit practice/i }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent(/leave this practice session/i);

    await user.click(within(dialog).getByRole('button', { name: /leave practice/i }));
    expect(usePracticeStore.getState().status).toBe('idle');

    // Simulate a page refresh: unmount, clear the in-memory session, remount.
    view.unmount();
    usePracticeStore.setState({
      status: 'idle',
      chapterNumber: null,
      exerciseIds: [],
      results: {},
      currentIndex: 0,
    });

    renderPractice();

    expect(screen.getByTestId('exercise-counter')).toHaveTextContent(
      `Exercise 2 of ${CHAPTER_1_EXERCISE_COUNT}`,
    );
    expect(usePracticeStore.getState().results['ch01-ex-01']?.outcome).toBe(
      'correctFirstAttempt',
    );
  });

  it('records progress that survives a reload', async () => {
    const user = userEvent.setup();
    renderPractice();

    await answerChoiceCorrectly(user, 'wir');

    act(() =>
      useProgressStore.setState({ chapters: {}, exerciseHistory: {}, hydrated: false }),
    );
    act(() => useProgressStore.getState().hydrate());

    expect(useProgressStore.getState().chapters[1]?.status).toBe('inProgress');
    expect(useProgressStore.getState().exerciseHistory['ch01-ex-01']?.timesCorrect).toBe(
      1,
    );
  });
});
