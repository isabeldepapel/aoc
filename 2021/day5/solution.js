"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var assert = require("assert");
function parseInput(fpath) {
    return (0, fs_1.readFileSync)(fpath, { encoding: 'utf-8' })
        .trim()
        .split('\n')
        .map(function (x) {
        return x.split(' -> ').map(function (y) { return y.split(',').map(function (z) { return parseInt(z); }); });
    });
}
function filterFn(line) {
    var _a = line[0], x1 = _a[0], y1 = _a[1], _b = line[1], x2 = _b[0], y2 = _b[1];
    return x1 === x2 || y1 === y2;
}
function newFilterFn(line) {
    var _a = line[0], x1 = _a[0], y1 = _a[1], _b = line[1], x2 = _b[0], y2 = _b[1];
    return filterFn(line) || Math.abs(x2 - x1) === Math.abs(y2 - y1);
}
function generateBoard(lines) {
    var maxX = 0;
    var maxY = 0;
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var _a = line[0], x1 = _a[0], y1 = _a[1], _b = line[1], x2 = _b[0], y2 = _b[1];
        maxX = Math.max(x1, x2, maxX); // x is cols
        maxY = Math.max(y1, y2, maxY); // y is row
    }
    return new Array(maxY + 1).fill(0).map(function () { return new Array(maxX + 1).fill(0); });
}
function transformBoard(board, lines, filter) {
    lines = lines.filter(filter);
    for (var _i = 0, lines_2 = lines; _i < lines_2.length; _i++) {
        var line = lines_2[_i];
        // x = cols, y = rows
        var _a = line[0], x1 = _a[0], y1 = _a[1], _b = line[1], x2 = _b[0], y2 = _b[1];
        // We check for horiz or vert line so we can ignore slope = 0
        var xslope = x2 > x1 ? 1 : -1;
        var yslope = y2 > y1 ? 1 : -1;
        // let xslope = 0;
        // let yslope = 0;
        // if (x2 > x1) {
        //   xslope = 1;
        // } else if (x2 < x1) {
        //   xslope = -1;
        // }
        // if (y2 > y1) {
        //   yslope = 1;
        // } else if (y2 < y1) {
        //   yslope = -1;
        // }
        // vertical or horizontal
        if (x1 === x2) {
            for (var i = y1; i !== y2; i += yslope) {
                board[i][x1] += 1;
            }
            board[y2][x1] += 1;
        }
        else if (y1 === y2) {
            for (var i = x1; i !== x2; i += xslope) {
                board[y1][i] += 1;
            }
            board[y1][x2] += 1;
            // diagonal lines
        }
        else {
            for (var i = y1, j = x1; i !== y2; i += yslope, j += xslope) {
                board[i][j] += 1;
            }
            board[y2][x2] += 1;
        }
    }
    return board;
}
(function solve() {
    var testLines = parseInput('./testInput.txt');
    assert.equal(transformBoard(generateBoard(testLines), testLines, filterFn)
        .flat()
        .filter(function (x) { return x >= 2; }).length, 5);
    var lines = parseInput('./input.txt');
    console.log(transformBoard(generateBoard(lines), lines, filterFn)
        .flat()
        .filter(function (x) { return x >= 2; }).length);
    assert.equal(transformBoard(generateBoard(testLines), testLines, newFilterFn)
        .flat()
        .filter(function (x) { return x >= 2; }).length, 12);
    console.log(transformBoard(generateBoard(lines), lines, newFilterFn)
        .flat()
        .filter(function (x) { return x >= 2; }).length);
})();
