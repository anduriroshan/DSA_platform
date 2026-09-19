import { AnimationFrame } from '../../types/algorithm';

/**
 * NeetCode 150 — Group Anagrams
 *
 * Optimal approach: hash map keyed by the sorted-character signature of each
 * string. Every string with the same signature belongs to the same group.
 * O(n · k log k) where k = max string length (O(n·k) with a 26-count key).
 *
 * APPROXIMATED VISUALIZATION: strings are not natively representable on the
 * 'array' AnimationFrame contract (arrayState must be number[]). Strings are
 * hardcoded (ignoring registry input/target, same convention as `lcs`).
 * The "array" being visualized is a parallel `groupId[]` — one slot per
 * input string, -1 until assigned, then the id of the anagram group it joins.
 * This is a reasonable approximation, not a literal hash-table rendering.
 * Flagged as a strong candidate for a dedicated Hash-Table/Bucket visualizer
 * in a future ui-craftsman pass.
 */
const STRINGS = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'];

function sortedKey(s: string): string {
  return s.split('').sort().join('');
}

export function generateGroupAnagrams(): AnimationFrame[] {
  const frames: AnimationFrame[] = [];
  const n = STRINGS.length;
  const groupId = new Array<number>(n).fill(-1);
  const keyToGroup = new Map<string, number>();
  const groupContents: string[][] = [];

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...groupId],
    description: `Starting Group Anagrams: strs=[${STRINGS.map((s) => `"${s}"`).join(', ')}] (-1 = ungrouped)`,
    codeLineHighlight: 0,
  });

  frames.push({
    type: 'highlight',
    indices: [],
    arrayState: [...groupId],
    description: 'Initialize empty hash map: groups = {}',
    codeLineHighlight: 1,
  });

  for (let i = 0; i < n; i++) {
    const s = STRINGS[i];
    const key = sortedKey(s);

    frames.push({
      type: 'compare',
      indices: [i],
      arrayState: [...groupId],
      description: `strs[${i}]="${s}" → sorted signature key = "${key}"`,
      codeLineHighlight: 3,
    });

    let gid: number;
    if (!keyToGroup.has(key)) {
      gid = groupContents.length;
      keyToGroup.set(key, gid);
      groupContents.push([]);
      groupId[i] = gid;
      frames.push({
        type: 'set',
        indices: [i],
        arrayState: [...groupId],
        description: `New signature "${key}" — create group ${gid} and add "${s}"`,
        codeLineHighlight: 5,
      });
    } else {
      gid = keyToGroup.get(key)!;
      groupId[i] = gid;
      frames.push({
        type: 'set',
        indices: [i],
        arrayState: [...groupId],
        description: `Signature "${key}" matches group ${gid} — add "${s}" to that group`,
        codeLineHighlight: 6,
      });
    }
    groupContents[gid].push(s);
  }

  const summary = groupContents.map((g) => `[${g.join(', ')}]`).join('  ');
  frames.push({
    type: 'complete',
    indices: Array.from({ length: n }, (_, i) => i),
    arrayState: [...groupId],
    description: `Grouping complete — ${groupContents.length} groups: ${summary}`,
    codeLineHighlight: 7,
  });

  return frames;
}
