import * as docker from '../lib/docker'
import { exit } from '../lib/util/exit'
import { getTargetForCommand, hintRunningContainers } from '../lib/util/name'
import { getContainerStatus } from './status'

export async function stopServer() {
    const name = await getTargetForCommand()
    if (name.isNothing) {
        hintRunningContainers()
        return exit()
    }
    const data = await getContainerStatus(name.value)
    if (data.isError) {
        console.log(data.error.message)
        return exit()
    }
    if (data.value.Status === 'exited') {
        await removeStoppedInstance(name.value)
        exit()
    }
    console.log(`Shutting down ${name.value}...`)

    await stopRunningInstance(name.value)
    await removeStoppedInstance(name.value)
}

async function stopRunningInstance(name: string) {
    await docker.command(`stop ${name}`)
}

export async function removeStoppedInstance(name: string) {
    console.log('Removing stopped container')
    await docker.command(`rm ${name}`)
}
