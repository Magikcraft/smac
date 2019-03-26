import chalk, { Chalk } from 'chalk'
;(String as any).prototype.replaceAll = function(search, replacement) {
    var target = this
    return target.split(search).join(replacement)
}

const customPluginColors = {} as { [index: string]: Chalk }
const customNSColors = {} as { [index: string]: Chalk }

const colorChoices = [
    chalk.yellowBright,
    chalk.cyan,
    chalk.magenta.italic,
    chalk.magentaBright,
    chalk.green,
    chalk.yellow,
    chalk.blue,
]

const colorMap = [
    {
        keyword: 'ERROR]',
        color: chalk.red,
    },
    { keyword: 'WARN]', color: chalk.yellow },
    { keyword: 'INFO]', color: chalk.green },
]

function colorizeTime(line, keyword, color) {
    const timeRegex = new RegExp(
        /\[([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?/g
    )
    const time = line.match(timeRegex)
    const colored = line
        .replaceAll(keyword, color(keyword))
        .replace(time, color(time))
    return colored
}

function colorizeWords(line, keyword, color) {
    if (!keyword) return line
    const colored = line.replaceAll(keyword, color(keyword))
    return colored
}

function namespace(line) {
    const ns = line.split('[')
    if (ns.length < 3) {
        return line
    }
    const time = ns[1]
    const plugin = ns[2].split(']')[0]
    let custom
    if (ns.length > 3) {
        custom = ns[3].split(']')[0]
    }
    const customColors = [] as any
    if (plugin === 'scriptcraft') {
        customColors.push({
            keyword: '[scriptcraft]',
            color: chalk.grey,
        })
    } else if (plugin === 'Multiverse-Core') {
        customColors.push({
            keyword: '[Multiverse-Core]',
            color: chalk.magenta,
        })
    } else {
        if (!customPluginColors[plugin]) {
            const length = Object.keys(customPluginColors).length
            const next = length % colorChoices.length
            customPluginColors[plugin] = colorChoices[next]
        }
        customColors.push({
            keyword: `[${plugin}]`,
            color: customPluginColors[plugin],
        })
    }
    if (custom) {
        const customNsParts = custom.split('/')
        let customNS
        if (
            customNsParts[0].length < 2 &&
            customNsParts.length > 1 &&
            customNsParts[1].length > 2
        ) {
            customNS = customNsParts[1]
        } else {
            customNS = customNsParts[0]
        }
        if (!customNSColors[customNS]) {
            customNSColors[customNS] =
                colorChoices[
                    Object.keys(customNSColors).length % colorChoices.length
                ]
        }
        customColors.push({
            keyword: `[${custom}]`,
            color: customNSColors[customNS].italic,
        })
    }
    return customColors
}

export function colorise(line, singleWordMode = true) {
    const lines = line.split('\n')
    const colorised = [] as string[]
    for (let j = 0; j < lines.length; j++) {
        let coloredLine = lines[j]
        coloredLine = coloriseFromMap(coloredLine, colorMap, colorizeTime)
        coloredLine = coloriseFromMap(
            coloredLine,
            namespace(lines[j]),
            colorizeWords
        )
        colorised.push(coloredLine)
    }
    return colorised.join('\n')
}

function coloriseFromMap(line, customColorMap, fn) {
    for (let i = 0; i < customColorMap.length; i++) {
        const keyword = customColorMap[i].keyword
        const color = customColorMap[i].color
        if (line.indexOf(keyword) > -1) {
            line = fn(line, keyword, color)
        }
    }
    return line
}
