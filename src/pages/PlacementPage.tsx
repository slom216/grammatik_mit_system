import { useMemo } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { PracticeExercise } from '../components/practice/PracticeExercise';
import {
  EXERCISE_TYPE_LABELS,
  chapterPath,
  findExerciseAcrossChapters,
  formatChapterNumber,
} from '../features/chapters/chapterUtils';
import { getRegistryEntry } from '../content/registry';
import type { PlacementRouteResult } from '../features/practice/placementRoute';
import {
  buildPlacementExerciseIds,
  scorePlacement,
} from '../features/practice/placement';
import {
  selectAnsweredCount,
  selectCurrentExerciseId,
  selectIsLastExercise,
  usePracticeStore,
} from '../features/practice/practiceStore';
import { useSettingsStore } from '../features/settings/settingsStore';

/** Reads inside a sentence, so it spells out "Chapter" rather than just "05". */
function chapterLabel(chapterNumber: number): string {
  const entry = getRegistryEntry(chapterNumber);
  const name = `Chapter ${formatChapterNumber(chapterNumber)}`;
  return entry ? `${name} · ${entry.title}` : name;
}

export function PlacementPage() {
  const { chapters, complete } = useLoaderData() as PlacementRouteResult;
  const practice = usePracticeStore();
  const shuffleOptions = useSettingsStore((state) => state.shuffleOptions);

  const isPlacement = practice.mode === 'placement';

  const result = useMemo(() => {
    if (practice.status !== 'finished' || !isPlacement) return null;
    return scorePlacement(chapters, practice.exerciseIds, practice.results);
  }, [practice.status, practice.exerciseIds, practice.results, chapters, isPlacement]);

  const start = () => {
    const exerciseIds = buildPlacementExerciseIds(chapters);
    usePracticeStore.getState().startCumulativeSession(chapters, exerciseIds, {
      shuffleOptions,
      mode: 'placement',
    });
  };

  if (!complete) {
    return (
      <div className="stack">
        <h1>Placement test unavailable</h1>
        <p className="text-muted">
          Some of the chapters this test samples could not be loaded. Check your
          connection and try again.
        </p>
        <Link className="button button--secondary" to="/chapters">
          Back to the catalogue
        </Link>
      </div>
    );
  }

  if (result) {
    return (
      <div className="stack">
        <h1>Placement test</h1>
        <Card title="Where to start" titleLevel={2}>
          <div className="stack">
            <p className="lead">
              {result.clearedEverything
                ? 'You answered every section well. Start wherever you like — the last section is the hardest material in the course.'
                : `Start with ${chapterLabel(result.recommendedChapter)}.`}
            </p>
            <p className="text-sm text-muted">
              This is the first section where the answers stopped holding up, so it is
              where the course has something to teach you. Nothing above it is locked —
              you can start anywhere.
            </p>
            <p>
              <Link
                className="button button--primary"
                to={chapterPath(result.recommendedChapter)}
              >
                Go to Chapter {formatChapterNumber(result.recommendedChapter)}
              </Link>
            </p>
          </div>
        </Card>

        <Card title="How each section went" titleLevel={2}>
          <div className="grammar-table__wrapper">
            <table className="grammar-table">
              <caption className="visually-hidden">
                Placement test results by chapter
              </caption>
              <thead>
                <tr>
                  <th scope="col">Chapter</th>
                  <th scope="col">Level</th>
                  <th scope="col">Correct</th>
                  <th scope="col">Result</th>
                </tr>
              </thead>
              <tbody>
                {result.probes.map((probe) => (
                  <tr key={probe.chapterNumber}>
                    <th scope="row">
                      <Link to={chapterPath(probe.chapterNumber)}>
                        {chapterLabel(probe.chapterNumber)}
                      </Link>
                    </th>
                    <td>{getRegistryEntry(probe.chapterNumber)?.level ?? '—'}</td>
                    <td>
                      {probe.correct} of {probe.answered}
                    </td>
                    <td>{probe.passed ? 'Solid' : 'Worth studying'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="text-sm text-muted">
          Placement answers are not recorded in your progress, so nothing here counts
          against chapters you have not studied yet.
        </p>
      </div>
    );
  }

  if (practice.status !== 'active' || !isPlacement) {
    return (
      <div className="stack">
        <h1>Placement test</h1>
        <Card title="Find your starting point" titleLevel={2}>
          <div className="stack">
            <p className="prose">
              The course runs to 85 chapters from A1 to B1. This short test samples{' '}
              {chapters.length} of them, {buildPlacementExerciseIds(chapters).length}{' '}
              exercises in total, and suggests where to begin.
            </p>
            <p className="text-sm text-muted">
              Answer what you can and guess at the rest — the point is to find where your
              German runs out. Your answers are <strong>not</strong> saved to your
              progress, so a wrong answer here will not put anything in your review queue.
            </p>
            <p>
              <Button onClick={start}>Start the test</Button>
            </p>
          </div>
        </Card>
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
        <h1>Placement test</h1>
        <p className="text-muted">Preparing the questions…</p>
      </div>
    );
  }

  const total = practice.exerciseIds.length;
  const position = practice.currentIndex + 1;
  const answered = selectAnsweredCount(practice);

  return (
    <div className="stack">
      <header className="stack stack--tight">
        <h1>Placement test</h1>
        <ProgressBar
          label={`Question ${position} of ${total}`}
          value={answered}
          max={total}
          valueText={`${answered} of ${total} answered`}
        />
        <p
          className="text-sm text-muted"
          data-testid="exercise-counter"
          aria-live="polite"
        >
          Question {position} of {total} · {EXERCISE_TYPE_LABELS[exercise.type]}
        </p>
      </header>

      <PracticeExercise
        exercise={exercise}
        isLast={selectIsLastExercise(practice)}
        onFinish={() => practice.finishCumulative()}
        onExit={() => practice.exitSession()}
      />
    </div>
  );
}
