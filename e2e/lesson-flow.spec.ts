import { expect, test, type Page } from '@playwright/test';
import { demoChapter } from '../src/content/chapters/chapter-000-demo';
import { chapterRegistry } from '../src/content/registry';

const exercises = [...demoChapter.exercises].sort((a, b) => a.order - b.order);

function correctAnswerFor(exercise: (typeof exercises)[number]): string {
  return exercise.type === 'singleChoice'
    ? (exercise.options.find((option) => option.id === exercise.correctOptionId)?.text ??
        '')
    : (exercise.acceptedAnswers[0] ?? '');
}

/** Answers the exercise currently on screen correctly and submits it. */
async function answerCurrentExercise(page: Page, index: number) {
  const exercise = exercises[index];
  if (!exercise) throw new Error(`No exercise at index ${index}`);

  await expect(page.getByTestId('exercise-counter')).toContainText(
    `Exercise ${index + 1} of ${exercises.length}`,
  );

  if (exercise.type === 'singleChoice') {
    await page
      .getByRole('radio', { name: correctAnswerFor(exercise), exact: true })
      .check();
  } else {
    await page.getByRole('textbox').fill(correctAnswerFor(exercise));
  }

  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByTestId('exercise-feedback')).toContainText('Correct');
}

test.describe('lesson flow', () => {
  test('a learner can read a lesson, complete all 24 exercises and master the chapter', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Dashboard' }),
    ).toBeVisible();

    await page.getByRole('link', { name: 'Chapters', exact: true }).click();
    await expect(
      page.getByRole('heading', { level: 1, name: 'Chapter catalogue' }),
    ).toBeVisible();

    await page
      .getByRole('link', { name: new RegExp(demoChapter.title) })
      .first()
      .click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      demoChapter.title,
    );

    await page.getByRole('link', { name: 'Read the lesson' }).click();
    await expect(
      page.getByRole('table', { name: /Present tense of sein/i }),
    ).toBeVisible();
    await expect(page.getByRole('complementary', { name: 'Remember' })).toBeVisible();

    await page.getByRole('link', { name: /Start practice/ }).click();

    for (let index = 0; index < exercises.length; index += 1) {
      await answerCurrentExercise(page, index);
      if (index < exercises.length - 1) {
        await page.getByRole('button', { name: 'Next exercise' }).click();
      }
    }

    await page.getByRole('button', { name: 'Finish and see results' }).click();

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Results');
    await expect(page.getByText('Answered: 24 of 24')).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Chapter mastered' }),
    ).toBeVisible();

    // Progress survives a reload.
    await page.goto('/progress');
    await expect(page.getByRole('cell', { name: '100%' })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('cell', { name: '100%' })).toBeVisible();
  });

  test('a failed exercise can be retried and lands in the review queue', async ({
    page,
  }) => {
    await page.goto('/chapter/0/practice');

    const wrongOption = exercises[0];
    if (!wrongOption || wrongOption.type !== 'singleChoice') {
      throw new Error('The first exercise is expected to be a single-choice exercise');
    }
    const distractor = wrongOption.options.find(
      (option) => option.id !== wrongOption.correctOptionId,
    );

    await page.getByRole('radio', { name: distractor?.text ?? '', exact: true }).check();
    await page.getByRole('button', { name: 'Check answer' }).click();

    const feedback = page.getByTestId('exercise-feedback');
    await expect(feedback).toContainText('Not correct yet');
    await expect(feedback).toContainText('You have one more attempt.');

    await page.getByRole('button', { name: 'Try again' }).click();
    await answerCurrentExercise(page, 0);

    // The exercise is queued for a later day; move its due date into the past
    // so the review screen can be checked without waiting.
    await page.evaluate(() => {
      const key = 'grammatik-mit-system:progress';
      const raw = window.localStorage.getItem(key);
      if (!raw) throw new Error('progress was not persisted');
      const progress = JSON.parse(raw) as {
        exerciseHistory: Record<string, { dueAt?: string }>;
      };
      const history = progress.exerciseHistory['demo-ex-01'];
      if (!history?.dueAt) throw new Error('the exercise did not enter the review queue');
      history.dueAt = new Date(Date.now() - 60_000).toISOString();
      window.localStorage.setItem(key, JSON.stringify(progress));
    });

    await page.goto('/review');
    await expect(page.getByText(/1 exercise due across 1 chapter/)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Review now' })).toBeVisible();
  });

  test('a session survives a refresh in the middle of practice', async ({ page }) => {
    await page.goto('/chapter/0/practice');

    await answerCurrentExercise(page, 0);
    await page.getByRole('button', { name: 'Next exercise' }).click();
    await answerCurrentExercise(page, 1);
    await page.getByRole('button', { name: 'Next exercise' }).click();

    await page.reload();

    await expect(page.getByTestId('exercise-counter')).toContainText('Exercise 3 of 24');
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
  });

  test('a text-input exercise can be answered with umlauts from the helper', async ({
    page,
  }) => {
    await page.goto('/chapter/0/practice');

    // Exercise 23 asks for "Ihr seid spät."
    for (let index = 0; index < 22; index += 1) {
      await answerCurrentExercise(page, index);
      await page.getByRole('button', { name: 'Next exercise' }).click();
    }

    await expect(page.getByTestId('exercise-counter')).toContainText('Exercise 23 of 24');

    const field = page.getByRole('textbox');
    await field.fill('Ihr seid sp');
    await field.click();
    await page.getByRole('button', { name: 'Insert a umlaut, lowercase' }).click();
    await page.keyboard.type('t.');

    await expect(field).toHaveValue('Ihr seid spät.');
    await page.getByRole('button', { name: 'Check answer' }).click();
    await expect(page.getByTestId('exercise-feedback')).toContainText('Correct');
  });

  test('the whole app can be used with the keyboard only', async ({ page }) => {
    await page.goto('/chapter/0/practice');

    // Tab from the top of the page until the first answer option has focus.
    for (let step = 0; step < 20; step += 1) {
      const onRadio = await page.evaluate(
        () => document.activeElement?.getAttribute('type') === 'radio',
      );
      if (onRadio) break;
      await page.keyboard.press('Tab');
    }
    // Options may be shuffled, so walk the radio group with the arrow keys.
    const correctOption = page.getByRole('radio', { name: 'wir', exact: true });
    await page.keyboard.press('Space');
    for (let step = 0; step < 5 && !(await correctOption.isChecked()); step += 1) {
      await page.keyboard.press('ArrowDown');
    }
    await expect(correctOption).toBeChecked();

    await page.keyboard.press('Enter'); // submits the form
    await expect(page.getByTestId('exercise-feedback')).toContainText('Correct');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter'); // next exercise
    await expect(page.getByTestId('exercise-counter')).toContainText('Exercise 2 of 24');
  });

  test('the catalogue can be filtered', async ({ page }) => {
    await page.goto('/chapters');

    const total = chapterRegistry.length + 1; // registry chapters plus the demo
    const b1Count = chapterRegistry.filter((entry) => entry.level === 'B1').length;

    await expect(page.getByText(`${total} chapters shown.`)).toBeVisible();

    await page.getByRole('button', { name: 'B1', exact: true }).click();
    await expect(page.getByText(`${b1Count} chapters shown.`)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Verbs 3' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Verbs 1' })).toBeHidden();

    await page.getByRole('button', { name: 'Not started', exact: true }).click();
    await expect(page.getByText(`${total} chapters shown.`)).toBeVisible();
  });
});
