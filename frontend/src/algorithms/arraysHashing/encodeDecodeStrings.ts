import { AnimationFrame } from '../../types/algorithm';

/**
 * NeetCode 150 — Encode and Decode Strings
 *
 * Optimal approach: length-prefix framing. Encode each string as
 * "<length>#<string>" and concatenate. Decoding reads the digits up to the
 * next '#', uses that as the exact byte count to slice out the next string
 * (safe even if the string itself contains '#' or arbitrary characters).
 * O(total length) for both encode and decode.
 *
 * APPROXIMATED VISUALIZATION: a list of strings and a single delimited
 * string don't fit the number[] `arrayState` contract. Strings are
 * hardcoded (ignoring registry input/target, same convention as `lcs`).
 * `arrayState` holds the (unchanging) per-string lengths as a numeric
 * anchor; `indices` highlight which string is being processed; the actual
 * encode/decode mechanics are narrated in `description`. Flagged as a
 * candidate for a dedicated Hash-Table/serialization-style visualizer.
 */
const STRINGS = ['neet', 'code', 'love', 'you'];

function encode(strs: string[]): string {
  return strs.map((s) => `${s.length}#${s}`).join('');
}

function decode(s: string): string[] {
  const result: string[] = [];
  let i = 0;
  while (i < s.length) {
    let j = i;
    while (s[j] !== '#') j++;
    const length = parseInt(s.slice(i, j), 10);
    result.push(s.slice(j + 1, j + 1 + length));
    i = j + 1 + length;
  }
  return result;
}

export function generateEncodeDecodeStrings(): AnimationFrame[] {
  const frames: AnimationFrame[] = [];
  const lengths = STRINGS.map((s) => s.length);

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...lengths],
    description: `Starting Encode: strs=[${STRINGS.map((s) => `"${s}"`).join(', ')}]`,
    codeLineHighlight: 0,
  });

  let running = '';
  for (let i = 0; i < STRINGS.length; i++) {
    const s = STRINGS[i];
    running += `${s.length}#${s}`;
    frames.push({
      type: 'set',
      indices: [i],
      arrayState: [...lengths],
      description: `Encode strs[${i}]="${s}": append "${s.length}#${s}" → result so far = "${running}"`,
      codeLineHighlight: 3,
    });
  }

  const encoded = encode(STRINGS);
  frames.push({
    type: 'highlight',
    indices: Array.from({ length: STRINGS.length }, (_, i) => i),
    arrayState: [...lengths],
    description: `Encoded string = "${encoded}"`,
    codeLineHighlight: 4,
  });

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...lengths],
    description: `Starting Decode on "${encoded}"`,
    codeLineHighlight: 5,
  });

  let i = 0;
  let k = 0;
  while (i < encoded.length) {
    let j = i;
    while (encoded[j] !== '#') j++;
    const length = parseInt(encoded.slice(i, j), 10);
    const extracted = encoded.slice(j + 1, j + 1 + length);
    frames.push({
      type: 'found',
      indices: [k],
      arrayState: [...lengths],
      description: `Read length prefix "${length}" before '#' at position ${j}, then take the next ${length} chars → "${extracted}" (decoded[${k}])`,
      codeLineHighlight: 13,
    });
    i = j + 1 + length;
    k++;
  }

  const decoded = decode(encoded);
  frames.push({
    type: 'complete',
    indices: Array.from({ length: STRINGS.length }, (_, i) => i),
    arrayState: [...lengths],
    description: `Decoded back to original list: [${decoded.map((s) => `"${s}"`).join(', ')}] — round-trip successful`,
    codeLineHighlight: 15,
  });

  return frames;
}
