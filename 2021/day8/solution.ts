import { readFileSync } from 'fs';
import * as assert from 'assert';

type Line = [string[], string[]];
function parseInput(fpath: string): Line[] {
  return readFileSync(fpath, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .map((x) =>
      x
        .trim()
        .split(' | ')
        .map((y) => y.trim().split(' ')),
    ) as Line[];
}

function countOutput(lines: Line[]): number {
  const uniqueNumSegments = new Set([2, 4, 3, 7]);
  return lines.reduce((prev, curr) => {
    const [, output] = curr;
    return output.filter((x) => uniqueNumSegments.has(x.length)).length + prev;
  }, 0);
}

type Segments = {
  top?: string;
  bottom?: string;
  ul?: string;
  ll?: string;
  mid?: string;
  ur?: string;
  lr?: string;
};

function difference(set1: Set<string>, set2: Set<string>): Set<string> {
  const diff = new Set<string>();
  if (set2.size > set1.size) {
    const temp = set1;
    set1 = set2;
    set2 = temp;
  }

  for (const char of set1.values()) {
    if (!set2.has(char)) {
      diff.add(char);
    }
  }
  return diff;
}

function union(set1: Set<string>, set2: Set<string>): Set<string> {
  const result = new Set<string>();
  for (const char of set1) {
    result.add(char);
  }
  for (const char of set2.values()) {
    result.add(char);
  }
  return result;
}

function unwrap(set: Set<string>): string {
  if (set.size > 1) {
    throw new Error();
  }
  return set.keys().next().value;
}

function decipherSignals(signals: string[]) {
  // Sort signals by length and turn into sets
  const sortedSignals = signals.slice(0).sort((a, b) => a.length - b.length);

  const signalSets = sortedSignals.map((s) => new Set(s));
  const nums = Array(10);
  nums[1] = signalSets[0];
  nums[7] = signalSets[1];
  nums[4] = signalSets[2];
  nums[8] = signalSets[9];

  const zerosixnine = signalSets.slice(6, 9);
  const segments: Segments = {};

  const idx9 = zerosixnine.findIndex((s) => {
    return difference(union(nums[7], nums[4]), s).size === 1;
  });
  nums[9] = zerosixnine[idx9];
  const zerosix = zerosixnine
    .slice(0, idx9)
    .concat(zerosixnine.slice(idx9 + 1));

  const idx0 = zerosix.findIndex((s) => {
    return union(difference(nums[9], s), nums[1]).size === 3;
  });
  nums[0] = zerosix[idx0];
  nums[6] = idx0 === 0 ? zerosix[1] : zerosix[0];

  segments.top = unwrap(difference(nums[1], nums[7]));
  segments.bottom = unwrap(difference(union(nums[7], nums[4]), nums[9]));
  segments.mid = unwrap(difference(nums[8], nums[0]));
  segments.ur = unwrap(difference(nums[8], nums[6]));
  segments.ll = unwrap(difference(nums[9], nums[8]));
  segments.lr = unwrap(difference(nums[1], new Set(segments.ur)));
  segments.ul = unwrap(
    difference(difference(nums[4], nums[1]), new Set(segments.mid)),
  );

  nums[5] = difference(nums[9], new Set(segments.ur));
  nums[3] = difference(nums[9], new Set(segments.ul));
  nums[2] = new Set([
    segments.top,
    segments.mid,
    segments.bottom,
    segments.ur,
    segments.ll,
  ]);

  const decipheredNums: { [key: string]: number } = {};
  for (let i = 0; i < 10; i++) {
    const key = Array.from(nums[i]).sort().join('');
    decipheredNums[key] = i;
  }
  return decipheredNums;
}

function decipherOutput(lines: Line[]): number {
  return lines.reduce((prev, curr) => {
    const [signals, output] = curr;
    const decipheredSignals = decipherSignals(signals);

    const sortedOutput = output.map((s) => s.split('').sort().join(''));
    const outputAsNum = parseInt(
      sortedOutput.map((s) => decipheredSignals[s]).join(''),
    );
    return prev + outputAsNum;
  }, 0);
}

(function solve() {
  assert.equal(countOutput(parseInput('./testInput.txt')), 26);
  console.log(countOutput(parseInput('./input.txt')));

  assert.equal(decipherOutput(parseInput('./testInput.txt')), 61229);
  console.log(decipherOutput(parseInput('./input.txt')));
})();
