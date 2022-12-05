"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var R = require("ramda");
var assert = require("assert");
function parseInput(fpath) {
    return (0, fs_1.readFileSync)(fpath, { encoding: 'utf-8' })
        .trim()
        .split('\n')
        .map(function (x) { return x.split('').map(function (y) { return parseInt(y); }); });
}
function getNeighbors(pos, grid) {
    var neighbors = [];
    var numRows = grid.length;
    var numCols = grid[0].length;
    var row = pos[0], col = pos[1];
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
function isLowPoint(num, neighbors) {
    return R.all(function (x) { return num < x; })(neighbors);
}
function findLowPoints(grid) {
    var lowPoints = [];
    for (var row = 0; row < grid.length; row++) {
        for (var col = 0; col < grid[0].length; col++) {
            var neighbors = getNeighbors([row, col], grid);
            if (isLowPoint(grid[row][col], neighbors)) {
                lowPoints.push([row, col]);
            }
        }
    }
    return lowPoints;
}
(function solve() {
    // console.log(findLowPoints(parseInput('./testInput.txt')));
    var testGrid = parseInput('./testInput.txt');
    assert.equal(findLowPoints(testGrid).reduce(function (prev, curr) {
        var row = curr[0], col = curr[1];
        return prev + testGrid[row][col] + 1;
    }, 0), 15);
    var grid = parseInput('./input.txt');
    console.log(findLowPoints(grid).reduce(function (prev, curr) {
        var row = curr[0], col = curr[1];
        return prev + grid[row][col] + 1;
    }, 0));
})();
