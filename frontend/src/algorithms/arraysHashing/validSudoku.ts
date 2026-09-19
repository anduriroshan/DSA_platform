import { DPTableAnimationFrame } from '../../types/algorithm';

/**
 * NeetCode 150 — Valid Sudoku
 *
 * Optimal approach: a single pass over all 81 cells, tracking three sets of
 * "seen digits" per row, per column, and per 3x3 box. A digit is invalid the
 * moment it repeats within any of its row/column/box. O(1) time (81 cells is
 * a constant), O(1) space (9+9+9 sets of at most 9 digits each).
 *
 * Reuses the dp-table visualizer/frame contract: the 9x9 board is the
 * `table`, and `computeCell`/`readCells` highlight which cell is being
 * checked. This is the classic LeetCode invalid example — two 8's collide
 * inside box 0 — so the short-circuit return happens quickly and clearly
 * demonstrates *why* the board is invalid.
 *
 * The board is hardcoded (ignoring registry input/target), same convention
 * as `lcs`.
 */
const BOARD: string[][] = [
  ['8', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
];

function snap(t: string[][]): (number | string | null)[][] {
  return t.map((row) => [...row]);
}

function boxIndex(r: number, c: number): number {
  return Math.floor(r / 3) * 3 + Math.floor(c / 3);
}

export function generateValidSudoku(): DPTableAnimationFrame[] {
  const frames: DPTableAnimationFrame[] = [];
  const colHeaders = Array.from({ length: 9 }, (_, i) => i);
  const rowHeaders = Array.from({ length: 9 }, (_, i) => i);
  const base = {
    table: snap(BOARD),
    colHeaders,
    rowHeaders,
    colAxisLabel: 'COL',
    rowAxisLabel: 'ROW',
  };

  frames.push({
    ...base,
    type: 'highlight',
    description: 'Starting Valid Sudoku — scanning all 81 cells, tracking seen digits per row/col/box',
    codeLineHighlight: 0,
  });

  // rows[r] / cols[c] / boxes[b] map digit -> [r, c] of first occurrence (for description text)
  const rows: Map<string, [number, number]>[] = Array.from({ length: 9 }, () => new Map());
  const cols: Map<string, [number, number]>[] = Array.from({ length: 9 }, () => new Map());
  const boxes: Map<string, [number, number]>[] = Array.from({ length: 9 }, () => new Map());

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = BOARD[r][c];
      if (val === '.') continue;

      const b = boxIndex(r, c);
      frames.push({
        ...base,
        type: 'read-cell',
        readCells: [[r, c]],
        computeCell: [r, c],
        description: `Checking '${val}' at (row ${r}, col ${c}) — box ${b}`,
        codeLineHighlight: 10,
      });

      const rowHit = rows[r].get(val);
      const colHit = cols[c].get(val);
      const boxHit = boxes[b].get(val);

      if (rowHit || colHit || boxHit) {
        const [hr, hc] = boxHit ?? rowHit ?? colHit!;
        const where = boxHit ? `box ${b}` : rowHit ? `row ${r}` : `col ${c}`;
        frames.push({
          ...base,
          type: 'highlight',
          readCells: [[r, c], [hr, hc]],
          computeCell: [r, c],
          description: `Conflict! '${val}' at (${r},${c}) already appears in ${where} — first seen at (${hr},${hc}). Sudoku is INVALID.`,
          codeLineHighlight: 11,
        });
        frames.push({
          ...base,
          type: 'complete',
          readCells: [[r, c], [hr, hc]],
          computeCell: [r, c],
          description: `Result: False — duplicate '${val}' detected in ${where}`,
          codeLineHighlight: 11,
        });
        return frames;
      }

      rows[r].set(val, [r, c]);
      cols[c].set(val, [r, c]);
      boxes[b].set(val, [r, c]);
      frames.push({
        ...base,
        type: 'compute-cell',
        computeCell: [r, c],
        description: `No conflict — record '${val}' in row ${r}, col ${c}, box ${b}`,
        codeLineHighlight: 12,
      });
    }
  }

  frames.push({
    ...base,
    type: 'complete',
    description: 'All 81 cells checked, no conflicts in any row, column, or box → Sudoku is VALID',
    codeLineHighlight: 15,
  });

  return frames;
}
