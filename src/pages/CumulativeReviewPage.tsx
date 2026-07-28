import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { ProgressBar } from '../components/common/ProgressBar';
import { ExerciseRenderer } from '../components/exercises/ExerciseRenderer';
import { getChapter } from '../content/registry';
import { findExerciseAcrossChapters } from '../features/chapters/chapterUtils';
import { buildCumulativeExerciseIds } from '../features/practice/cumulativeSession';
import {
  selectAnsweredCount,
  selectCurrentExerciseId,
  selectIsLastExercise,
  usePracticeStore,
} from '../features/practice/practiceStore';
import { useProgressStore } from '../features/progress/progressStore';
import { useSettingsStore } from '../features/settings/settingsStore';

export function CumulativeReviewPage() {
  const { from, to } = useParams();
  const navigate = useNavigate();
  const practice = usePracticeStore();
  const exerciseHistory = useProgressStore((state) => state.exerciseHistory);
  const shuffleOptions = useSettingsStore((state) => state.shuffleOptions);
  const showHints = useSettingsStore((state) => state.showHints);
  const showUmlautHelper = useSettingsStore((state) => state.showUmlautHelper);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  const fromNumber = Number(from);
  const toNumber = Number(to);
  const rangeValid =
    Number.isInteger(fromNumber) && Number.isInteger(toNumber) && fromNumber <= toNumber;

  const chapters = useMemo(() => {
    if (!rangeValid) return [];
    const list = [];
    for (let number = fromNumber; number <= toNumber; number += 1) {
      const chapter = getChapter(number);
      if (chapter) list.push(chapter);
    }
    return list;
  }, [rangeValid, fromNumber, toNumber]);

  const complete = rangeValid && chapters.length === toNumber - fromNumber + 1;

  useEffect(() => {
    if (!complete) return;
    const store = usePracticeStore.getState();
    const alreadyRunning =
      store.status === 'active' &&
      store.mode === 'cumulative' &&
      store.chapterNumbers?.length === chapters.length &&
      store.chapterNumbers.every((number, index) => number === chapters[index]?.number);
    if (alreadyRunning) return;

    const exerciseIds = buildCumulativeExerciseIds(chapters, exerciseHistory);
    store.startCumulativeSession(chapters, exerciseIds, { shuffleOptions });
    // exerciseHistory is intentionally read once when the session starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete, chapters, shuffleOptions]);

  if (!complete) {
    return (
      <div className="stack">
        <h1>Cumulative review unavailable</h1>
        <p className="text-muted">
          This review needs chapters {from}–{to}, and not all of them have content yet.
        </p>
        <Link className="button button--secondary" to="/review">
          Back to the review queue
        </Link>
      </div>
    );
  }

  const restart = () => {
    const exerciseIds = buildCumulativeExerciseIds(chapters, exerciseHistory);
    practice.startCumulativeSession(chapters, exerciseIds, { shuffleOptions });
  };

  if (practice.status === 'finished' && practice.summary) {
    const summary = practice.summary;
    return (
      <div className="stack">
        <h1>
          Cumulative Review · Chapters {fromNumber}–{toNumber}
        </h1>
        <Card title="Session summary" titleLevel={2}>
          <div className="stack">
            <ProgressBar
              label="Weighted score"
              value={summary.scorePercent}
              valueText={`${summary.scorePercent}%`}
            />
            <ul>
              <li>
                Answered: {summary.answeredCount} of {summary.totalExercises}
              </li>
              <li>
                Points: {summary.rawScore} of {summary.maxScore} (1 point for a correct
                first attempt, 0.5 for a correct second attempt)
              </li>
              <li>First-attempt accuracy: {summary.firstAttemptAccuracy}%</li>
              <li>Correct text-input exercises: {summary.correctTextInputs}</li>
            </ul>
          </div>
        </Card>
        <p className="text-muted text-sm">
          This mixes exercises from chapters {fromNumber}–{toNumber}, so it doesn't count
          toward any single chapter's mastery — individual answers still update each
          exercise's own review schedule.
        </p>
        <div className="row">
          <Button onClick={restart}>Review again</Button>
          <Link className="button button--ghost" to="/review">
            Back to the review queue
          </Link>
        </div>
      </div>
    );
  }

  const currentExerciseId = selectCurrentExerciseId(practice);
  const exercise = currentExerciseId
    ? findExerciseAcrossChapters(chapters, currentExerciseId)
    : undefined;

  if (!exercise) {
    return (
      <div className="stack">
        <h1>Preparing the cumulative review…</h1>
        <p className="text-muted">Mixing exercises from chapters {fromNumber}–{toNumber}.</p>
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

  const handleExit = () => {
    practice.exitSession();
    navigate('/review');
  };

  return (
    <div className="stack">
      <header className="stack stack--tight">
        <h1>
          Cumulative Review · Chapters {fromNumber}–{toNumber}
        </h1>
        <ProgressBar
          label={`Exercise ${position} of ${total}`}
          value={answered}
          max={total}
          valueText={`${answered} of ${total} answered`}
        />
        <p className="text-sm text-muted" data-testid="exercise-counter">
          Exercise {position} of {total} · from chapter {exercise.chapterNumber} ·{' '}
          {exercise.type === 'singleChoice' ? 'multiple choice' : 'text input'}
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
        onRetry={() => usePracticeStore.setState({ feedback: null })}
        onReveal={() => practice.revealAnswer(exercise)}
        onNext={practice.goToNext}
        onFinish={() => practice.finishCumulative()}
        onExit={() => setExitDialogOpen(true)}
      />

      <Modal
        open={exitDialogOpen}
        title="Leave this cumulative review?"
        description="Your answers so far are kept for this visit, but the session is not saved across a page reload."
        onClose={() => setExitDialogOpen(false)}
      >
        <div className="row">
          <Button variant="secondary" onClick={() => setExitDialogOpen(false)}>
            Stay in the session
          </Button>
          <Button variant="danger" onClick={handleExit}>
            Leave review
          </Button>
        </div>
      </Modal>
    </div>
  );
}
