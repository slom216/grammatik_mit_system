import { useState } from 'react';
import { ExerciseRenderer } from '../exercises/ExerciseRenderer';
import {
  selectAnswerStreak,
  usePracticeStore,
} from '../../features/practice/practiceStore';
import { useSettingsStore } from '../../features/settings/settingsStore';
import type { Exercise } from '../../schemas/exerciseSchema';

export interface PracticeExerciseProps {
  exercise: Exercise;
  isLast: boolean;
  onFinish: () => void;
  onExit: () => void;
}

/**
 * Connects one exercise to the practice session: display orders, answer
 * submission per type, and the settings that affect practice. Chapter practice
 * and cumulative review differ only in how they finish and exit, so everything
 * else lives here rather than in both pages.
 */
export function PracticeExercise({
  exercise,
  isLast,
  onFinish,
  onExit,
}: PracticeExerciseProps) {
  const practice = usePracticeStore();
  const showHints = useSettingsStore((state) => state.showHints);
  const showUmlautHelper = useSettingsStore((state) => state.showUmlautHelper);
  const autoAdvance = useSettingsStore((state) => state.autoAdvance);

  const feedback =
    practice.feedback && practice.feedback.exerciseId === exercise.id
      ? practice.feedback
      : null;

  // "Try again" deliberately does *not* remount the renderer. A second attempt
  // at a twelve-segment ordering or a filled slot sentence should be a
  // correction, not a rebuild from scratch, so each type's local answer stays
  // put and the learner edits it. The count is still passed down: the renderer
  // uses it to restore focus, and to clear the two types whose answer is a
  // single selection.
  const [retries, setRetries] = useState(0);

  return (
    <ExerciseRenderer
      key={exercise.id}
      exercise={exercise}
      optionOrder={
        practice.optionOrder[exercise.id] ??
        (exercise.type === 'singleChoice'
          ? exercise.options.map((option) => option.id)
          : [])
      }
      segmentOrder={
        practice.segmentOrder[exercise.id] ??
        (exercise.type === 'sentenceOrdering'
          ? exercise.segments.map((segment) => segment.id)
          : [])
      }
      wordBankOrder={
        practice.wordBankOrder[exercise.id] ??
        (exercise.type === 'dragToSlots'
          ? exercise.wordBank.map((_word, index) => index)
          : [])
      }
      matchingRightOrder={
        practice.matchingRightOrder[exercise.id] ??
        (exercise.type === 'matching' ? exercise.pairs.map((pair) => pair.id) : [])
      }
      feedback={feedback}
      resolved={practice.results[exercise.id] !== undefined}
      isLast={isLast}
      showHints={showHints}
      showUmlautHelper={showUmlautHelper}
      autoAdvance={autoAdvance}
      streak={selectAnswerStreak(practice)}
      retryCount={retries}
      onSubmitChoice={(optionId) => {
        if (exercise.type === 'singleChoice') {
          practice.submitSingleChoice(exercise, optionId);
        }
      }}
      onSubmitText={(value) => {
        if (exercise.type === 'textInput') practice.submitTextAnswer(exercise, value);
      }}
      onSubmitOrdering={(orderedIds) => {
        if (exercise.type === 'sentenceOrdering') {
          practice.submitSentenceOrdering(exercise, orderedIds);
        }
      }}
      onSubmitSlots={(placedWords) => {
        if (exercise.type === 'dragToSlots') {
          practice.submitDragToSlots(exercise, placedWords);
        }
      }}
      onSubmitMatching={(matches) => {
        if (exercise.type === 'matching') practice.submitMatching(exercise, matches);
      }}
      onSubmitErrorSpotting={(tokenIndex, correction) => {
        if (exercise.type === 'errorSpotting') {
          practice.submitErrorSpotting(exercise, tokenIndex, correction);
        }
      }}
      onRetry={() => {
        usePracticeStore.setState({ feedback: null });
        setRetries((count) => count + 1);
      }}
      onReveal={() => practice.revealAnswer(exercise)}
      onNext={practice.goToNext}
      onFinish={onFinish}
      onExit={onExit}
    />
  );
}
