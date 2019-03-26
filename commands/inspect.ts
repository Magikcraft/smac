import chalk from 'chalk'
import { exit } from 'process'
import * as docker from '../lib/docker'
import { getTargetForCommand, hintRunningContainers } from '../lib/util/name'
import { getContainerStatus } from './status'

export async function inspectContainer() {
    let name = await getTargetForCommand()
    if (name.isNothing) {
        await hintRunningContainers()
        return exit()
    }
    const status = await getContainerStatus(name.value)
    if (status.isError) {
        console.log(status.error.message)
        return exit(0)
    }
    console.log(chalk.blue(`${name.value}:`))
    console.log(status.value)
    const data = await docker.command(`inspect ${name.value}`)
    // console.log(data.object[0].State)
    console.log(chalk.blue('Container Mounts:'))
    console.log(data.object[0].Mounts)
    console.log(chalk.blue('Network:'))
    console.log(data.object[0].NetworkSettings.Ports)
    exit()
}
