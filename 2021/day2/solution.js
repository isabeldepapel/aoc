"use strict";
exports.__esModule = true;
var assert = require("assert");
var fs_1 = require("fs");
function getInput(fPath) {
    return (0, fs_1.readFileSync)(fPath, { encoding: 'utf-8' })
        .trim()
        .split('\n')
        .map(function (x) { return x.trim().split(' '); })
        .map(function (dir) {
        var num = parseInt(dir[1]);
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
function reducer(prev, curr) {
    var x1 = prev[0], y1 = prev[1], z1 = prev[2];
    var x2 = curr[0], y2 = curr[1], z2 = curr[2];
    return [x1 + x2, y1 + y2, z1 + z2 * (y2 + y1)];
}
(function solve() {
    assert.equal(getInput('./testInput.txt')
        .reduce(reducer, [0, 0, 1])
        .slice(0, 2)
        .reduce(function (x, y) { return x * y; }), 150);
    console.log('final', getInput('./input.txt')
        .reduce(reducer, [0, 0, 1])
        .slice(0, 2)
        .reduce(function (x, y) { return x * y; }));
    var _a = getInput('./testInput.txt').reduce(reducer, [0, 0, 0]), a = _a[0], c = _a[2];
    assert.equal(a * c, 900);
    var _b = getInput('./input.txt').reduce(reducer, [0, 0, 0]), x = _b[0], z = _b[2];
    console.log('final', x * z);
})();
