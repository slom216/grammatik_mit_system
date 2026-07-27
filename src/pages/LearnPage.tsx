import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { ChapterUnavailable } from '../components/common/ChapterUnavailable';
import { CommonMistakes } from '../components/grammar/CommonMistakes';
import { ExampleList } from '../components/grammar/ExampleList';
import { GrammarTable } from '../components/grammar/GrammarTable';
import { RememberBox } from '../components/grammar/RememberBox';
import { getRegistryEntry } from '../content/registry';
import { chapterPath, formatChapterNumber } from '../features/chapters/chapterUtils';
import { useChapterParam } from '../features/chapters/useChapterParam';

/**
 * Lesson screen. The order of the blocks follows the specification:
 * header, objective, prerequisites, introduction, rules, tables, examples,
 * common mistakes, remember summary, start practice.
 */
export function LearnPage() {
  const { chapterNumber, chapter, registryEntry } = useChapterParam();

  if (!chapter) {
    return (
      <ChapterUnavailable chapterNumber={chapterNumber} title={registryEntry?.title} />
    );
  }

  const { explanation } = chapter;

  return (
    <article className="stack">
      <header className="stack stack--tight">
        <p className="chapter-card__number">
          <Link to={chapterPath(chapter.number)}>
            Chapter {formatChapterNumber(chapter.number)}
          </Link>
        </p>
        <h1>{chapter.title}</h1>
        <p className="text-muted">{chapter.objective}</p>
        {chapter.prerequisites.length > 0 && (
          <p className="text-sm text-muted">
            Prerequisites:{' '}
            {chapter.prerequisites.map((number, index) => (
              <span key={number}>
                {index > 0 && ', '}
                <Link to={chapterPath(number)}>
                  {formatChapterNumber(number)} ·{' '}
                  {getRegistryEntry(number)?.title ?? 'Chapter'}
                </Link>
              </span>
            ))}
          </p>
        )}
      </header>

      <section className="prose" aria-labelledby="introduction-heading">
        <h2 id="introduction-heading">Introduction</h2>
        {explanation.introduction.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </section>

      <section aria-labelledby="rules-heading" className="stack">
        <h2 id="rules-heading">How it works</h2>
        {explanation.rules.map((rule) => (
          <Card key={rule.id} title={rule.heading}>
            <div className="prose">
              {rule.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              {rule.notes && rule.notes.length > 0 && (
                <ul className="text-sm text-muted">
                  {rule.notes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        ))}
      </section>

      {explanation.tables.length > 0 && (
        <section aria-labelledby="tables-heading" className="stack">
          <h2 id="tables-heading">Tables</h2>
          {explanation.tables.map((table) => (
            <Card key={table.id}>
              <GrammarTable table={table} />
            </Card>
          ))}
        </section>
      )}

      <section aria-labelledby="examples-heading">
        <h2 id="examples-heading">Examples</h2>
        <ExampleList examples={explanation.examples} />
      </section>

      <section aria-labelledby="mistakes-heading">
        <h2 id="mistakes-heading">Common mistakes</h2>
        <CommonMistakes mistakes={explanation.commonMistakes} />
      </section>

      <RememberBox points={explanation.remember} />

      <p className="row">
        <Link
          className="button button--primary"
          to={chapterPath(chapter.number, 'practice')}
        >
          Start practice ({chapter.exercises.length} exercises)
        </Link>
        <Link className="button button--ghost" to={chapterPath(chapter.number)}>
          Back to chapter overview
        </Link>
      </p>
    </article>
  );
}
