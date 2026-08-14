import type { CaseLabel, GrammarTableDefinition } from '../../schemas/chapterSchema';

export interface GrammarTableProps {
  table: GrammarTableDefinition;
}

const CASE_BADGE_LABELS: Record<CaseLabel, string> = {
  nominative: 'Nominative',
  accusative: 'Accusative',
  dative: 'Dative',
  genitive: 'Genitive',
  'two-way': 'Accusative / Dative',
};

function CaseBadge({ caseLabel }: { caseLabel: CaseLabel }) {
  return (
    <span className={`badge badge--case-${caseLabel}`}>{CASE_BADGE_LABELS[caseLabel]}</span>
  );
}

export function GrammarTable({ table }: GrammarTableProps) {
  return (
    <div className="grammar-table__wrapper">
      <table className="grammar-table">
        <caption>{table.title}</caption>
        <thead>
          <tr>
            {table.columns.map((column, index) => {
              const caseLabel = table.columnCases?.[index];
              return (
                <th key={column} scope="col">
                  <span className="grammar-table__header">
                    {column}
                    {caseLabel && <CaseBadge caseLabel={caseLabel} />}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={`${table.id}-row-${rowIndex}`}>
              {row.map((cell, cellIndex) =>
                cellIndex === 0 ? (
                  <th key={`${table.id}-${rowIndex}-${cellIndex}`} scope="row">
                    {cell}
                  </th>
                ) : (
                  // Cells hold German forms; without lang a screen reader reads
                  // them with English pronunciation rules.
                  <td key={`${table.id}-${rowIndex}-${cellIndex}`} lang="de">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {table.note && <p className="text-sm text-muted">{table.note}</p>}
    </div>
  );
}
