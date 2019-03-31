import { spawn } from 'child_process'
import { CustomStd } from '../lib/stdout'
import { startTerminal } from '../lib/terminal'
import { exit } from '../lib/util/exit'
import { colorise } from '../lib/util/log'
import { getTargetForCommand, hintRunningContainers } from '../lib/util/name'
import { getContainerStatus } from './status'

let AlreadyStarted = false
const stdout = CustomStd()
export async function viewLogs({
    serverTarget,
    started = false,
}: { serverTarget?: string; started?: boolean } = {}) {
    let target: string
    if (serverTarget) {
        target = serverTarget
    } else {
        const name = await getTargetForCommand()
        if (name.isNothing) {
            hintRunningContainers()
            return exit()
        }
        target = name.value
    }
    const isRunning = await getContainerStatus(target)
    if (isRunning.isError) {
        console.log(isRunning.error.message)
        return exit()
    }
    console.log('Spawning log viewer')
    if (!AlreadyStarted) {
        startTerminal(target, started)
    }
    const log = spawn('docker', ['logs', '-f', target])

    log.stdout!.on('data', d => {
        const lines = colorise(d.toString())
        stdout.write(lines)
    })
    AlreadyStarted = true
}
