import { expect, test, type Page } from '@playwright/test';
import { chapter001 } from '../src/content/chapters/chapter-001-personal-pronouns';
import { chapterRegistry } from '../src/content/registry';

const exercises = [...chapter001.exercises].sort((a, b) => a.order - b.order);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function correctAnswerFor(exercise: (typeof exercises)[number]): string {
  if (exercise.type === 'singleChoice') {
    return (
      exercise.options.find((option) => option.id === exercise.correctOptionId)?.text ??
      ''
    );
  }
  if (exercise.type === 'textInput') {
    return exercise.acceptedAnswers[0] ?? '';
  }
  throw new Error(`Unsupported exercise type for correctAnswerFor: ${exercise.type}`);
}

/**
 * Answers the exercise currently on screen correctly and submits it, using the
 * interaction pattern for whichever of the 6 exercise types is showing. Move
 * buttons / click-click selection are used throughout instead of simulating
 * native drag-and-drop, matching the keyboard-accessible fallback path each
 * component provides.
 */
async function answerCurrentExercise(page: Page, index: number) {
  const exercise = exercises[index];
  if (!exercise) throw new Error(`No exercise at index ${index}`);

  await expect(page.getByTestId('exercise-counter')).toContainText(
    `Exercise ${index + 1} of ${exercises.length}`,
  );

  switch (exercise.type) {
    case 'singleChoice': {
      // Selecting an option checks it immediately, with no separate submit step.
      await page
        .getByRole('radio', { name: correctAnswerFor(exercise), exact: true })
        .check();
      break;
    }
    case 'textInput': {
      await page.getByRole('textbox').fill(correctAnswerFor(exercise));
      await page.getByRole('button', { name: 'Check answer' }).click();
      break;
    }
    case 'errorSpotting': {
      await page.locator('.error-spotting__token').nth(exercise.errorTokenIndex).click();
      if (/\s/.test(exercise.correction)) break; // Auto-submits, like singleChoice.
      await page.getByLabel('Replace it with').fill(exercise.correction);
      await page.getByRole('button', { name: 'Check answer' }).click();
      break;
    }
    case 'sentenceOrdering': {
      // The terminal punctuation is shown after the row rather than on the last
      // segment, so it is not part of any segment's label.
      const correctTexts = exercise.segments.map((segment, index) =>
        index === exercise.segments.length - 1
          ? segment.text.replace(/[.!?]$/, '')
          : segment.text,
      );
      for (let target = 0; target < correctTexts.length; target += 1) {
        const text = correctTexts[target] ?? '';
        const moveEarlier = page.getByRole('button', {
          name: `Move "${text}" earlier in the sentence`,
        });
        // Re-read the current position each time: earlier clicks shift indices.
        while (true) {
          const currentTexts = await page
            .locator('.sentence-ordering__text')
            .allTextContents();
          const currentIndex = currentTexts.indexOf(text);
          if (currentIndex <= target) break;
          await moveEarlier.click();
        }
      }
      await page.getByRole('button', { name: 'Check answer' }).click();
      break;
    }
    case 'dragToSlots': {
      const usedWordIndices = new Set<number>();
      for (let slotIndex = 0; slotIndex < exercise.slots.length; slotIndex += 1) {
        const slot = exercise.slots[slotIndex];
        if (!slot) continue;
        const wordIndex = exercise.wordBank.findIndex(
          (word, i) => word === slot.correctWord && !usedWordIndices.has(i),
        );
        if (wordIndex === -1) {
          throw new Error(`No unused word bank entry for slot "${slot.id}"`);
        }
        usedWordIndices.add(wordIndex);
        const exactWord = new RegExp(`^${escapeRegExp(slot.correctWord)}$`);
        await page
          .locator('.drag-slots__word:not(.drag-slots__word--used)', {
            hasText: exactWord,
          })
          .first()
          .click();
        // Selecting a word fills the slot straight away when only one is left,
        // in which case clicking the slot would clear it again.
        const slotButton = page.locator('.drag-slots__slot').nth(slotIndex);
        const label = await slotButton.getAttribute('aria-label');
        if (label?.startsWith('Empty slot')) await slotButton.click();
      }
      await page.getByRole('button', { name: 'Check answer' }).click();
      break;
    }
    case 'matching': {
      for (let pairIndex = 0; pairIndex < exercise.pairs.length; pairIndex += 1) {
        const pair = exercise.pairs[pairIndex];
        if (!pair) continue;
        await page
          .locator('.matching__column')
          .first()
          .locator('.matching__item')
          .nth(pairIndex)
          .click();
        await page
          .locator('.matching__column')
          .nth(1)
          // The button's accessible name is its aria-label ("<right> — not
          // matched"), not its text, so this anchors on the label's prefix
          // rather than matching the bare text.
          .getByRole('button', { name: new RegExp(`^${escapeRegExp(pair.right)} — `) })
          .click();
      }
      await page.getByRole('button', { name: 'Check answer' }).click();
      break;
    }
  }

  await expect(page.getByTestId('exercise-feedback')).toContainText('Correct');
}

