import { AnimationFrame } from '../../types/algorithm';

export function generateRadixSort(input: number[]): AnimationFrame[] {
  const arr = [...input];
  const frames: AnimationFrame[] = [];
  const n = arr.length;

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...arr],
    description: 'Starting Radix Sort — LSD (Least Significant Digit) variant using counting sort per digit',
    codeLineHighlight: 0,
  });

  if (n === 0) {
    frames.push({
      type: 'complete',
      indices: [],
      arrayState: [...arr],
      description: 'Empty array — nothing to sort',
      codeLineHighlight: 9,
    });
    return frames;
  }

  const max = Math.max(...arr);
  const numDigits = max === 0 ? 1 : Math.floor(Math.log10(max)) + 1;

  frames.push({
    type: 'highlight',
    indices: Array.from({ length: n }, (_, i) => i),
    arrayState: [...arr],
    description: `Largest value is ${max} with ${numDigits} digit(s) — need ${numDigits} pass(es)`,
    codeLineHighlight: 1,
  });

  function countingSortByDigit(exp: number, digitName: string) {
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);

    frames.push({
      type: 'highlight',
      indices: Array.from({ length: n }, (_, i) => i),
      arrayState: [...arr],
      description: `Pass for ${digitName} digit (exp=${exp})`,
      codeLineHighlight: 3,
    });

    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
      frames.push({
        type: 'compare',
        indices: [i],
        arrayState: [...arr],
        description: `arr[${i}]=${arr[i]} → ${digitName} digit is ${digit}, count[${digit}]=${count[digit]}`,
        codeLineHighlight: 4,
      });
    }

    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    frames.push({
      type: 'highlight',
      indices: [],
      arrayState: [...arr],
      description: `Cumulative counts for ${digitName} digit: [${count.join(', ')}]`,
      codeLineHighlight: 5,
    });

    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      const pos = count[digit] - 1;
      output[pos] = arr[i];
      count[digit]--;
      frames.push({
        type: 'set',
        indices: [pos],
        values: [arr[i]],
        arrayState: [...output],
        description: `Place ${arr[i]} at output[${pos}] (stable on ${digitName} digit ${digit})`,
        codeLineHighlight: 6,
      });
    }

    for (let i = 0; i < n; i++) arr[i] = output[i];

    frames.push({
      type: 'highlight',
      indices: Array.from({ length: n }, (_, i) => i),
      arrayState: [...arr],
      description: `After ${digitName}-digit pass: [${arr.join(', ')}]`,
      codeLineHighlight: 7,
    });
  }

  const digitNames = ['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands'];
  let exp = 1;
  let passIdx = 0;
  while (Math.floor(max / exp) > 0) {
    const name = digitNames[passIdx] || `10^${passIdx}`;
    countingSortByDigit(exp, name);
    exp *= 10;
    passIdx++;
  }

  frames.push({
    type: 'complete',
    indices: Array.from({ length: n }, (_, i) => i),
    arrayState: [...arr],
    description: 'Radix Sort complete — sorted in O(d·(n+k)) where d = number of digits',
    codeLineHighlight: 8,
  });

  return frames;
}
