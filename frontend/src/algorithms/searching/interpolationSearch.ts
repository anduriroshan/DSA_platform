import { AnimationFrame } from '../../types/algorithm';

export function generateInterpolationSearch(input: number[], target: number = 0): AnimationFrame[] {
  const arr = [...input].sort((a, b) => a - b);
  const frames: AnimationFrame[] = [];
  const n = arr.length;

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...arr],
    description: `Starting Interpolation Search for target=${target} (assumes sorted, uniformly distributed values)`,
    codeLineHighlight: 0,
  });

  let low = 0;
  let high = n - 1;

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low === high) {
      frames.push({
        type: 'compare',
        indices: [low],
        arrayState: [...arr],
        description: `Single-element window: check arr[${low}]=${arr[low]}`,
        codeLineHighlight: 4,
      });
      if (arr[low] === target) {
        frames.push({
          type: 'found',
          indices: [low],
          arrayState: [...arr],
          description: `Found ${target} at index ${low}!`,
          codeLineHighlight: 5,
        });
        return frames;
      }
      break;
    }

    // Interpolation formula: estimate position by linear interpolation
    const pos = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));

    frames.push({
      type: 'search',
      indices: Array.from({ length: high - low + 1 }, (_, i) => low + i),
      arrayState: [...arr],
      description: `Window [${low}..${high}], probe pos = ${low} + ((${target}-${arr[low]}) × (${high}-${low})) / (${arr[high]}-${arr[low]}) = ${pos}`,
      codeLineHighlight: 3,
    });

    frames.push({
      type: 'compare',
      indices: [pos],
      arrayState: [...arr],
      description: `Compare arr[${pos}]=${arr[pos]} with target=${target}`,
      codeLineHighlight: 4,
    });

    if (arr[pos] === target) {
      frames.push({
        type: 'found',
        indices: [pos],
        arrayState: [...arr],
        description: `Found ${target} at index ${pos}!`,
        codeLineHighlight: 5,
      });
      return frames;
    } else if (arr[pos] < target) {
      frames.push({
        type: 'highlight',
        indices: [pos],
        arrayState: [...arr],
        description: `${arr[pos]} < ${target}, narrow window to [${pos + 1}..${high}]`,
        codeLineHighlight: 7,
      });
      low = pos + 1;
    } else {
      frames.push({
        type: 'highlight',
        indices: [pos],
        arrayState: [...arr],
        description: `${arr[pos]} > ${target}, narrow window to [${low}..${pos - 1}]`,
        codeLineHighlight: 9,
      });
      high = pos - 1;
    }
  }

  frames.push({
    type: 'not-found',
    indices: [],
    arrayState: [...arr],
    description: `${target} not found in the array`,
    codeLineHighlight: 11,
  });

  return frames;
}
