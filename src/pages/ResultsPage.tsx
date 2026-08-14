import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ChapterUnavailable } from '../components/common/ChapterUnavailable';
import { SessionSummary } from '../components/practice/SessionSummary';
import { MasteryBadge } from '../components/progress/MasteryBadge';
import { selectNextChapter } from '../features/chapters/chapterSelectors';
import { chapterPath, formatChapterNumber } from '../features/chapters/chapterUtils';
import { useChapterParam } from '../features/chapters/useChapterParam';
import { usePracticeStore } from '../features/practice/practiceStore';
import { countOpenReviewFlags } from '../features/practice/reviewScheduler';
import { evaluateMastery } from '../features/practice/scoring';
import {
  selectChapterProgress,
  useProgressStore,
} from '../features/progress/progressStore';

export function ResultsPage() {
  const { chapterNumber, chapter, registryEntry } = useChapterParam();
  const navigate = useNavigate();
  const summary = usePracticeStore((state) => state.summary);
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
          <SessionSummary summary={summary} openReviewFlags={openFlags} />
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
            startSession(chapter);
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
