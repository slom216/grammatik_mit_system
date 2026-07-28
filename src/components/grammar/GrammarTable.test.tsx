import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GrammarTable } from './GrammarTable';
import type { GrammarTableDefinition } from '../../schemas/chapterSchema';

const table: GrammarTableDefinition = {
  id: 'test-table',
  title: 'Dative prepositions',
  columns: ['Preposition', 'Case', 'English'],
  rows: [
    ['mit', 'dem/der', 'with'],
    ['bei', 'dem/der', 'at/near'],
  ],
  columnCases: [null, 'dative', null],
};

describe('GrammarTable', () => {
  it('renders the table title and rows', () => {
    render(<GrammarTable table={table} />);
    expect(screen.getByText('Dative prepositions')).toBeInTheDocument();
    expect(screen.getByText('mit')).toBeInTheDocument();
  });

  it('renders a text case badge next to the tagged column, not color alone', () => {
    render(<GrammarTable table={table} />);
    expect(screen.getByText('Dative')).toBeInTheDocument();
  });

  it('renders a combined badge for two-way columns', () => {
    const twoWay: GrammarTableDefinition = {
      ...table,
      columnCases: [null, 'two-way', null],
    };
    render(<GrammarTable table={twoWay} />);
    expect(screen.getByText('Accusative / Dative')).toBeInTheDocument();
  });

  it('omits a badge for untagged columns', () => {
    const untagged: GrammarTableDefinition = { ...table, columnCases: undefined };
    render(<GrammarTable table={untagged} />);
    expect(screen.queryByText('Dative')).not.toBeInTheDocument();
  });
});
