"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var R = require("ramda");
var assert = require("assert");
function parseInput(fpath) {
    var _a = (0, fs_1.readFileSync)(fpath, { encoding: 'utf-8' })
        .trim()
        .split('\n\n'), rawNums = _a[0], rawBoards = _a.slice(1);
    return [
        rawNums.split(',').map(function (x) { return parseInt(x); }),
        rawBoards.map(function (board) {
            return board.split('\n').map(function (y) {
                return y
                    .trim()
                    .split(' ')
                    .filter(function (z) { return z != ''; })
                    .map(function (v) { return parseInt(v); });
            });
        }),
    ];
}
function hasWinningStreak(board, type) {
    if (type === void 0) { type = 'row'; }
    if (type === 'column') {
        board = R.transpose(board);
    }
    return R.any(function (x) { return x; }, board.map(function (row) { return R.all(function (x) { return x < 0; }, row); }));
}
function markBoard(board, move) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j] == move) {
                // board[i][j] = -board[i][j];
                board[i][j] = -Infinity;
                return board;
            }
        }
    }
    return board;
}
function getWinningBoard(boards, moves) {
    boards = R.clone(boards);
    var _loop_1 = function (move) {
        boards = boards.map(function (board) { return markBoard(board, move); });
        // for (const board of boards) {
        for (var i = 0; i < boards.length; i++) {
            var board = boards[i];
            if (hasWinningStreak(board, 'row') || hasWinningStreak(board, 'column')) {
                return { value: [
                        board
                            .flat()
                            .filter(function (x) { return x >= 0; })
                            .reduce(function (x, y) { return x + y; }) * move,
                        // boards,
                        boards.splice(i, 1),
                    ] };
            }
        }
    };
    for (var _i = 0, moves_1 = moves; _i < moves_1.length; _i++) {
        var move = moves_1[_i];
        var state_1 = _loop_1(move);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return [0, []];
}
function getLastScore(boards, moves) {
    var finalScore = 0;
    while (boards.length > 0) {
        var _a = getWinningBoard(boards, moves), score = _a[0], remainingBoards = _a[1];
        boards = remainingBoards;
        finalScore = score;
    }
    return finalScore;
}
(function solve() {
    var _a = parseInput('./testInput.txt'), testMoves = _a[0], testBoards = _a[1];
    assert.equal(getWinningBoard(testBoards, testMoves)[0], 4512);
    var _b = parseInput('./input.txt'), moves = _b[0], boards = _b[1];
    console.log('score', getWinningBoard(boards, moves)[0]);
    assert.equal(getLastScore(testBoards, testMoves), 1924);
    console.log('score', getLastScore(boards, moves));
})();
