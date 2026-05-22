import { AnimationFrame } from '../../types/algorithm';

export function generateLinearSearch(input: number[], target: number = 0): AnimationFrame[] {
  const arr = [...input];
  const frames: AnimationFrame[] = [];

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...arr],
    description: `Starting Linear Search for target = ${target}`,
    codeLineHighlight: 0,
  });

  for (let i = 0; i < arr.length; i++) {
    frames.push({
      type: 'search',
      indices: [i],
      arrayState: [...arr],
      description: `Check arr[${i}] = ${arr[i]}`,
      codeLineHighlight: 2,
    });

    frames.push({
      type: 'compare',
      indices: [i],
      arrayState: [...arr],
      description: `Is ${arr[i]} == ${target}? ${arr[i] === target ? 'YES!' : 'No'}`,
      codeLineHighlight: 3,
    });

    if (arr[i] === target) {
      frames.push({
        type: 'found',
        indices: [i],
        arrayState: [...arr],
        description: `Found ${target} at index ${i}!`,
        codeLineHighlight: 4,
      });
      return frames;
    }
  }

  frames.push({
    type: 'not-found',
    indices: [],
    arrayState: [...arr],
    description: `${target} not found in the array`,
    codeLineHighlight: 5,
  });

  return frames;
}
