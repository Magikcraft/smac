import chalk from 'chalk'
import { spawn } from 'child_process'
import { startTerminal } from '../lib/terminal'
import { exit } from '../lib/util/exit'
import { colorise } from '../lib/util/log'
import { getTargetForCommand, hintRunningContainers } from '../lib/util/name'
import { getContainerStatus } from './status'

export async function viewLogs() {
    const name = await getTargetForCommand()
    if (name.isNothing) {
        hintRunningContainers()
        return exit()
    }
    const isRunning = await getContainerStatus(name.value)
    if (isRunning.isError) {
        console.log(isRunning.error.message)
        exit()
    }
    console.log('Spawning log viewer')
    process.on('SIGINT', () => {
        console.log(
            chalk.yellow(`\n\nServer ${name.value} is still running. Use '`) +
                chalk.blue(`smac stop ${name.value}`) +
                chalk.yellow(' to stop it.')
        )
        exit(0)
    })
    const log = spawn('docker', ['logs', '-f', name.value])

    log.stdout!.on('data', d => {
        const lines = colorise(d.toString())
        process.stdout.write(lines)
    })
    startTerminal()
}
