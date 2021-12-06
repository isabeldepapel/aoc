import * as assert from 'assert';
import { readFileSync } from 'fs';

function getInput(path: string) {
  return readFileSync(path, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .map((x) => parseInt(x, 10));
}

function countIncreasing(nums: number[]): number {
  let count = 0;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] >= nums[i - 1]) {
      count += 1;
    }
  }
  return count;
}

function countIncreasingSums(nums: number[]): number {
  let count = 0;
  let s1 = 0;
  let s2 = 0;
  for (let i = 0; i < nums.length - 3; i++) {
    // const tmp = nums.slice(i, i + 3);
    // console.log(tmp);
    s1 = nums.slice(i, i + 3).reduce((x, y) => x + y);
    s2 = nums.slice(i + 1, i + 4).reduce((x, y) => x + y);
    console.log('s1, s2', s1, s2);
    if (s2 > s1) {
      count += 1;
    }
  }
  console.log('inc sums', count);
  return count;
}

(function solve() {
  assert.equal(countIncreasing(getInput('./testInput.txt')), 7);
  const inc = countIncreasing(getInput('./input.txt'));
  console.log('inc', inc);

  assert.equal(countIncreasingSums(getInput('./testInput.txt')), 5);
  console.log(countIncreasingSums(getInput('./input.txt')));
})();
