import { ErrorResult, Result } from 'ghetto-monad'
import * as docker from '../lib/docker'
import { exit } from '../lib/util/exit'
import {
    getTargetForCommand,
    hintRunningContainers,
    isRunning,
} from '../lib/util/name'
import { getContainerList } from './list'

export async function getContainerStatus(name: string) {
    try {
        const data = await docker.command(`inspect ${name}`)
        return new Result({
            Name: name,
            State: data.object[0].State,
            Mounts: data.object[0].Mounts,
            ...data.object[0].NetworkSettings.Ports,
        })
    } catch (e) {
        const running = await getContainerList()
        if (running.length === 1) {
            return getContainerStatus(running[0].name)
        }
        return new ErrorResult(new Error(`Server ${name} is not running`))
    }
}

export async function getStatus() {
    const name = await getTargetForCommand()
    if (name.isNothing) {
        await hintRunningContainers()
        return exit
    }
    const isUp = isRunning(name.value)
    if (!isUp) {
        console.log(`Server ${name.value} is not running`)
        await hintRunningContainers()
        return exit
    }
    const data = await getContainerStatus(name.value)
    if (data.isError) {
        console.log(data.error.message)
        return exit()
    }
    console.log(data.value)
}
