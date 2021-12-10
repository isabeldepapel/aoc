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
function lanternfish(initialFish, numDays) {
    if (numDays === void 0) { numDays = 18; }
    var fishLife = 7;
    // index of array is day that new fish is spawned
    var newFishList = Array(numDays).fill(0);
    for (var i = 0; i < initialFish.length; i++) {
        var fish = initialFish[i];
        if (fish === 0) {
            newFishList[0] += 1;
        }
        var idx = fish;
        while (idx < numDays) {
            newFishList[idx] += 1;
            idx += fishLife;
        }
    }
    // console.log('new fish list', newFishList);
    return newFishList.reduce(function (acc, curr, idx) {
        var newFish = newFishList[idx];
        if (newFish > 0) {
            var j = idx + fishLife + 2;
            while (j < newFishList.length) {
                newFishList[j] += 1 * newFish;
                j += fishLife;
            }
        }
        return acc + curr;
    }, initialFish.length);
    // for (let i = 0; i < newFishList.length - 1; i++) {
    //   const newFish = newFishList[i];
    //   if (newFish === 0) {
    //     continue;
    //   }
    //   let j = i + fishLife + 2;
    //   while (j < newFishList.length) {
    //     newFishList[j] += 1 * newFish;
    //     j += fishLife;
    //   }
    // }
    // return newFishList.reduce((acc, curr) => {
    //   return acc + curr;
    // }, initialFish.length);
}
(function solve() {
    assert.equal(lanternfish(parseInput('./testInput.txt'), 18), 26);
    assert.equal(lanternfish(parseInput('./testInput.txt'), 80), 5934);
    console.log(lanternfish(parseInput('./input.txt'), 80));
    assert.equal(lanternfish(parseInput('./testInput.txt'), 256), 26984457539);
    console.log(lanternfish(parseInput('./input.txt'), 256));
})();
