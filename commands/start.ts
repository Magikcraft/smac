import chalk from 'chalk'
import { ErrorResult, Result } from 'ghetto-monad'
import * as docker from '../lib/docker'
import { checkEula } from '../lib/eula'
import { server } from '../lib/server'
import { exit } from '../lib/util/exit'
import { getTargetForCommand } from '../lib/util/name'
import { viewLogs } from './logs'
import { getContainerStatus, getStatus } from './status'
import { removeStoppedInstance } from './stop'

export async function startServer(serverTarget?: string) {
    let target: string
    if (serverTarget) {
        target = serverTarget
    } else {
        const name = await getTargetForCommand({
            includeRunningContainer: false,
        })
        if (name.isNothing) {
            console.log(
                'No name provided, and no package.json with a server name found.'
            )
            return exit()
        }
        target = name.value
    }
    // @TODO
    // installJSPluginsIfNeeded()
    // installJavaPluginsIfNeeded()
    const data = await getContainerStatus(target)
    if (!data.isError) {
        if (data.value.State.Status === 'running') {
            console.log(`${target} is already running.`)
            return exit()
        }
        if (data.value.State.Status === 'created') {
            console.log(
                `${target} has been created, but is not running. Trying waiting, or stopping it.`
            )
            console.log(
                `If that doesn't work - check if this issue has been reported at https://github.com/Magikcraft/scriptcraft-sma/issues`
            )
            return exit()
        }
        if (data.value.State.Status === 'exited') {
            return removeStoppedInstance(target)
        }
        if (data.value.State.Status === 'paused') {
            await restartPausedContainer(target)
            await getStatus()
            exit()
        }
    }
    console.log(`Starting ${target}`)
    const result = await startNewInstance(target)
    if (!result.isError) {
        viewLogs({ serverTarget: target, started: true })
    }
}

function restartPausedContainer(name: string) {
    console.log(`Unpausing ${name}`)
    return docker.command(`unpause ${name}`)
}

async function startNewInstance(name: string) {
    const eulaAccepted = await checkEula()
    if (!eulaAccepted) {
        console.log('Cannot continue without accepting the Minecraft EULA.')
        exit()
        return new ErrorResult(new Error('Did not accept Minecraft EULA'))
    }
    console.log('Minecraft EULA accepted')
    const tag = await server.getDockerTag()
    const port = await server.getPort()
    const bind = await server.getBindings(name)
    const env = await server.getEnvironment()
    const rest = await server.getRestConfig()
    const cache = `--mount source=sma-server-cache,target=/server/cache`
    const eula = `-e MINECRAFT_EULA_ACCEPTED=${eulaAccepted}`
    try {
        const dc = `run -d -p ${port}:25565 -p ${rest.port}:${
            rest.port
        } --name ${name} ${env} ${eula} ${bind} ${cache} --restart always magikcraft/scriptcraft:${tag}`
        await docker.command(dc)
        console.log(
            chalk.yellow(`Server ${name} started on localhost:${port}\n`)
        )
        console.log('Start command:')
        const startCommand = dc
            .split('--')
            .map(s => `${s} \\`)
            .join('\n\t--')
        console.log(chalk.gray(startCommand))
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
