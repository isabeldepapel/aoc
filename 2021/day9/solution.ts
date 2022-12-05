import { readFileSync } from 'fs';
import * as R from 'ramda';
import * as assert from 'assert';

type Position = [number, number];

function parseInput(fpath: string): number[][] {
  return readFileSync(fpath, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .map((x) => x.split('').map((y) => parseInt(y)));
}

function getNeighbors(pos: Position, grid: number[][]): number[] {
  const neighbors = [];
  const numRows = grid.length;
  const numCols = grid[0].length;
  const [row, col] = pos;

  if (row > 0) {
    neighbors.push(grid[row - 1][col]);
  }
  if (row < numRows - 1) {
    neighbors.push(grid[row + 1][col]);
  }
  if (col > 0) {
    neighbors.push(grid[row][col - 1]);
  }
  if (col < numCols - 1) {
    neighbors.push(grid[row][col + 1]);
  }
  return neighbors;
}

function isLowPoint(num: number, neighbors: number[]): boolean {
  return R.all((x: number) => num < x)(neighbors);
}

function findLowPoints(grid: number[][]): Position[] {
  const lowPoints: Position[] = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const neighbors = getNeighbors([row, col], grid);
      if (isLowPoint(grid[row][col], neighbors)) {
        lowPoints.push([row, col]);
      }
    }
  }
  return lowPoints;
}

(function solve() {
  // console.log(findLowPoints(parseInput('./testInput.txt')));
  const testGrid = parseInput('./testInput.txt');
  assert.equal(
    findLowPoints(testGrid).reduce((prev, curr) => {
      const [row, col] = curr;
      return prev + testGrid[row][col] + 1;
    }, 0),
    15,
  );
  const grid = parseInput('./input.txt');
  console.log(
    findLowPoints(grid).reduce((prev, curr) => {
      const [row, col] = curr;
      return prev + grid[row][col] + 1;
    }, 0),
  );
})();
