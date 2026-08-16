import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ChapterUnavailable } from '../components/common/ChapterUnavailable';
import { MissedExercises } from '../components/practice/MissedExercises';
import { SessionSummary } from '../components/practice/SessionSummary';
import { MasteryBadge } from '../components/progress/MasteryBadge';
import { selectNextChapter } from '../features/chapters/chapterSelectors';
import {
  chapterPath,
  findExercise,
  formatChapterNumber,
} from '../features/chapters/chapterUtils';
import { useChapterParam } from '../features/chapters/useChapterParam';
import { uncoveredFirst } from '../features/practice/coverage';
import { usePracticeStore } from '../features/practice/practiceStore';
import { countOpenReviewFlags } from '../features/practice/reviewScheduler';
import { evaluateMastery } from '../features/practice/scoring';
import {
  selectChapterProgress,
  selectCoveredExerciseIds,
  useProgressStore,
} from '../features/progress/progressStore';

export function ResultsPage() {
  const { chapterNumber, chapter, registryEntry } = useChapterParam();
  const navigate = useNavigate();
  const summary = usePracticeStore((state) => state.summary);
  const sessionDurationMs = usePracticeStore((state) => state.sessionDurationMs);
  const startSession = usePracticeStore((state) => state.startSession);
  const progress = useProgressStore();

  if (!chapter) {
    return (
      <ChapterUnavailable chapterNumber={chapterNumber} title={registryEntry?.title} />
    );
  }

  const chapterProgress = selectChapterProgress(progress, chapter.number);
  const openFlags = countOpenReviewFlags(
    Object.values(progress.exerciseHistory),
    chapter.number,
  );
  const evaluation = summary
    ? evaluateMastery(summary, chapter.mastery, openFlags)
    : { mastered: chapterProgress.status === 'mastered', unmetRequirements: [] };

  const nextChapter = selectNextChapter(chapter.number);
  const coveredIds = selectCoveredExerciseIds(progress.exerciseHistory, chapter.number);

  const missed = (summary?.incorrectExerciseIds ?? [])
    .map((id) => findExercise(chapter, id))
    .filter((exercise) => exercise !== undefined);

  return (
    <div className="stack">
      <header className="stack stack--tight">
        <p className="chapter-card__number">
          Chapter {formatChapterNumber(chapter.number)}
        </p>
        <h1>Results · {chapter.title}</h1>
        <p className="row">
          <MasteryBadge
            status={chapterProgress.status}
            bestScorePercent={chapterProgress.bestScorePercent}
          />
        </p>
      </header>

      {summary ? (
        <Card title="This session" titleLevel={2}>
          <SessionSummary
            summary={summary}
            openReviewFlags={openFlags}
            durationMs={sessionDurationMs}
          />
          {/* The figure this session just moved: coverage across every session,
              which is what decides what the next run leads with. */}
          <p className="text-sm text-muted">
            Chapter coverage: {coveredIds.size} of {chapter.exercises.length} exercises
            answered correctly.
          </p>
        </Card>
      ) : (
        <Card title="Latest recorded result" titleLevel={2}>
          <p>
            Best score {chapterProgress.bestScorePercent}% · latest{' '}
            {chapterProgress.latestScorePercent}% · first-attempt accuracy{' '}
            {chapterProgress.firstAttemptAccuracy}%
          </p>
          <p className="text-muted text-sm">
            This summary comes from your saved progress. Start a new session for a
            detailed breakdown.
          </p>
        </Card>
      )}

      {missed.length > 0 && (
        <Card title="What to look at again" titleLevel={2}>
          <MissedExercises exercises={missed} />
        </Card>
      )}

      <Card
        title={evaluation.mastered ? 'Chapter mastered' : 'Not mastered yet'}
        titleLevel={2}
      >
        {evaluation.mastered ? (
          <p>
            You reached the mastery threshold of {chapter.mastery.passingPercent}% for
            this chapter.
          </p>
        ) : (
          <>
            <p>To master this chapter you still need to:</p>
            <ul>
              {evaluation.unmetRequirements.length > 0 ? (
                evaluation.unmetRequirements.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))
              ) : (
                <li>Complete a full practice session.</li>
              )}
            </ul>
          </>
        )}
      </Card>

      <div className="row">
        <Button
          onClick={() => {
            // Same ordering as PracticePage's own start: what is still
            // uncovered leads, so "practise again" is not a replay.
            startSession(chapter, { exerciseIds: uncoveredFirst(chapter, coveredIds) });
            navigate(chapterPath(chapter.number, 'practice'));
          }}
        >
          Practise again
        </Button>
        <Link
          className="button button--secondary"
          to={chapterPath(chapter.number, 'learn')}
        >
          Re-read the lesson
        </Link>
        {nextChapter ? (
          <Link className="button button--ghost" to={chapterPath(nextChapter.number)}>
            Next: {nextChapter.title}
          </Link>
        ) : (
          <Link className="button button--ghost" to="/chapters">
            Back to the catalogue
          </Link>
        )}
      </div>
    </div>
  );
}
