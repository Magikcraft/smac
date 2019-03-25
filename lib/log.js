"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
var colorMap = [
    {
        keyword: 'ERROR',
        color: chalk_1.default.red,
    },
    { keyword: 'WARN]', color: chalk_1.default.yellow },
    { keyword: 'INFO]', color: chalk_1.default.green },
    { keyword: '[scriptcraft]', color: chalk_1.default.blue },
];
function colorizeWords(line, keyword, color) {
    return line.replaceAll(keyword, color(keyword));
}
function colorise(line, singleWordMode) {
    if (singleWordMode === void 0) { singleWordMode = true; }
    var coloredLine = line;
    for (var i = 0; i < colorMap.length; i++) {
        var keyword = colorMap[i].keyword;
        var color = colorMap[i].color;
        if (coloredLine.indexOf(keyword) > -1) {
            if (singleWordMode) {
                coloredLine = colorizeWords(coloredLine, keyword, color);
            }
            else {
                coloredLine = color(line);
                break;
            }
        }
    }
    return coloredLine;
}
exports.colorise = colorise;
