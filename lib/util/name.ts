import { Nothing, Result } from 'ghetto-monad'
import { getContainerList } from '../../commands/list'
import { getContainerStatus } from '../../commands/status'
import { server } from '../../lib/server'

export async function isRunning(name) {
    const data = await getContainerStatus(name)
    if (data.isError) {
        return false
    }
    return true
}

export async function hintRunningContainers() {
    const running = await getContainerList()
    if (running.length > 0) {
        console.log('These servers are running: ', running)
    } else {
        console.log('There are no running servers.')
    }
}

export async function getTargetForCommand({
    includeRunningContainer = true,
    options = {} as any,
} = {}) {
    const serverTarget = options.profile
    if (serverTarget) {
        return new Result(serverTarget)
    }
    const name = await server.getServerTargetFromPackageJson()
    if (!name.isNothing) {
        return name
    }
    if (includeRunningContainer) {
        const running = await getContainerList()
        if (running.length === 1) {
            return new Result(running[0].name)
        } else {
            return new Nothing()
        }
    } else {
        return new Nothing()
    }
}
