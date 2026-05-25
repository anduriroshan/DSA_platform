import { DPTableAnimationFrame } from '../../types/algorithm';

/**
 * Bottom-up DP Fibonacci.
 *
 * We model it as a 1-row table of length n+1, where dp[i] = F(i).
 * Recurrence: dp[i] = dp[i-1] + dp[i-2], with base cases dp[0]=0, dp[1]=1.
 *
 * `input` is interpreted as: the FIRST element is the n to compute (clamped
 * sensibly so the table fits on screen). If absent we default to n=8.
 */
export function generateFibonacciDP(input: number[]): DPTableAnimationFrame[] {
  const requested = input && input.length > 0 ? input[0] : 8;
  const n = Math.max(2, Math.min(12, Math.floor(requested))); // keep 2..12 for visualization

  const frames: DPTableAnimationFrame[] = [];
  const table: (number | null)[][] = [Array.from({ length: n + 1 }, () => null)];
  const colHeaders = Array.from({ length: n + 1 }, (_, i) => i);

  function snap(t: (number | null)[][]): (number | null)[][] {
    return t.map(row => [...row]);
  }

  frames.push({
    type: 'highlight',
    table: snap(table),
    colHeaders,
    colAxisLabel: 'i',
    description: `Starting Fibonacci DP — compute F(${n}) by filling dp[0..${n}] where dp[i] = dp[i-1] + dp[i-2]`,
    codeLineHighlight: 0,
  });

  // Base case dp[0] = 0
  table[0][0] = 0;
  frames.push({
    type: 'compute-cell',
    table: snap(table),
    computeCell: [0, 0],
    colHeaders,
    colAxisLabel: 'i',
    description: 'Base case: dp[0] = 0',
    codeLineHighlight: 1,
  });

  // Base case dp[1] = 1
  if (n >= 1) {
    table[0][1] = 1;
    frames.push({
      type: 'compute-cell',
      table: snap(table),
      computeCell: [0, 1],
      colHeaders,
      colAxisLabel: 'i',
      description: 'Base case: dp[1] = 1',
      codeLineHighlight: 2,
    });
  }

  // Fill dp[2..n]
  for (let i = 2; i <= n; i++) {
    // Read dp[i-1] and dp[i-2]
    frames.push({
      type: 'read-cell',
      table: snap(table),
      readCells: [
        [0, i - 1],
        [0, i - 2],
      ],
      colHeaders,
      colAxisLabel: 'i',
      description: `Read dp[${i - 1}]=${table[0][i - 1]} and dp[${i - 2}]=${table[0][i - 2]} to compute dp[${i}]`,
      codeLineHighlight: 4,
    });

    const val = (table[0][i - 1] as number) + (table[0][i - 2] as number);
    table[0][i] = val;
    frames.push({
      type: 'compute-cell',
      table: snap(table),
      computeCell: [0, i],
      readCells: [
        [0, i - 1],
        [0, i - 2],
      ],
      colHeaders,
      colAxisLabel: 'i',
      description: `Write dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${table[0][i - 1]} + ${table[0][i - 2]} = ${val}`,
      codeLineHighlight: 5,
    });
  }

  frames.push({
    type: 'final-answer',
    table: snap(table),
    computeCell: [0, n],
    colHeaders,
    colAxisLabel: 'i',
    description: `F(${n}) = dp[${n}] = ${table[0][n]}`,
    codeLineHighlight: 6,
  });

  frames.push({
    type: 'complete',
    table: snap(table),
    colHeaders,
    colAxisLabel: 'i',
    description: `Fibonacci DP complete. F(${n}) = ${table[0][n]}. Total cells filled: ${n + 1}.`,
    codeLineHighlight: 7,
  });

  return frames;
}
