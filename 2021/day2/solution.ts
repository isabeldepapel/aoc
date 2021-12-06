import * as assert from 'assert';
import { readFileSync } from 'fs';

// type Position = [number, number];
type PositionWithDepth = [number, number, number];

function getInput(fPath: string): PositionWithDepth[] {
  return readFileSync(fPath, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .map((x) => x.trim().split(' '))
    .map((dir) => {
      const num = parseInt(dir[1]);
      switch (dir[0]) {
        case 'forward':
          return [num, 0, num];
        case 'up':
          return [0, -num, 0];
        case 'down':
          return [0, num, 0];
        default:
          return [0, 0, 0];
      }
    });
}

function reducer(
  prev: PositionWithDepth,
  curr: PositionWithDepth,
): PositionWithDepth {
  const [x1, y1, z1] = prev;
  const [x2, y2, z2] = curr;
  return [x1 + x2, y1 + y2, z1 + z2 * (y2 + y1)];
}

(function solve() {
  assert.equal(
    getInput('./testInput.txt')
      .reduce(reducer, [0, 0, 1])
      .slice(0, 2)
      .reduce((x, y) => x * y),
    150,
  );

  console.log(
    'final',
    getInput('./input.txt')
      .reduce(reducer, [0, 0, 1])
      .slice(0, 2)
      .reduce((x, y) => x * y),
  );

  const [a, , c] = getInput('./testInput.txt').reduce(reducer, [0, 0, 0]);
  assert.equal(a * c, 900);
  const [x, , z] = getInput('./input.txt').reduce(reducer, [0, 0, 0]);
  console.log('final', x * z);
})();
