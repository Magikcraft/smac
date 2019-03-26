import chalk from 'chalk'
import { ErrorResult, Result } from 'ghetto-monad'
import * as docker from '../lib/docker'
import { server } from '../lib/server'
import { exit } from '../lib/util/exit'
import { getTargetForCommand } from '../lib/util/name'
import { viewLogs } from './logs'
import { getContainerStatus, getStatus } from './status'
import { removeStoppedInstance } from './stop'

export async function startServer() {
    const name = await getTargetForCommand({ includeRunningContainer: false })
    if (name.isNothing) {
        console.log(
            'No name provided, and no package.json with a server name found.'
        )
        return exit()
    }
    // @TODO
    // installJSPluginsIfNeeded()
    // installJavaPluginsIfNeeded()
    const data = await getContainerStatus(name.value)
    if (!data.isError) {
        if (data.value.Status === 'running') {
            console.log(`${name.value} is already running.`)
            return exit()
        }
        if (data.value.Status === 'created') {
            console.log(
                `${
                    name.value
                } has been created, but is not running. Trying waiting, or stopping it.`
            )
            console.log(
                `If that doesn't work - check if this issue has been reported at https://github.com/Magikcraft/scriptcraft-sma/issues`
            )
            return exit()
        }
        if (data.value.Status === 'exited') {
            return removeStoppedInstance(name.value)
        }
        if (data.value.Status === 'paused') {
            await restartPausedContainer(name.value)
            await getStatus()
            exit()
        }
    }
    console.log(`Starting ${name.value}`)
    const result = await startNewInstance(name.value)
    if (!result.isError) {
        viewLogs()
    }
}

function restartPausedContainer(name: string) {
    console.log(`Unpausing ${name}`)
    return docker.command(`unpause ${name}`)
}

async function startNewInstance(name: string) {
    const tag = await server.getDockerTag()
    const port = await server.getPort()
    const bind = await server.getBindings(name)
    const env = await server.getEnvironment()
    const rest = await server.getRestConfig()
    const cache = `--mount source=sma-server-cache,target=/server/cache`
    try {
        const dc = `run -d -p ${port}:25565 -p ${rest.port}:${
            rest.port
        } --name ${name} ${env} ${bind} ${cache} --restart always magikcraft/scriptcraft:${tag}`
        await docker.command(dc)
        console.log(
            chalk.yellow(`Server ${name} started on localhost:${port}\n`)
        )
        console.log('Start command:')
        console.log(dc.split('--').join('\n\t--'))
        return new Result(true)
    } catch (e) {
        console.log('There was an error starting the server!')
        console.log(
            e
                .toString()
                .split('--')
                .join('\n\t--')
        )
        console.log(
            `\nTry stopping the server, then starting it again.\n\nIf that doesn't work - check if this issue has been reported at https://github.com/Magikcraft/scriptcraft-sma/issues`
        )
        return new ErrorResult(new Error())
    }
}
