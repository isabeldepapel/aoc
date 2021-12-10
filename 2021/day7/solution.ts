import { readFileSync } from 'fs';
import * as assert from 'assert';

function parseInput(fpath: string): number[] {
  return readFileSync(fpath, { encoding: 'utf-8' })
    .trim()
    .split(',')
    .map((x) => parseInt(x));
}

function findPosByMedian(crabs: number[]): number {
  // find median
  let median: number;
  const sortedCrabs = crabs.slice(0).sort((a, b) => a - b);

  const numCrabs = sortedCrabs.length;
  if (numCrabs / 2 === 0) {
    median = (sortedCrabs[numCrabs / 2] + sortedCrabs[numCrabs / 2 - 1]) / 2;
  } else {
    median = sortedCrabs[Math.floor(numCrabs / 2)];
  }

  return crabs.reduce((prev, curr) => {
    return prev + Math.abs(curr - median);
  }, 0);
}

function findPosByAvg(crabs: number[]): number {
  const memo = Array(Math.max(...crabs) - Math.min(...crabs)).fill(0);
  for (let i = 1; i < memo.length; i++) {
    memo[i] = memo[i - 1] + i;
  }

  // avg isn't int, so take floor and ceiling and compare
  const avg1 = Math.floor(crabs.reduce((x, y) => x + y) / crabs.length);
  const avg2 = Math.ceil(crabs.reduce((x, y) => x + y) / crabs.length);

  const sum1 = crabs.reduce((prev, curr) => {
    return prev + memo[Math.abs(curr - avg1)];
  }, 0);
  const sum2 = crabs.reduce((prev, curr) => {
    return prev + memo[Math.abs(curr - avg2)];
  }, 0);

  return Math.min(sum1, sum2);
}

(function solve() {
  assert.equal(findPosByMedian(parseInput('./testInput.txt')), 37);
  console.log(findPosByMedian(parseInput('./input.txt')));

  assert.equal(findPosByAvg(parseInput('./testInput.txt')), 168);
  console.log(findPosByAvg(parseInput('./input.txt')));
})();
