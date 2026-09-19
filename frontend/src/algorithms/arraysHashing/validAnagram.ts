import { AnimationFrame } from '../../types/algorithm';

/**
 * NeetCode 150 — Valid Anagram
 *
 * Optimal approach: a single 26-length frequency array. Increment for every
 * character of `s`, decrement for every character of `t`. If `s` and `t` are
 * anagrams, every slot returns to zero.
 *
 * The problem is fundamentally string-shaped, not number-array-shaped, so —
 * following the same convention already used by `lcs` and the graph
 * generators — the two strings are hardcoded here and the registry's
 * `input`/`target` args are ignored. The running 26-slot frequency array
 * IS a genuine number[], so it's visualized directly on the 'array' contract:
 * each cell is a letter's running count, indices highlight which letter slot
 * is being touched.
 */
const S = 'anagram';
const T = 'nagaram';

function letterIndex(ch: string): number {
  return ch.charCodeAt(0) - 'a'.charCodeAt(0);
}

export function generateValidAnagram(): AnimationFrame[] {
  const frames: AnimationFrame[] = [];
  const count = new Array(26).fill(0);

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...count],
    description: `Starting Valid Anagram check: s="${S}", t="${T}"`,
    codeLineHighlight: 0,
  });

  if (S.length !== T.length) {
    frames.push({
      type: 'complete',
      indices: [],
      arrayState: [...count],
      description: `len(s)=${S.length} ≠ len(t)=${T.length} → return False immediately`,
      codeLineHighlight: 2,
    });
    return frames;
  }

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...count],
    description: `len(s)=${S.length} == len(t)=${T.length} — allocate count = 26 zeros (one slot per letter a-z)`,
    codeLineHighlight: 3,
  });

  for (let i = 0; i < S.length; i++) {
    const ch = S[i];
    const idx = letterIndex(ch);
    count[idx]++;
    frames.push({
      type: 'set',
      indices: [idx],
      arrayState: [...count],
      description: `s[${i}]='${ch}' → count[${idx}]++ → count['${ch}']=${count[idx]}`,
      codeLineHighlight: 5,
    });
  }

  for (let i = 0; i < T.length; i++) {
    const ch = T[i];
    const idx = letterIndex(ch);
    count[idx]--;
    frames.push({
      type: 'set',
      indices: [idx],
      arrayState: [...count],
      description: `t[${i}]='${ch}' → count[${idx}]-- → count['${ch}']=${count[idx]}`,
      codeLineHighlight: 7,
    });
  }

  const isAnagram = count.every((c) => c === 0);
  frames.push({
    type: 'complete',
    indices: Array.from({ length: 26 }, (_, i) => i),
    arrayState: [...count],
    description: isAnagram
      ? `All 26 counts returned to zero → "${S}" and "${T}" ARE anagrams (True)`
      : `Some counts are non-zero → "${S}" and "${T}" are NOT anagrams (False)`,
    codeLineHighlight: 8,
  });

  return frames;
}
