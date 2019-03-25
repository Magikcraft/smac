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
var customPluginColors = {};
var customNSColors = {};
var colorChoices = [
    chalk_1.default.yellowBright,
    chalk_1.default.cyan,
    chalk_1.default.magenta.italic,
    chalk_1.default.magentaBright,
    chalk_1.default.green,
    chalk_1.default.yellow,
    chalk_1.default.blue,
];
var colorMap = [
    {
        keyword: 'ERROR]',
        color: chalk_1.default.red,
    },
    { keyword: 'WARN]', color: chalk_1.default.yellow },
    { keyword: 'INFO]', color: chalk_1.default.green },
];
function colorizeTime(line, keyword, color) {
    var timeRegex = new RegExp(/\[([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?/g);
    var time = line.match(timeRegex);
    var colored = line
        .replaceAll(keyword, color(keyword))
        .replace(time, color(time));
    return colored;
}
function colorizeWords(line, keyword, color) {
    var colored = line.replaceAll(keyword, color(keyword));
    return colored;
}
function namespace(line) {
    var ns = line.split('[');
    if (ns.length < 3) {
        return line;
    }
    var time = ns[1];
    var plugin = ns[2].split(']')[0];
    var custom;
    if (ns.length > 3) {
        custom = ns[3].split(']')[0];
    }
    var customColors = [];
    if (plugin === 'scriptcraft') {
        customColors.push({
            keyword: '[scriptcraft]',
            color: chalk_1.default.grey,
        });
    }
    else if (plugin === 'Multiverse-Core') {
        customColors.push({
            keyword: '[Multiverse-Core]',
            color: chalk_1.default.magenta,
        });
    }
    else {
        if (!customPluginColors[plugin]) {
            customPluginColors[plugin] =
                colorChoices[Object.keys(customPluginColors).length % colorChoices.length];
        }
        customColors.push({
            keyword: "[" + plugin + "]",
            color: customPluginColors[plugin],
        });
    }
    if (custom) {
        var customNsParts = custom.split('/');
        var customNS = void 0;
        if (customNsParts[0].length < 2 &&
            customNsParts.length > 1 &&
            customNsParts[1].length > 2) {
            customNS = customNsParts[1];
        }
        else {
            customNS = customNsParts[0];
        }
        if (!customNSColors[customNS]) {
            customNSColors[customNS] =
                colorChoices[Object.keys(customNSColors).length % colorChoices.length];
        }
        customColors.push({
            keyword: "[" + custom + "]",
            color: customNSColors[customNS].italic,
        });
    }
    return customColors;
}
function colorise(line, singleWordMode) {
    if (singleWordMode === void 0) { singleWordMode = true; }
    var lines = line.split('\n');
    var colorised = [];
    for (var j = 0; j < lines.length; j++) {
        var coloredLine = lines[j];
        coloredLine = coloriseFromMap(coloredLine, colorMap, colorizeTime);
        coloredLine = coloriseFromMap(coloredLine, namespace(lines[j]), colorizeWords);
        colorised.push(coloredLine);
    }
    return colorised.join('\n');
}
exports.colorise = colorise;
function coloriseFromMap(line, customColorMap, fn) {
    for (var i = 0; i < customColorMap.length; i++) {
        var keyword = customColorMap[i].keyword;
        var color = customColorMap[i].color;
        if (line.indexOf(keyword) > -1) {
            line = fn(line, keyword, color);
        }
    }
    return line;
}