test.describe('lesson flow', () => {
  test(`a learner can read a lesson, complete all ${exercises.length} exercises and master the chapter`, async ({
    page,
  }) => {
    // Answering a whole chapter in one walk-through does not fit the default
    // 30s budget once entrance animations are counted in.
    test.slow();

    await page.goto('/');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Dashboard' }),
    ).toBeVisible();

    await page.getByRole('link', { name: 'Chapters', exact: true }).click();
    await expect(
      page.getByRole('heading', { level: 1, name: 'Chapter catalogue' }),
    ).toBeVisible();

    await page
      .getByRole('link', { name: new RegExp(chapter001.title) })
      .first()
      .click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(chapter001.title);

    await page.getByRole('link', { name: 'Read the lesson' }).click();
    await expect(page.getByRole('table', { name: /Subject pronouns/i })).toBeVisible();
    await expect(page.getByRole('complementary', { name: 'Remember' })).toBeVisible();

    // The full pool, not the 24-exercise quick session: this walk answers every
    // exercise in the chapter.
    await page.getByRole('link', { name: /Full practice/ }).click();

    for (let index = 0; index < exercises.length; index += 1) {
      await answerCurrentExercise(page, index);
      if (index < exercises.length - 1) {
        await page.getByRole('button', { name: 'Next exercise' }).click();
      }
    }

    await page.getByRole('button', { name: 'Finish and see results' }).click();

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Results');
    await expect(
      page.getByText(`Answered: ${exercises.length} of ${exercises.length}`),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Chapter mastered' }),
    ).toBeVisible();

    // Progress survives a reload. Scoped to the chapter table by its caption:
    // the topic breakdown on the same page also reports accuracy percentages,
    // and links back to this chapter by name.
    const chapterScores = page
      .getByRole('table', { name: 'Chapter progress' })
      .getByRole('cell', { name: '100%' });
    await page.goto('/progress');
    await expect(chapterScores).toBeVisible();
    await page.reload();
    await expect(chapterScores).toBeVisible();
  });

  test('a failed exercise can be retried and lands in the review queue', async ({
    page,
  }) => {
    await page.goto('/chapter/1/practice');

    const wrongOption = exercises[0];
    if (!wrongOption || wrongOption.type !== 'singleChoice') {
      throw new Error('The first exercise is expected to be a single-choice exercise');
    }
    const distractor = wrongOption.options.find(
      (option) => option.id !== wrongOption.correctOptionId,
    );

    await page.getByRole('radio', { name: distractor?.text ?? '', exact: true }).check();

    const feedback = page.getByTestId('exercise-feedback');
    await expect(feedback).toContainText('Not correct yet');
    await expect(feedback).toContainText('You have one more attempt.');

    await page.getByRole('button', { name: 'Try again' }).click();
    await answerCurrentExercise(page, 0);

    // Leave practice before touching storage. While the practice page is up it
    // holds progress in memory and the study timer keeps writing it out, so an
    // edit made underneath it is overwritten by the next flush. On a page with
    // no session running, storage is the only copy.
    await page.goto('/chapters');

    // The exercise is queued for a later day; move its due date into the past
    // so the review screen can be checked without waiting.
    await page.evaluate(() => {
      const key = 'grammatik-mit-system:progress';
      const raw = window.localStorage.getItem(key);
      if (!raw) throw new Error('progress was not persisted');
      const progress = JSON.parse(raw) as {
        exerciseHistory: Record<string, { dueAt?: string }>;
      };
      const history = progress.exerciseHistory['ch01-ex-01'];
      if (!history?.dueAt) throw new Error('the exercise did not enter the review queue');
      history.dueAt = new Date(Date.now() - 60_000).toISOString();
      window.localStorage.setItem(key, JSON.stringify(progress));
    });

    await page.goto('/review');
    await expect(page.getByText(/1 exercise due across 1 chapter/)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Review now' })).toBeVisible();
  });

  test('a session survives a refresh in the middle of practice', async ({ page }) => {
    await page.goto('/chapter/1/practice');

    await answerCurrentExercise(page, 0);
    await page.getByRole('button', { name: 'Next exercise' }).click();
    await answerCurrentExercise(page, 1);
    await page.getByRole('button', { name: 'Next exercise' }).click();

    await page.reload();

    await expect(page.getByTestId('exercise-counter')).toContainText(
      `Exercise 3 of ${exercises.length}`,
    );
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
  });

  test('a text-input exercise can be answered with umlauts from the helper', async ({
    page,
  }) => {
    await page.goto('/chapter/1/practice');

    // Exercise 23 asks for "Ihr seid spät."
    for (let index = 0; index < 22; index += 1) {
      await answerCurrentExercise(page, index);
      await page.getByRole('button', { name: 'Next exercise' }).click();
    }

    await expect(page.getByTestId('exercise-counter')).toContainText(
      `Exercise 23 of ${exercises.length}`,
    );

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
    await page.goto('/chapter/1/practice');
    // The page and its chapter arrive as separate chunks, so wait for the
    // exercise before sending keystrokes at it.
    await expect(page.getByTestId('exercise-counter')).toBeVisible();

    // Tab from the top of the page until the first answer option has focus.
    for (let step = 0; step < 20; step += 1) {
      const onRadio = await page.evaluate(
        () => document.activeElement?.getAttribute('type') === 'radio',
      );
      if (onRadio) break;
      await page.keyboard.press('Tab');
    }
    // Options may be shuffled, so walk the radio group with the arrow keys.
    // The answer is checked automatically a moment after the selection
    // settles, so no separate submit action is needed.
    const correctOption = page.getByRole('radio', { name: 'wir', exact: true });
    for (let step = 0; step < 5 && !(await correctOption.isChecked()); step += 1) {
      await page.keyboard.press('ArrowDown');
    }
    await expect(correctOption).toBeChecked();
    await expect(page.getByTestId('exercise-feedback')).toContainText('Correct');

    // Focus moves straight to "Next exercise", no extra Tab needed.
    await expect(page.getByRole('button', { name: 'Next exercise' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('exercise-counter')).toContainText(
      `Exercise 2 of ${exercises.length}`,
    );
  });

  test('the catalogue can be filtered', async ({ page }) => {
    await page.goto('/chapters');

    const total = chapterRegistry.length;
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
