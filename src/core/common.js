"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BETWEEN_BRACKET_AND_EQUAL = /(?<=\[).*?(?==)/;
var BETWEEN_EQUAL_AND_BRACKET = /(?<==).*?(?=])/;
var EVERY_PARTS_STARTS_WITH_DOT_HASH_COLON_OR_BETWEEN_BRACKET = /([\.#:].*?((?=[\.#:[])|$)|\[.*?])/g;
var isFlatMappable = function (obj) { return obj && obj.flatMap && typeof obj.flatMap === 'function'; };
var flatten = function (maybeArray) { return isFlatMappable(maybeArray)
    ? maybeArray.flatMap(function (element) { return flatten(element); })
    : [maybeArray]; };
exports.flatten = flatten;
var parseAbbr = function (expression) {
    var AttrExpMap = {
        '.': function (exp) {
            var _a;
            return (_a = {}, _a['class'] = exp.slice(1), _a);
        },
        '#': function (exp) {
            var _a;
            return (_a = {}, _a['id'] = exp.slice(1), _a);
        },
        ':': function (exp) {
            var _a;
            return (_a = {}, _a['type'] = exp.slice(1), _a);
        },
        '[': function (exp) {
            var _a;
            return (_a = {}, _a[exp.match(BETWEEN_BRACKET_AND_EQUAL)[0]] = exp.match(BETWEEN_EQUAL_AND_BRACKET)[0], _a);
        },
    };
    var parts = expression.match(EVERY_PARTS_STARTS_WITH_DOT_HASH_COLON_OR_BETWEEN_BRACKET);
    return parts
        .map(function (part) { return AttrExpMap[part[0]](part); })
        .reduce(function (_a, _b) {
        var classValue1 = _a.class, attrs1 = __rest(_a, ["class"]);
        var classValue2 = _b.class, attrs2 = __rest(_b, ["class"]);
        return (__assign(__assign(__assign({}, attrs1), attrs2), { class: [classValue1, classValue2]
                .filter(function (classValue) { return classValue != null && classValue !== ''; })
                .join(' ') }));
    });
};
exports.parseAbbr = parseAbbr;
var parseTemplate = function (template) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return template
        .map(function (text, index) { return text + (args.length > index ? args[index] : ''); })
        .join('');
};
exports.parseTemplate = parseTemplate;
//# sourceMappingURL=common.js.map