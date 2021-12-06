import { readFileSync } from 'fs';
import * as R from 'ramda';
import * as assert from 'assert';

type Board = number[][];
function parseInput(fpath: string): [number[], Board[]] {
  const [rawNums, ...rawBoards] = readFileSync(fpath, { encoding: 'utf-8' })
    .trim()
    .split('\n\n');

  return [
    rawNums.split(',').map((x) => parseInt(x)),
    rawBoards.map((board) =>
      board.split('\n').map((y) =>
        y
          .trim()
          .split(' ')
          .filter((z) => z != '')
          .map((v) => parseInt(v)),
      ),
    ),
  ];
}

function hasWinningStreak(board: Board, type = 'row'): boolean {
  if (type === 'column') {
    board = R.transpose(board);
  }
  return R.any(
    (x: boolean) => x,
    board.map((row: number[]) => R.all((x: number) => x < 0, row)),
  );
}

function markBoard(board: Board, move: number): Board {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] == move) {
        // board[i][j] = -board[i][j];
        board[i][j] = -Infinity;
        return board;
      }
    }
  }
  return board;
}

function getWinningBoard(boards: Board[], moves: number[]): [number, Board[]] {
  boards = R.clone(boards);
  for (const move of moves) {
    boards = boards.map((board) => markBoard(board, move));
    // for (const board of boards) {
    for (let i = 0; i < boards.length; i++) {
      const board = boards[i];
      if (hasWinningStreak(board, 'row') || hasWinningStreak(board, 'column')) {
        boards.splice(i, 1);
        return [
          board
            .flat()
            .filter((x) => x >= 0)
            .reduce((x, y) => x + y) * move,
          boards,
        ];
      }
    }
  }
  return [0, []];
}

function getLastScore(boards: Board[], moves: number[]): number {
  let finalScore = 0;
  while (boards.length > 0) {
    const [score, remainingBoards] = getWinningBoard(boards, moves);
    boards = remainingBoards;
    finalScore = score;
  }
  return finalScore;
}

(function solve() {
  const [testMoves, testBoards] = parseInput('./testInput.txt');
  assert.equal(getWinningBoard(testBoards, testMoves)[0], 4512);

  const [moves, boards] = parseInput('./input.txt');
  console.log('score', getWinningBoard(boards, moves)[0]);

  assert.equal(getLastScore(testBoards, testMoves), 1924);

  console.log('score', getLastScore(boards, moves));
})();
