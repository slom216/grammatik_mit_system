import { useMemo, useState } from 'react';
import { ChapterProgressCard } from '../components/progress/ChapterProgressCard';
import {
  CHAPTER_FILTERS,
  CHAPTER_FILTER_LABELS,
  groupBySection,
  matchesFilter,
  selectChapterCards,
  type ChapterFilter,
} from '../features/chapters/chapterSelectors';
import { useProgressStore } from '../features/progress/progressStore';

export function ChaptersPage() {
  const progress = useProgressStore();
  const [filter, setFilter] = useState<ChapterFilter>('all');
  const [query, setQuery] = useState('');

  const cards = useMemo(() => selectChapterCards(progress), [progress]);
  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return groupBySection(
      cards.filter(
        (card) =>
          matchesFilter(card, filter) &&
          (needle === '' ||
            card.title.toLowerCase().includes(needle) ||
            card.level.toLowerCase() === needle ||
            String(card.number) === needle),
      ),
    );
  }, [cards, filter, query]);
  const visibleCount = groups.reduce((sum, group) => sum + group.chapters.length, 0);

  return (
    <div className="stack">
      <header>
        <h1>Chapter catalogue</h1>
        <p className="text-muted prose">
          All 85 chapters of the course, grouped by section. Chapters without content are
          listed so the outline stays visible while the course is being written.
        </p>
      </header>

      <div className="search-field">
        <label htmlFor="chapter-search">Search chapters</label>
        <input
          id="chapter-search"
          type="search"
          className="text-answer__field"
          placeholder="Konjunktiv, dative, 42…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="filter-bar" role="group" aria-label="Filter chapters">
        {CHAPTER_FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            className="filter-bar__button"
            aria-pressed={filter === option}
            onClick={() => setFilter(option)}
          >
            {CHAPTER_FILTER_LABELS[option]}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="text-sm text-muted">
        {visibleCount} {visibleCount === 1 ? 'chapter' : 'chapters'} shown.
      </p>

      {groups.map((group) => (
        <section key={group.section.id} aria-labelledby={`section-${group.section.id}`}>
          <h2 id={`section-${group.section.id}`}>{group.section.title}</h2>
          <p className="text-muted">{group.section.description}</p>
          <div className="grid">
            {group.chapters.map((chapter) => (
              <ChapterProgressCard key={chapter.number} chapter={chapter} />
            ))}
          </div>
        </section>
      ))}

      {visibleCount === 0 && (
        <p>No chapters match {query.trim() === '' ? 'this filter' : `“${query.trim()}”`}.</p>
      )}
    </div>
  );
}
