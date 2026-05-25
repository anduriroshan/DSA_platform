import { DPTableAnimationFrame } from '../../types/algorithm';

/**
 * Longest Common Subsequence (LCS) — classic 2D bottom-up DP.
 *
 * Recurrence:
 *   dp[i][j] = 0                                if i == 0 or j == 0
 *   dp[i][j] = dp[i-1][j-1] + 1                 if A[i-1] == B[j-1]
 *   dp[i][j] = max(dp[i-1][j], dp[i][j-1])      otherwise
 *
 * Rows correspond to characters of string B (left axis).
 * Cols correspond to characters of string A (top axis).
 * dp has dimensions (|B|+1) × (|A|+1) so that index 0 = empty-prefix base case.
 *
 * The visualizer expects `colHeaders` / `rowHeaders` to be the labels for the
 * data cells AFTER the base row/col, so we pass the actual characters.
 *
 * `input` is unused (we hard-code two short strings whose LCS is well-known).
 */
const STRING_A = 'AGCAT';   // length 5 — columns
const STRING_B = 'GAC';     // length 3 — rows
// LCS = "AC" (length 2)

export function generateLCS(_input?: number[]): DPTableAnimationFrame[] {
  const A = STRING_A;
  const B = STRING_B;
  const m = B.length;
  const n = A.length;
  const frames: DPTableAnimationFrame[] = [];

  // Initialize (m+1) x (n+1) table with nulls — base row/col will be filled
  // explicitly so the user sees them appear.
  const table: (number | string | null)[][] = Array.from({ length: m + 1 }, () =>
    Array.from({ length: n + 1 }, () => null as number | string | null),
  );

  // Row headers: '∅' for the empty-prefix base row, then characters of B
  const rowHeaders: (string | number)[] = ['∅', ...B.split('')];
  const colHeaders: (string | number)[] = ['∅', ...A.split('')];

  function snap(t: (number | string | null)[][]): (number | string | null)[][] {
    return t.map(row => [...row]);
  }

  frames.push({
    type: 'highlight',
    table: snap(table),
    rowHeaders,
    colHeaders,
    rowAxisLabel: 'B',
    colAxisLabel: 'A',
    description: `Starting LCS DP for A="${A}" and B="${B}" — table is (|B|+1)×(|A|+1)`,
    codeLineHighlight: 0,
  });

  // Fill base row: dp[0][j] = 0
  for (let j = 0; j <= n; j++) {
    table[0][j] = 0;
  }
  frames.push({
    type: 'compute-cell',
    table: snap(table),
    computeCell: [0, 0],
    rowHeaders,
    colHeaders,
    rowAxisLabel: 'B',
    colAxisLabel: 'A',
    description: 'Base case: row 0 (empty prefix of B) — all cells = 0',
    codeLineHighlight: 1,
  });

  // Fill base column: dp[i][0] = 0
  for (let i = 0; i <= m; i++) {
    table[i][0] = 0;
  }
  frames.push({
    type: 'compute-cell',
    table: snap(table),
    computeCell: [0, 0],
    rowHeaders,
    colHeaders,
    rowAxisLabel: 'B',
    colAxisLabel: 'A',
    description: 'Base case: column 0 (empty prefix of A) — all cells = 0',
    codeLineHighlight: 2,
  });

  // Main fill
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const bChar = B[i - 1];
      const aChar = A[j - 1];

      if (bChar === aChar) {
        frames.push({
          type: 'read-cell',
          table: snap(table),
          readCells: [[i - 1, j - 1]],
          computeCell: [i, j],
          rowHeaders,
          colHeaders,
          rowAxisLabel: 'B',
          colAxisLabel: 'A',
          description: `Match: B[${i - 1}]='${bChar}' == A[${j - 1}]='${aChar}' — read diagonal dp[${i - 1}][${j - 1}]=${table[i - 1][j - 1]}`,
          codeLineHighlight: 5,
        });
        table[i][j] = (table[i - 1][j - 1] as number) + 1;
        frames.push({
          type: 'compute-cell',
          table: snap(table),
          computeCell: [i, j],
          readCells: [[i - 1, j - 1]],
          rowHeaders,
          colHeaders,
          rowAxisLabel: 'B',
          colAxisLabel: 'A',
          description: `Write dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${table[i][j]}`,
          codeLineHighlight: 6,
        });
      } else {
        frames.push({
          type: 'read-cell',
          table: snap(table),
          readCells: [
            [i - 1, j],
            [i, j - 1],
          ],
          computeCell: [i, j],
          rowHeaders,
          colHeaders,
          rowAxisLabel: 'B',
          colAxisLabel: 'A',
          description: `Mismatch: B[${i - 1}]='${bChar}' ≠ A[${j - 1}]='${aChar}' — read up dp[${i - 1}][${j}]=${table[i - 1][j]} and left dp[${i}][${j - 1}]=${table[i][j - 1]}`,
          codeLineHighlight: 7,
        });
        table[i][j] = Math.max(table[i - 1][j] as number, table[i][j - 1] as number);
        frames.push({
          type: 'compute-cell',
          table: snap(table),
          computeCell: [i, j],
          readCells: [
            [i - 1, j],
            [i, j - 1],
          ],
          rowHeaders,
          colHeaders,
          rowAxisLabel: 'B',
          colAxisLabel: 'A',
          description: `Write dp[${i}][${j}] = max(${table[i - 1][j]}, ${table[i][j - 1]}) = ${table[i][j]}`,
          codeLineHighlight: 8,
        });
      }
    }
  }

  const lcsLength = table[m][n] as number;
  frames.push({
    type: 'final-answer',
    table: snap(table),
    computeCell: [m, n],
    rowHeaders,
    colHeaders,
    rowAxisLabel: 'B',
    colAxisLabel: 'A',
    description: `LCS length = dp[${m}][${n}] = ${lcsLength}. Now traceback to recover the subsequence.`,
    codeLineHighlight: 9,
  });

  // ── Traceback ──
  const tracePath: [number, number][] = [];
  let i = m;
  let j = n;
  const lcsChars: string[] = [];
  while (i > 0 && j > 0) {
    tracePath.push([i, j]);
    if (B[i - 1] === A[j - 1]) {
      lcsChars.push(B[i - 1]);
      frames.push({
        type: 'trace-back',
        table: snap(table),
        tracePath: [...tracePath],
        computeCell: [m, n],
        rowHeaders,
        colHeaders,
        rowAxisLabel: 'B',
        colAxisLabel: 'A',
        description: `Traceback at (${i},${j}): match '${B[i - 1]}' — add to LCS, move diagonally to (${i - 1},${j - 1})`,
        codeLineHighlight: 10,
      });
      i--;
      j--;
    } else if ((table[i - 1][j] as number) >= (table[i][j - 1] as number)) {
      frames.push({
        type: 'trace-back',
        table: snap(table),
        tracePath: [...tracePath],
        computeCell: [m, n],
        rowHeaders,
        colHeaders,
        rowAxisLabel: 'B',
        colAxisLabel: 'A',
        description: `Traceback at (${i},${j}): mismatch — dp[${i - 1}][${j}]=${table[i - 1][j]} ≥ dp[${i}][${j - 1}]=${table[i][j - 1]}, move up`,
        codeLineHighlight: 11,
      });
      i--;
    } else {
      frames.push({
        type: 'trace-back',
        table: snap(table),
        tracePath: [...tracePath],
        computeCell: [m, n],
        rowHeaders,
        colHeaders,
        rowAxisLabel: 'B',
        colAxisLabel: 'A',
        description: `Traceback at (${i},${j}): mismatch — dp[${i}][${j - 1}]=${table[i][j - 1]} > dp[${i - 1}][${j}]=${table[i - 1][j]}, move left`,
        codeLineHighlight: 12,
      });
      j--;
    }
  }

  const lcsString = lcsChars.reverse().join('');
  frames.push({
    type: 'complete',
    table: snap(table),
    tracePath: [...tracePath],
    computeCell: [m, n],
    rowHeaders,
    colHeaders,
    rowAxisLabel: 'B',
    colAxisLabel: 'A',
    description: `LCS complete. Length ${lcsLength}, subsequence = "${lcsString}"`,
    codeLineHighlight: 13,
  });

  return frames;
}
