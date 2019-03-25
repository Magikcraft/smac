import chalk from 'chalk'
;(String as any).prototype.replaceAll = function(search, replacement) {
    var target = this
    return target.split(search).join(replacement)
}

const colorMap = [
    {
        keyword: 'ERROR',
        color: chalk.red,
    },
    { keyword: 'WARN]', color: chalk.yellow },
    { keyword: 'INFO]', color: chalk.green },
    { keyword: '[scriptcraft]', color: chalk.blue },
]

function colorizeWords(line, keyword, color) {
    return line.replaceAll(keyword, color(keyword))
}

export function colorise(line, singleWordMode = true) {
    let coloredLine = line
    for (let i = 0; i < colorMap.length; i++) {
        const keyword = colorMap[i].keyword
        const color = colorMap[i].color
        if (coloredLine.indexOf(keyword) > -1) {
            if (singleWordMode) {
                coloredLine = colorizeWords(coloredLine, keyword, color)
            } else {
                coloredLine = color(line)
                break
            }
        }
    }
    return coloredLine
}
