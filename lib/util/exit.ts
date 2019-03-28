import chalk from 'chalk'
import { doUpdateCheck } from '../updateCheck'

export async function exit(target?: string) {
    if (target) {
        console.log(
            chalk.yellow(`\n\nServer ${target} is still running. Use '`) +
                chalk.blue(`smac stop ${target}`) +
                chalk.yellow(' to stop it.')
        )
    }
    await doUpdateCheck()
    process.exit()
}
