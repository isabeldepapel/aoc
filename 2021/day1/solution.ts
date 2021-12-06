import * as assert from 'assert';
import { readFileSync } from 'fs';

function getInput(path: string) {
  return readFileSync(path, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .map((x) => parseInt(x, 10));
}

function countIncreasing(nums: number[], window = 1): number {
  let count = 0;
  for (let i = 0; i < nums.length - window; i++) {
    if (nums[i + window] > nums[i]) {
      count += 1;
    }
  }
  return count;
}

(function solve() {
  assert.equal(countIncreasing(getInput('./testInput.txt')), 7);
  console.log(countIncreasing(getInput('./input.txt')));

  assert.equal(countIncreasing(getInput('./testInput.txt'), 3), 5);
  console.log(countIncreasing(getInput('./input.txt'), 3));
})();
