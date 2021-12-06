import { readFileSync } from 'fs';
import * as assert from 'assert';

type Line = [[number, number], [number, number]];
type Board = number[][];
type LineFilter = (line: Line) => boolean;

function parseInput(fpath: string): Line[] {
  return readFileSync(fpath, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .map((x) =>
      x.split(' -> ').map((y) => y.split(',').map((z) => parseInt(z))),
    ) as Line[];
}

function filterFn(line: Line): boolean {
  const [[x1, y1], [x2, y2]] = line;
  return x1 === x2 || y1 === y2;
}

function newFilterFn(line: Line): boolean {
  const [[x1, y1], [x2, y2]] = line;
  return filterFn(line) || Math.abs(x2 - x1) === Math.abs(y2 - y1);
}

function generateBoard(lines: Line[]): Board {
  let maxX = 0;
  let maxY = 0;

  for (const line of lines) {
    const [[x1, y1], [x2, y2]] = line;
    maxX = Math.max(x1, x2, maxX); // x is cols
    maxY = Math.max(y1, y2, maxY); // y is row
  }

  return new Array(maxY + 1).fill(0).map(() => new Array(maxX + 1).fill(0));
}

function transformBoard(board: Board, lines: Line[], filter: LineFilter) {
  lines = lines.filter(filter);
  for (const line of lines) {
    // x = cols, y = rows
    const [[x1, y1], [x2, y2]] = line;
    // We check for horiz or vert line below so we can ignore cases
    // where slope = 0
    const xslope = x2 > x1 ? 1 : -1;
    const yslope = y2 > y1 ? 1 : -1;

    // vertical or horizontal
    if (x1 === x2) {
      for (let i = y1; i !== y2; i += yslope) {
        board[i][x1] += 1;
      }
      board[y2][x1] += 1;
    } else if (y1 === y2) {
      for (let i = x1; i !== x2; i += xslope) {
        board[y1][i] += 1;
      }
      board[y1][x2] += 1;
      // diagonal lines
    } else {
      for (let i = y1, j = x1; i !== y2; i += yslope, j += xslope) {
        board[i][j] += 1;
      }
      board[y2][x2] += 1;
    }
  }
  return board;
}

(function solve() {
  const testLines = parseInput('./testInput.txt');
  assert.equal(
    transformBoard(generateBoard(testLines), testLines, filterFn)
      .flat()
      .filter((x) => x >= 2).length,
    5,
  );

  const lines = parseInput('./input.txt');
  console.log(
    transformBoard(generateBoard(lines), lines, filterFn)
      .flat()
      .filter((x) => x >= 2).length,
  );

  assert.equal(
    transformBoard(generateBoard(testLines), testLines, newFilterFn)
      .flat()
      .filter((x) => x >= 2).length,
    12,
  );

  console.log(
    transformBoard(generateBoard(lines), lines, newFilterFn)
      .flat()
      .filter((x) => x >= 2).length,
  );
})();
