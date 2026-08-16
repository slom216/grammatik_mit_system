import { useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { LoadingBlock } from '../components/common/LoadingBlock';
import { Modal } from '../components/common/Modal';
import { ProgressBar } from '../components/common/ProgressBar';
import { PracticeExercise } from '../components/practice/PracticeExercise';
import { SessionSummary } from '../components/practice/SessionSummary';
import { StudyTimer } from '../components/progress/StudyTimer';
import {
  EXERCISE_TYPE_LABELS,
  findExerciseAcrossChapters,
} from '../features/chapters/chapterUtils';
import type { CumulativeRouteResult } from '../features/practice/cumulativeRoute';
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
  const {
    from: fromNumber,
    to: toNumber,
    chapters,
    complete,
  } = useLoaderData() as CumulativeRouteResult;
  const navigate = useNavigate();
  const practice = usePracticeStore();
  const exerciseHistory = useProgressStore((state) => state.exerciseHistory);
  const shuffleOptions = useSettingsStore((state) => state.shuffleOptions);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  // `chapters` comes from the route loader, so its identity is stable for the
  // whole navigation — adding revalidation to this route would restart the
  // session mid-review.
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
          This review needs chapters {fromNumber}–{toNumber}, and not all of them have
          content yet.
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
          <SessionSummary summary={summary} />
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
      <div className="stack practice">
        <h1>Preparing the cumulative review…</h1>
        <p className="text-muted">
          Mixing exercises from chapters {fromNumber}–{toNumber}.
        </p>
        <LoadingBlock label="Mixing the exercises" withTitle={false} />
      </div>
    );
  }

  const total = practice.exerciseIds.length;
  const position = practice.currentIndex + 1;
  const answered = selectAnsweredCount(practice);
  const isLast = selectIsLastExercise(practice);

  const handleFinish = () => {
    practice.finishCumulative();
  };

  const handleExit = () => {
    practice.exitSession();
    navigate('/review');
  };

  return (
    <div className="stack">
      <header className="stack stack--tight">
        <div className="row practice__header-row">
          <h1>
            Cumulative Review · Chapters {fromNumber}–{toNumber}
          </h1>
          <StudyTimer chapterNumber={null} />
        </div>
        <ProgressBar
          label={`Exercise ${position} of ${total}`}
          value={answered}
          max={total}
          valueText={`${answered} of ${total} answered`}
        />
        <p
          className="text-sm text-muted"
          data-testid="exercise-counter"
          aria-live="polite"
        >
          Exercise {position} of {total} · from chapter {exercise.chapterNumber} ·{' '}
          {EXERCISE_TYPE_LABELS[exercise.type]}
        </p>
      </header>

      <PracticeExercise
        exercise={exercise}
        isLast={isLast}
        onFinish={handleFinish}
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
