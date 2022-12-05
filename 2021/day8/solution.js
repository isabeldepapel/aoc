"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
var fs_1 = require("fs");
var assert = require("assert");
function parseInput(fpath) {
    return (0, fs_1.readFileSync)(fpath, { encoding: 'utf-8' })
        .trim()
        .split('\n')
        .map(function (x) {
        return x
            .trim()
            .split(' | ')
            .map(function (y) { return y.trim().split(' '); });
    });
}
function countOutput(lines) {
    var uniqueNumSegments = new Set([2, 4, 3, 7]);
    return lines.reduce(function (prev, curr) {
        var _a = __read(curr, 2), output = _a[1];
        return output.filter(function (x) { return uniqueNumSegments.has(x.length); }).length + prev;
    }, 0);
}
function difference(set1, set2) {
    var e_1, _a;
    var diff = new Set();
    if (set2.size > set1.size) {
        var temp = set1;
        set1 = set2;
        set2 = temp;
    }
    try {
        for (var _b = __values(set1.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var char = _c.value;
            if (!set2.has(char)) {
                diff.add(char);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return diff;
}
function union(set1, set2) {
    var e_2, _a, e_3, _b;
    var result = new Set();
    try {
        for (var set1_1 = __values(set1), set1_1_1 = set1_1.next(); !set1_1_1.done; set1_1_1 = set1_1.next()) {
            var char = set1_1_1.value;
            result.add(char);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (set1_1_1 && !set1_1_1.done && (_a = set1_1["return"])) _a.call(set1_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    try {
        for (var _c = __values(set2.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var char = _d.value;
            result.add(char);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_b = _c["return"])) _b.call(_c);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return result;
}
function unwrap(set) {
    if (set.size > 1) {
        throw new Error();
    }
    return set.keys().next().value;
}
function decipherSignals(signals) {
    // Sort signals by length and turn into sets
    var sortedSignals = signals.slice(0).sort(function (a, b) { return a.length - b.length; });
    var signalSets = sortedSignals.map(function (s) { return new Set(s); });
    var nums = Array(10);
    nums[1] = signalSets[0];
    nums[7] = signalSets[1];
    nums[4] = signalSets[2];
    nums[8] = signalSets[9];
    var zerosixnine = signalSets.slice(6, 9);
    var segments = {};
    var idx9 = zerosixnine.findIndex(function (s) {
        return difference(union(nums[7], nums[4]), s).size === 1;
    });
    nums[9] = zerosixnine[idx9];
    var zerosix = zerosixnine
        .slice(0, idx9)
        .concat(zerosixnine.slice(idx9 + 1));
    var idx0 = zerosix.findIndex(function (s) {
        return union(difference(nums[9], s), nums[1]).size === 3;
    });
    nums[0] = zerosix[idx0];
    nums[6] = idx0 === 0 ? zerosix[1] : zerosix[0];
    segments.top = unwrap(difference(nums[1], nums[7]));
    segments.bottom = unwrap(difference(union(nums[7], nums[4]), nums[9]));
    segments.mid = unwrap(difference(nums[8], nums[0]));
    segments.ur = unwrap(difference(nums[8], nums[6]));
    segments.ll = unwrap(difference(nums[9], nums[8]));
    segments.lr = unwrap(difference(nums[1], new Set(segments.ur)));
    segments.ul = unwrap(difference(difference(nums[4], nums[1]), new Set(segments.mid)));
    nums[5] = difference(nums[9], new Set(segments.ur));
    nums[3] = difference(nums[9], new Set(segments.ul));
    nums[2] = new Set([
        segments.top,
        segments.mid,
        segments.bottom,
        segments.ur,
        segments.ll,
    ]);
    var decipheredNums = {};
    for (var i = 0; i < 10; i++) {
        var key = Array.from(nums[i]).sort().join('');
        decipheredNums[key] = i;
    }
    return decipheredNums;
}
function decipherOutput(lines) {
    return lines.reduce(function (prev, curr) {
        var _a = __read(curr, 2), signals = _a[0], output = _a[1];
        var decipheredSignals = decipherSignals(signals);
        var sortedOutput = output.map(function (s) { return s.split('').sort().join(''); });
        var outputAsNum = parseInt(sortedOutput.map(function (s) { return decipheredSignals[s]; }).join(''));
        return prev + outputAsNum;
    }, 0);
}
(function solve() {
    assert.equal(countOutput(parseInput('./testInput.txt')), 26);
    console.log(countOutput(parseInput('./input.txt')));
    assert.equal(decipherOutput(parseInput('./testInput.txt')), 61229);
    console.log(decipherOutput(parseInput('./input.txt')));
})();
