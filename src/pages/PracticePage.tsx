import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ChapterUnavailable } from '../components/common/ChapterUnavailable';
import { LoadingBlock } from '../components/common/LoadingBlock';
import { Modal } from '../components/common/Modal';
import { ProgressBar } from '../components/common/ProgressBar';
import { PracticeExercise } from '../components/practice/PracticeExercise';
import { StudyTimer } from '../components/progress/StudyTimer';
import {
  EXERCISE_TYPE_LABELS,
  chapterPath,
  findExercise,
  formatChapterNumber,
  sortedExercises,
} from '../features/chapters/chapterUtils';
import { useChapterParam } from '../features/chapters/useChapterParam';
import {
  selectAnsweredCount,
  selectCurrentExerciseId,
  selectIsLastExercise,
  usePracticeStore,
} from '../features/practice/practiceStore';
import {
  QUICK_SESSION_SIZE,
  buildQuickExerciseIds,
  quickMasteryRule,
} from '../features/practice/quickSession';
import { uncoveredFirst } from '../features/practice/coverage';
import { isDue } from '../features/practice/reviewScheduler';
import {
  selectCoveredExerciseIds,
  useProgressStore,
} from '../features/progress/progressStore';
import { useSettingsStore } from '../features/settings/settingsStore';

export function PracticePage() {
  const { chapterNumber, chapter, registryEntry } = useChapterParam();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const practice = usePracticeStore();
  const exerciseHistory = useProgressStore((state) => state.exerciseHistory);
  const shuffleOptions = useSettingsStore((state) => state.shuffleOptions);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  const reviewMode = searchParams.get('mode') === 'review';
  const quickMode = searchParams.get('mode') === 'quick';

  // Sorted into chapter order: `startSession` now keeps the order it is given,
  // and a review session should still read the way the chapter was written.
  const dueExerciseIds = useMemo(() => {
    if (!chapter) return [];
    const now = new Date();
    const due = new Set(
      Object.values(exerciseHistory)
        .filter(
          (history) => history.chapterNumber === chapter.number && isDue(history, now),
        )
        .map((history) => history.exerciseId),
    );
    return sortedExercises(chapter)
      .map((exercise) => exercise.id)
      .filter((id) => due.has(id));
  }, [chapter, exerciseHistory]);

  const coveredIds = useMemo(
    () => (chapter ? selectCoveredExerciseIds(exerciseHistory, chapter.number) : null),
    [chapter, exerciseHistory],
  );

  const quickExerciseIds = useMemo(
    () =>
      chapter
        ? buildQuickExerciseIds(
            chapter,
            QUICK_SESSION_SIZE,
            Math.random,
            dueExerciseIds,
            coveredIds ?? new Set(),
          )
        : [],
    // dueExerciseIds and coveredIds are read once, when the sample is drawn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chapter, quickMode],
  );

  const quickDueCount = quickMode
    ? quickExerciseIds.filter((id) => dueExerciseIds.includes(id)).length
    : 0;

  useEffect(() => {
    if (!chapter) return;
    const store = usePracticeStore.getState();
    const alreadyRunning =
      store.status === 'active' && store.chapterNumber === chapter.number;
    if (alreadyRunning) return;

    if (!reviewMode && !quickMode && store.resumeSession(chapter)) return;

    store.startSession(chapter, {
      shuffleOptions,
      ...(reviewMode
        ? { mode: 'review' as const, exerciseIds: dueExerciseIds }
        : quickMode
          ? { mode: 'quick' as const, exerciseIds: quickExerciseIds }
          : {
              mode: 'chapter' as const,
              // The whole pool, but leading with what is not covered yet, so
              // starting the chapter again picks up where the last run left off.
              exerciseIds: uncoveredFirst(chapter, coveredIds ?? new Set()),
            }),
    });
    // dueExerciseIds is intentionally read once when the session starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter, reviewMode, quickMode, quickExerciseIds, shuffleOptions]);

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

  // The h1 stays here: AppShell reads document.title from the rendered h1.
  if (!exercise) {
    return (
      <div className="stack practice">
        <h1>Preparing practice…</h1>
        <p className="text-muted">Loading the exercises for this chapter.</p>
        <LoadingBlock label="Loading the exercises" withTitle={false} />
      </div>
    );
  }

  const total = practice.exerciseIds.length;
  const position = practice.currentIndex + 1;
  const answered = selectAnsweredCount(practice);
  const isLast = selectIsLastExercise(practice);

  const handleFinish = () => {
    // A quick session is scored against thresholds scaled to its own size.
    practice.finish(
      quickMode
        ? { ...chapter, mastery: quickMasteryRule(chapter, practice.exerciseIds) }
        : chapter,
    );
    navigate(chapterPath(chapter.number, 'results'));
  };

  const handleExit = () => {
    // The session stays in storage so it can be resumed from the chapter page.
    practice.pauseSession();
    navigate(chapterPath(chapter.number));
  };

  return (
    <div className="stack practice">
      <header className="stack stack--tight">
        <div className="row practice__header-row">
          <span className="eyebrow">
            Chapter {formatChapterNumber(chapter.number)}
            {reviewMode && ' · review'}
            {quickMode && ' · quick session'}
            {quickDueCount > 0 &&
              ` · ${quickDueCount} due ${quickDueCount === 1 ? 'exercise' : 'exercises'} included`}
          </span>
          <StudyTimer chapterNumber={chapter.number} />
        </div>
        <h1>
          Practice · {chapter.title}
          {reviewMode && ' (review)'}
          {quickMode && ' (quick)'}
        </h1>
        <ProgressBar
          label={`Exercise ${position} of ${total}`}
          value={answered}
          max={total}
          valueText={`${answered} of ${total} answered`}
        />
        <p className="practice__meta" data-testid="exercise-counter" aria-live="polite">
          Exercise {position} of {total} · {EXERCISE_TYPE_LABELS[exercise.type]}
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
