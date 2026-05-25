import { useVisualizerStore } from '../../store/useVisualizerStore';
import { DPTableAnimationFrame } from '../../types/algorithm';

/**
 * DPTableVisualizer
 *
 * Renders a 2D DP table. Three visual states per cell:
 *   - compute  → the cell currently being written        (coral / strong)
 *   - read     → cells whose values are being read       (yellow / soft)
 *   - trace    → the traced-back optimal path            (purple)
 *   - final    → cell holding the final answer           (green) when frame.type === 'final-answer'
 *
 * Headers (row/col) are rendered if `rowHeaders` / `colHeaders` are provided.
 * The grid is fully CSS-driven so it remains crisp at any zoom level.
 */
export default function DPTableVisualizer() {
  const { frames, currentStep } = useVisualizerStore();
  const frame = frames[currentStep] as DPTableAnimationFrame;

  if (!frame || !Array.isArray(frame.table)) {
    return (
      <div className="empty-state">
        <div className="icon">▦</div>
        <p>Click Play to start the demo</p>
      </div>
    );
  }

  const { table, computeCell, readCells = [], tracePath = [], colHeaders, rowHeaders } = frame;
  const rows = table.length;
  const cols = rows > 0 ? table[0].length : 0;

  // Build O(1) lookup sets
  const readSet = new Set(readCells.map(([r, c]) => `${r},${c}`));
  const traceSet = new Set(tracePath.map(([r, c]) => `${r},${c}`));
  const computeKey = computeCell ? `${computeCell[0]},${computeCell[1]}` : null;
  const isFinalFrame = frame.type === 'final-answer';

  const cellClass = (r: number, c: number) => {
    const k = `${r},${c}`;
    const classes = ['dp-cell'];
    if (table[r][c] === null || table[r][c] === undefined) classes.push('empty');
    if (traceSet.has(k)) classes.push('trace');
    if (readSet.has(k)) classes.push('read');
    if (computeKey === k) classes.push('compute');
    if (isFinalFrame && computeKey === k) classes.push('final');
    return classes.join(' ');
  };

  const renderCellValue = (v: number | string | null) => {
    if (v === null || v === undefined) return '·';
    return String(v);
  };

  return (
    <div className="viz-hscroll">
      <div className="dp-wrap">
        {(frame.colAxisLabel || frame.rowAxisLabel) && (
          <div className="dp-axis-row">
            {frame.rowAxisLabel && <span className="dp-axis-label">{frame.rowAxisLabel} ↓</span>}
            {frame.colAxisLabel && <span className="dp-axis-label">{frame.colAxisLabel} →</span>}
          </div>
        )}

        <div
          className="dp-grid"
          style={{
            gridTemplateColumns: `${colHeaders ? 'minmax(40px, auto) ' : ''}repeat(${cols}, minmax(40px, 1fr))`,
          }}
        >
          {/* Top-left empty corner + column headers row */}
          {colHeaders && (
            <>
              {rowHeaders && <div className="dp-corner" />}
              {colHeaders.map((h, i) => (
                <div key={`ch-${i}`} className="dp-header dp-col-header">
                  {String(h)}
                </div>
              ))}
            </>
          )}

          {/* Data rows */}
          {table.map((row, r) => (
            <RowFragment
              key={`r-${r}`}
              rowIdx={r}
              row={row}
              rowHeader={rowHeaders?.[r]}
              cellClass={cellClass}
              renderCellValue={renderCellValue}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface RowFragmentProps {
  rowIdx: number;
  row: (number | string | null)[];
  rowHeader?: string | number;
  cellClass: (r: number, c: number) => string;
  renderCellValue: (v: number | string | null) => string;
}

function RowFragment({ rowIdx, row, rowHeader, cellClass, renderCellValue }: RowFragmentProps) {
  return (
    <>
      {rowHeader !== undefined && (
        <div className="dp-header dp-row-header">{String(rowHeader)}</div>
      )}
      {row.map((v, c) => (
        <div key={`${rowIdx}-${c}`} className={cellClass(rowIdx, c)}>
          <span className="dp-cell-value">{renderCellValue(v)}</span>
          <span className="dp-cell-coord">
            {rowIdx},{c}
          </span>
        </div>
      ))}
    </>
  );
}
