import { readFileSync } from 'fs';
import * as assert from 'assert';

function parseInput(fpath: string): number[] {
  return readFileSync(fpath, { encoding: 'utf-8' })
    .trim()
    .split(',')
    .map((x) => parseInt(x));
}

function lanternfish(initialFish: number[], numDays = 18): number {
  const fishLife = 7;
  // index of array is day that new fish is spawned
  const newFishList = Array(numDays).fill(0);

  for (let i = 0; i < initialFish.length; i++) {
    const fish = initialFish[i];

    if (fish === 0) {
      newFishList[0] += 1;
    }
    let idx = fish;
    while (idx < numDays) {
      newFishList[idx] += 1;
      idx += fishLife;
    }
  }

  return newFishList.reduce((acc, curr, idx) => {
    const newFish = newFishList[idx];

    if (newFish > 0) {
      let j = idx + fishLife + 2;
      while (j < newFishList.length) {
        newFishList[j] += 1 * newFish;
        j += fishLife;
      }
    }
    return acc + curr;
  }, initialFish.length);
}

(function solve() {
  assert.equal(lanternfish(parseInput('./testInput.txt'), 18), 26);
  assert.equal(lanternfish(parseInput('./testInput.txt'), 80), 5934);
  console.log(lanternfish(parseInput('./input.txt'), 80));

  assert.equal(lanternfish(parseInput('./testInput.txt'), 256), 26984457539);
  console.log(lanternfish(parseInput('./input.txt'), 256));
})();
