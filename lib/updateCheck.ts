import chalk from 'chalk'
import checkForUpdate from 'update-check'

const pkg = require('../package')
export const version = pkg.version

export async function doUpdateCheck() {
    let update: any = null

    try {
        update = await checkForUpdate(pkg)
    } catch (err) {
        // console.error(`Failed to check for updates: ${err}`)
    }

    if (update) {
        console.log(
            chalk.yellow(
                `\nAn updated version is available. The latest version is ${
                    update.latest
                }. Please update!`
            )
        )
        console.log(chalk.blue('\nnpm i -g smac\n'))
    }
}
