"use strict";
exports.__esModule = true;
var assert = require("assert");
var fs_1 = require("fs");
function getInput(path) {
    return (0, fs_1.readFileSync)(path, { encoding: 'utf-8' })
        .trim()
        .split('\n')
        .map(function (x) { return parseInt(x, 10); });
}
function countIncreasing(nums, window) {
    if (window === void 0) { window = 1; }
    var count = 0;
    for (var i = 0; i < nums.length - window; i++) {
        if (nums[i + window] > nums[i]) {
            count += 1;
        }
    }
    // for (let i = 1; i < nums.length; i++) {
    //   if (nums[i] >= nums[i - 1]) {
    //     count += 1;
    //   }
    // }
    return count;
}
function countIncreasingSums(nums) {
    var count = 0;
    var s1 = 0;
    var s2 = 0;
    for (var i = 0; i < nums.length - 3; i++) {
        // const tmp = nums.slice(i, i + 3);
        // console.log(tmp);
        s1 = nums.slice(i, i + 3).reduce(function (x, y) { return x + y; });
        s2 = nums.slice(i + 1, i + 4).reduce(function (x, y) { return x + y; });
        console.log('s1, s2', s1, s2);
        if (s2 > s1) {
            count += 1;
        }
    }
    // console.log('inc sums', count);
    return count;
}
(function solve() {
    assert.equal(countIncreasing(getInput('./testInput.txt')), 7);
    var inc = countIncreasing(getInput('./input.txt'));
    console.log('inc', inc);
    assert.equal(countIncreasing(getInput('./testInput.txt'), 3), 5);
    console.log(countIncreasing(getInput('./input.txt'), 3));
    // assert.equal(countIncreasingSums(getInput('./testInput.txt')), 5);
    // console.log(countIncreasingSums(getInput('./input.txt')));
})();
