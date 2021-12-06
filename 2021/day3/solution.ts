import { readFileSync } from 'fs';
import * as assert from 'assert';

function getInput(fPath: string): number[][] {
  return readFileSync(fPath, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .map((x) =>
      x
        .trim()
        .split('')
        .map((y) => parseInt(y)),
    );
}

function getCommonBits(input: number[][], common = 'most'): number[] {
  const most = input
    .reduce((prevArr, currArr) => {
      return prevArr.map((num, idx) => num + currArr[idx]);
    })
    .map((x) => (x >= input.length / 2 ? 1 : 0));
  if (common === 'most') {
    return most;
  }
  return most.map((x) => (x ? 0 : 1));
}

function getPowerConsumption(mostCommon: number[]): number {
  const leastCommon = mostCommon.map((x) => (x ? 0 : 1));
  return parseInt(mostCommon.join(''), 2) * parseInt(leastCommon.join(''), 2);
}

function getRating(input: number[][], common = 'most') {
  let filtered = input;
  let idx = 0;
  do {
    const commonBits = getCommonBits(filtered, common);
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    filtered = filtered.filter((x) => x[idx] === commonBits[idx]);
    idx += 1;
  } while (filtered.length > 1);
  return parseInt(filtered[0].join(''), 2);
}

(function solve() {
  assert.equal(
    getPowerConsumption(getCommonBits(getInput('./testInput.txt'))),
    198,
  );

  console.log(getPowerConsumption(getCommonBits(getInput('./input.txt'))));

  const testInput = getInput('./testInput.txt');
  assert.equal(
    getRating(testInput, 'most') * getRating(testInput, 'least'),
    230,
  );

  const input = getInput('./input.txt');
  console.log(getRating(input, 'most') * getRating(input, 'least'));
})();
