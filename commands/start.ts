import chalk from 'chalk'
import { ErrorResult, Result } from 'ghetto-monad'
import * as docker from '../lib/docker'
import { checkEula } from '../lib/eula'
import { dockerServerRoot } from '../lib/paths'
import { server } from '../lib/server'
import { exit } from '../lib/util/exit'
import { getTargetForCommand } from '../lib/util/name'
import { viewLogs } from './logs'
import { getContainerStatus, getStatus } from './status'
import { removeStoppedInstance } from './stop'

export async function startServer(options: any) {
    let target: string
    if (options.profile) {
        target = options.profile
    } else {
        console.log(options)
        const filename = options.file
        server.filename = filename
        const name = await getTargetForCommand({
            includeRunningContainer: false,
            options,
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
    const result = await startNewInstance(target, options)
    if (!result.isError) {
        viewLogs({ serverTarget: target, started: true, options })
    }
}

function restartPausedContainer(name: string) {
    console.log(`Unpausing ${name}`)
    return docker.command(`unpause ${name}`)
}

async function startNewInstance(name: string, options: any) {
    const eulaAccepted = await checkEula()
    if (!eulaAccepted) {
        console.log('Cannot continue without accepting the Minecraft EULA.')
        exit()
        return new ErrorResult(new Error('Did not accept Minecraft EULA'))
    }
    console.log('Minecraft EULA accepted')
    const serverType = await server.getServerType()
    const tag = await server.getDockerTag()
    const port = await server.getExposedPort()
    let containerPort = await server.getContainerPort()
    const bind = await server.getBindings(name)
    const env = await server.getEnvironment()
    const rest = await server.getRestConfig()
    const cache = `--mount source=sma-server-cache,target=${dockerServerRoot}/cache`
    const eula = `-e MINECRAFT_EULA_ACCEPTED=${eulaAccepted}`
    const testMode =
        options.test || (await server.getTestMode()) ? `-e TEST_MODE=true` : ''
    const dockerImage = await server.getDockerImage()
    const requireDebug = options.verbose ? '-e DEBUG_REQUIRE=true' : ''

    console.log(`Starting ${serverType} server on port ${port}...`)
    if (serverType === 'nukkit') {
        containerPort += '/udp'
    }
    const logging = '--log-opt max-size=2m --logopt max-file=10'
    try {
        const dc = `run -d -t -p ${port}:${containerPort} -p ${rest.port}:${
            rest.port
        } --name ${name} ${logging} ${env} ${eula} ${bind} ${cache} ${testMode} ${requireDebug} --restart always  ${dockerImage}:${tag}`
        await docker.command(dc)
        console.log(
            chalk.yellow(`Server ${name} started on localhost:${port}\n`)
        )
        logOutCommand(dc)
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

function logOutCommand(dc: string) {
    console.log('Start command:')
    const startCommand = dc.split('--')

    const final = startCommand.pop() || ''
    const initialLines = startCommand.map(s => `${s} \\`).join('\n\t--')

    const finalLine = final ? `\n\t --${final}` : ''
    console.log(chalk.gray(`${initialLines}${finalLine}`))
}
