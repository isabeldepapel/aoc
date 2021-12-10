"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var assert = require("assert");
function parseInput(fpath) {
    return (0, fs_1.readFileSync)(fpath, { encoding: 'utf-8' })
        .trim()
        .split(',')
        .map(function (x) { return parseInt(x); });
}
// function findMedian(crabs: number[]): number {
//   // find median
//   let median: number;
//   const sortedCrabs = crabs.slice(0).sort((a, b) => a - b);
//   const numCrabs = sortedCrabs.length;
//   if (numCrabs / 2 === 0) {
//     median = (sortedCrabs[numCrabs / 2] + sortedCrabs[numCrabs / 2 - 1]) / 2;
//   } else {
//     median = sortedCrabs[Math.floor(numCrabs / 2)];
//   }
//   return median;
// }
function findPosByMedian(crabs) {
    // find median
    var median;
    var sortedCrabs = crabs.slice(0).sort(function (a, b) { return a - b; });
    var numCrabs = sortedCrabs.length;
    if (numCrabs / 2 === 0) {
        median = (sortedCrabs[numCrabs / 2] + sortedCrabs[numCrabs / 2 - 1]) / 2;
    }
    else {
        median = sortedCrabs[Math.floor(numCrabs / 2)];
    }
    // return median;
    return crabs.reduce(function (prev, curr) {
        return prev + Math.abs(curr - median);
    }, 0);
}
function findPosByAvg(crabs) {
    var memo = Array(Math.max.apply(Math, crabs) - Math.min.apply(Math, crabs)).fill(0);
    for (var i = 1; i < memo.length; i++) {
        memo[i] = memo[i - 1] + i;
    }
    // console.log('memo', memo);
    console.log(crabs.reduce(function (x, y) { return x + y; }) / crabs.length);
    var avg1 = Math.floor(crabs.reduce(function (x, y) { return x + y; }) / crabs.length);
    var avg2 = Math.ceil(crabs.reduce(function (x, y) { return x + y; }) / crabs.length);
    console.log('round', Math.round(crabs.reduce(function (x, y) { return x + y; }) / crabs.length));
    var sum1 = crabs.reduce(function (prev, curr) {
        // blah
        return prev + memo[Math.abs(curr - avg1)];
    }, 0);
    var sum2 = crabs.reduce(function (prev, curr) {
        return prev + memo[Math.abs(curr - avg2)];
    }, 0);
    console.log('avg1', avg1, 'avg2', avg2);
    console.log('sum1', sum1);
    return Math.min(sum1, sum2);
    // return avg;
}
(function solve() {
    assert.equal(findPosByMedian(parseInput('./testInput.txt')), 37);
    console.log(findPosByMedian(parseInput('./input.txt')));
    assert.equal(findPosByAvg(parseInput('./testInput.txt')), 168);
    console.log(findPosByAvg(parseInput('./input.txt')));
})();
