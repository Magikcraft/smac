"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
const customPluginColors = {};
const customNSColors = {};
const colorChoices = [
    chalk_1.default.yellowBright,
    chalk_1.default.cyan,
    chalk_1.default.magenta.italic,
    chalk_1.default.magentaBright,
    chalk_1.default.green,
    chalk_1.default.yellow,
    chalk_1.default.blue,
];
const colorMap = [
    {
        keyword: 'ERROR]',
        color: chalk_1.default.red,
    },
    { keyword: 'WARN]', color: chalk_1.default.yellow },
    { keyword: 'INFO]', color: chalk_1.default.green },
];
function colorizeTime(line, keyword, color) {
    const timeRegex = new RegExp(/\[([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?/g);
    const time = line.match(timeRegex);
    const colored = line
        .replaceAll(keyword, color(keyword))
        .replace(time, color(time));
    return colored;
}
function colorizeWords(line, keyword, color) {
    if (!keyword)
        return line;
    const colored = line.replaceAll(keyword, color(keyword));
    return colored;
}
function namespace(line) {
    const ns = line.split('[');
    if (ns.length < 3) {
        return line;
    }
    const time = ns[1];
    const plugin = ns[2].split(']')[0];
    let custom;
    if (ns.length > 3) {
        custom = ns[3].split(']')[0];
    }
    const customColors = [];
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
            const length = Object.keys(customPluginColors).length;
            const next = length % colorChoices.length;
            customPluginColors[plugin] = colorChoices[next];
        }
        customColors.push({
            keyword: `[${plugin}]`,
            color: customPluginColors[plugin],
        });
    }
    if (custom) {
        const customNsParts = custom.split('/');
        let customNS;
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
            keyword: `[${custom}]`,
            color: customNSColors[customNS].italic,
        });
    }
    return customColors;
}
function colorise(line, singleWordMode = true) {
    const lines = line.split('\n');
    const colorised = [];
    for (let j = 0; j < lines.length; j++) {
        let coloredLine = lines[j];
        coloredLine = coloriseFromMap(coloredLine, colorMap, colorizeTime);
        coloredLine = coloriseFromMap(coloredLine, namespace(lines[j]), colorizeWords);
        colorised.push(coloredLine);
    }
    return colorised.join('\n');
}
exports.colorise = colorise;
function coloriseFromMap(line, customColorMap, fn) {
    for (let i = 0; i < customColorMap.length; i++) {
        const keyword = customColorMap[i].keyword;
        const color = customColorMap[i].color;
        if (line.indexOf(keyword) > -1) {
            line = fn(line, keyword, color);
        }
    }
    return line;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQ0M7QUFBQyxNQUFjLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxVQUFTLE1BQU0sRUFBRSxXQUFXO0lBQ2hFLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQTtJQUNqQixPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ2pELENBQUMsQ0FBQTtBQUVELE1BQU0sa0JBQWtCLEdBQUcsRUFBZ0MsQ0FBQTtBQUMzRCxNQUFNLGNBQWMsR0FBRyxFQUFnQyxDQUFBO0FBRXZELE1BQU0sWUFBWSxHQUFHO0lBQ2pCLGVBQUssQ0FBQyxZQUFZO0lBQ2xCLGVBQUssQ0FBQyxJQUFJO0lBQ1YsZUFBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNO0lBQ3BCLGVBQUssQ0FBQyxhQUFhO0lBQ25CLGVBQUssQ0FBQyxLQUFLO0lBQ1gsZUFBSyxDQUFDLE1BQU07SUFDWixlQUFLLENBQUMsSUFBSTtDQUNiLENBQUE7QUFFRCxNQUFNLFFBQVEsR0FBRztJQUNiO1FBQ0ksT0FBTyxFQUFFLFFBQVE7UUFDakIsS0FBSyxFQUFFLGVBQUssQ0FBQyxHQUFHO0tBQ25CO0lBQ0QsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxlQUFLLENBQUMsTUFBTSxFQUFFO0lBQ3pDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsZUFBSyxDQUFDLEtBQUssRUFBRTtDQUMzQyxDQUFBO0FBRUQsU0FBUyxZQUFZLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLO0lBQ3RDLE1BQU0sU0FBUyxHQUFHLElBQUksTUFBTSxDQUN4QixpREFBaUQsQ0FDcEQsQ0FBQTtJQUNELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUE7SUFD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