import * as docker from '../lib/docker'
import { server } from '../lib/server'
import { exit } from '../lib/util/exit'
import { getTargetForCommand, hintRunningContainers } from '../lib/util/name'
import { getContainerStatus } from './status'

export async function stopServer(options?: any) {
    let target
    if (options.file) {
        server.filename = options.file
        target = await server.getName()
    } else if (options.profile) {
        target = options.profile
    } else {
        const name = await getTargetForCommand()
        if (name.isNothing) {
            hintRunningContainers()
            return exit()
        }
        target = name.value
    }
    const data = await getContainerStatus(target)
    if (data.isError) {
        console.log(data.error.message)
        return exit()
    }
    if (data.value.Status === 'exited') {
        await removeStoppedInstance(target)
        exit()
    }
    console.log(`Shutting down ${target}...`)

    await stopRunningInstance(target)
    await removeStoppedInstance(target)
    return exit()
}

async function stopRunningInstance(name: string) {
    await docker.command(`stop ${name}`)
}

export async function removeStoppedInstance(name: string) {
    console.log('Removing stopped container')
    await docker.command(`rm ${name}`)
}
