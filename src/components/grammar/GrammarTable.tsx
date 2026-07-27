import type { GrammarTableDefinition } from '../../schemas/chapterSchema';

export interface GrammarTableProps {
  table: GrammarTableDefinition;
}

export function GrammarTable({ table }: GrammarTableProps) {
  return (
    <div className="grammar-table__wrapper">
      <table className="grammar-table">
        <caption>{table.title}</caption>
        <thead>
          <tr>
            {table.columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
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
                  <td key={`${table.id}-${rowIndex}-${cellIndex}`}>{cell}</td>
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
