import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ChapterUnavailable } from '../components/common/ChapterUnavailable';
import { Modal } from '../components/common/Modal';
import { ProgressBar } from '../components/common/ProgressBar';
import { ExerciseRenderer } from '../components/exercises/ExerciseRenderer';
import {
  EXERCISE_TYPE_LABELS,
  chapterPath,
  findExercise,
} from '../features/chapters/chapterUtils';
import { useChapterParam } from '../features/chapters/useChapterParam';
import {
  selectAnsweredCount,
  selectCurrentExerciseId,
  selectIsLastExercise,
  usePracticeStore,
} from '../features/practice/practiceStore';
import { isDue } from '../features/practice/reviewScheduler';
import { useProgressStore } from '../features/progress/progressStore';
import { useSettingsStore } from '../features/settings/settingsStore';

export function PracticePage() {
  const { chapterNumber, chapter, registryEntry } = useChapterParam();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const practice = usePracticeStore();
  const exerciseHistory = useProgressStore((state) => state.exerciseHistory);
  const shuffleOptions = useSettingsStore((state) => state.shuffleOptions);
  const showHints = useSettingsStore((state) => state.showHints);
  const showUmlautHelper = useSettingsStore((state) => state.showUmlautHelper);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  const reviewMode = searchParams.get('mode') === 'review';

  const dueExerciseIds = useMemo(() => {
    if (!chapter) return [];
    const now = new Date();
    return Object.values(exerciseHistory)
      .filter(
        (history) => history.chapterNumber === chapter.number && isDue(history, now),
      )
      .map((history) => history.exerciseId);
  }, [chapter, exerciseHistory]);

  useEffect(() => {
    if (!chapter) return;
    const store = usePracticeStore.getState();
    const alreadyRunning =
      store.status === 'active' && store.chapterNumber === chapter.number;
    if (alreadyRunning) return;

    if (!reviewMode && store.resumeSession(chapter)) return;

    store.startSession(chapter, {
      shuffleOptions,
      ...(reviewMode
        ? { mode: 'review' as const, exerciseIds: dueExerciseIds }
        : { mode: 'chapter' as const }),
    });
    // dueExerciseIds is intentionally read once when the session starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter, reviewMode, shuffleOptions]);

  if (!chapter) {
    return (
      <ChapterUnavailable chapterNumber={chapterNumber} title={registryEntry?.title} />
    );
  }

  if (reviewMode && dueExerciseIds.length === 0 && practice.exerciseIds.length === 0) {
    return (
      <div className="stack">
        <h1>Nothing to review</h1>
        <p>This chapter has no exercises waiting for review.</p>
        <Button onClick={() => navigate('/review')}>Back to the review queue</Button>
      </div>
    );
  }

  const currentExerciseId = selectCurrentExerciseId(practice);
  const exercise = currentExerciseId
    ? findExercise(chapter, currentExerciseId)
    : undefined;

  if (!exercise) {
    return (
      <div className="stack">
        <h1>Preparing practice…</h1>
        <p className="text-muted">Loading the exercises for this chapter.</p>
      </div>
    );
  }

  const total = practice.exerciseIds.length;
  const position = practice.currentIndex + 1;
  const answered = selectAnsweredCount(practice);
  const resolved = practice.results[exercise.id] !== undefined;
  const isLast = selectIsLastExercise(practice);
  const feedback =
    practice.feedback && practice.feedback.exerciseId === exercise.id
      ? practice.feedback
      : null;

  const handleFinish = () => {
    practice.finish(chapter);
    navigate(chapterPath(chapter.number, 'results'));
  };

  const handleExit = () => {
    // The session stays in storage so it can be resumed from the chapter page.
    practice.pauseSession();
    navigate(chapterPath(chapter.number));
  };

  return (
    <div className="stack">
      <header className="stack stack--tight">
        <h1>
          Practice · {chapter.title}
          {reviewMode && ' (review)'}
        </h1>
        <ProgressBar
          label={`Exercise ${position} of ${total}`}
          value={answered}
          max={total}
          valueText={`${answered} of ${total} answered`}
        />
        <p className="text-sm text-muted" data-testid="exercise-counter">
          Exercise {position} of {total} · {EXERCISE_TYPE_LABELS[exercise.type]}
        </p>
      </header>

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
        resolved={resolved}
        isLast={isLast}
        showHints={showHints}
        showUmlautHelper={showUmlautHelper}
        onSubmitChoice={(optionId) => {
          if (exercise.type === 'singleChoice') {
            practice.submitSingleChoice(exercise, optionId);
          }
        }}
        onSubmitText={(value) => {
          if (exercise.type === 'textInput') {
            practice.submitTextAnswer(exercise, value);
          }
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
          if (exercise.type === 'matching') {
            practice.submitMatching(exercise, matches);
          }
        }}
        onSubmitErrorSpotting={(tokenIndex) => {
          if (exercise.type === 'errorSpotting') {
            practice.submitErrorSpotting(exercise, tokenIndex);
          }
        }}
        onRetry={() => usePracticeStore.setState({ feedback: null })}
        onReveal={() => practice.revealAnswer(exercise)}
        onNext={practice.goToNext}
        onFinish={handleFinish}
        onExit={() => setExitDialogOpen(true)}
      />

      <Modal
        open={exitDialogOpen}
        title="Leave this practice session?"
        description="Your answers so far are kept, but the session will not be scored until you finish it."
        onClose={() => setExitDialogOpen(false)}
      >
        <div className="row">
          <Button variant="secondary" onClick={() => setExitDialogOpen(false)}>
            Stay in the session
          </Button>
          <Button variant="danger" onClick={handleExit}>
            Leave practice
          </Button>
        </div>
      </Modal>
    </div>
  );
}
