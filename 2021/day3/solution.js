"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var assert = require("assert");
function getInput(fPath) {
    return (0, fs_1.readFileSync)(fPath, { encoding: 'utf-8' })
        .trim()
        .split('\n')
        .map(function (x) {
        return x
            .trim()
            .split('')
            .map(function (y) { return parseInt(y); });
    });
}
function getCommonBits(input, common) {
    if (common === void 0) { common = 'most'; }
    var most = input
        .reduce(function (prevArr, currArr) {
        return prevArr.map(function (num, idx) { return num + currArr[idx]; });
    })
        .map(function (x) { return (x >= input.length / 2 ? 1 : 0); });
    if (common === 'most') {
        return most;
    }
    return most.map(function (x) { return (x ? 0 : 1); });
    // .map((x) => {
    //   if (common === 'most') {
    //     return x >= input.length / 2 ? 1 : 0;
    //   }
    //   return x <= input.length / 2 ? 1 : 0;
    // });
    // return [mostCommon, mostCommon.map((x) => (x ? 0 : 1))];
}
function getPowerConsumption(mostCommon) {
    var leastCommon = mostCommon.map(function (x) { return (x ? 0 : 1); });
    return parseInt(mostCommon.join(''), 2) * parseInt(leastCommon.join(''), 2);
}
function getRatings(input, commonBits) {
    var mostCommon = commonBits[0], leastCommon = commonBits[1];
    var idx = 0;
    var filtered = input;
    do {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        filtered = filtered.filter(function (x) {
            return x[idx] === mostCommon[idx];
        });
        idx += 1;
    } while (filtered.length > 1);
    var oxygen = parseInt(filtered[0].join(''), 2);
    idx = 0;
    filtered = input;
    do {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        filtered = filtered.filter(function (x) { return x[idx] === leastCommon[idx]; });
        idx += 1;
    } while (filtered.length > 1);
    var co2 = parseInt(filtered[0].join(''), 2);
    console.log('ox', oxygen, 'co', co2);
    return oxygen * co2;
}
function getRating(input, common) {
    if (common === void 0) { common = 'most'; }
    var filtered = input;
    var idx = 0;
    var _loop_1 = function () {
        var commonBits = getCommonBits(filtered, common);
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        filtered = filtered.filter(function (x) { return x[idx] === commonBits[idx]; });
        idx += 1;
    };
    do {
        _loop_1();
    } while (filtered.length > 1);
    return parseInt(filtered[0].join(''), 2);
}
(function solve() {
    assert.equal(getPowerConsumption(getCommonBits(getInput('./testInput.txt'))), 198);
    console.log(getPowerConsumption(getCommonBits(getInput('./input.txt'))));
    var testInput = getInput('./testInput.txt');
    assert.equal(getRating(testInput, 'most') * getRating(testInput, 'least'), 230);
    var input = getInput('./input.txt');
    console.log(getRating(input, 'most') * getRating(input, 'least'));
})();
