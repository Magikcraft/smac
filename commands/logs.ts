import { spawn } from 'child_process'
import { CustomStd } from '../lib/stdout'
import { startTerminal } from '../lib/terminal'
import { exit } from '../lib/util/exit'
import { colorise } from '../lib/util/log'
import { getTargetForCommand, hintRunningContainers } from '../lib/util/name'
import { getContainerStatus } from './status'
import { stopServer } from './stop'

let AlreadyStarted = false
const stdout = CustomStd()
export async function viewLogs({
    serverTarget,
    started = false,
    options = {},
}: { serverTarget?: string; started?: boolean; options?: any } = {}) {
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

    let testsFailed = false

    log.stdout!.on('data', d => {
        const lines = colorise(d.toString())
        stdout.write(lines)
        if (lines.indexOf('Some Jasmine tests have failed.')) {
            testsFailed = true
        }

        // Shut down the container and exit with a code based on the test results
        // when we were started with -t -e
        if (options && options.test && options.exit) {
            if (lines.indexOf('All tests are now complete.') != -1) {
                if (testsFailed) {
                    stopServer().then(() => process.exit(1))
                } else {
                    stopServer().then(() => process.exit(0))
                }
            }
        }
    })
    AlreadyStarted = true
}
