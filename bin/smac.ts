#!/usr/bin/env node

import chalk from 'chalk'
import { spawn } from 'child_process'
import columnify from 'columnify'
import { ErrorResult, Result } from 'ghetto-monad'
import { commands } from '../lib/commands'
import * as docker from '../lib/docker'
import { colorise } from '../lib/log'
import { server } from '../lib/server'
import { doUpdateCheck, version } from '../lib/updateCheck'

if (!docker.isDockerInstalled) {
    console.log(
        'Docker not found. Please install Docker from https://www.docker.com.'
    )
    process.exit(1)
}

const header = chalk.green('\nScriptcraft SMA - by Magikcraft.io\n')

const command = process.argv[2]
const serverTarget = process.argv[3]

if (!command || !commands[command]) {
    printHelp()
    exit()
}

processCommand(command)

function printHelp() {
    console.log(header)
    console.log(`Version ${version}`)
    console.log('\nUsage:')
    console.log('smac <command>')
    console.log('\nAvailable commands:')

    const commandList = Object.keys(commands).map(c => ({
        command: [c],
        description: commands[c].description,
    }))

    console.log(columnify(commandList))
}

function processCommand(command) {
    if (command === commands.start.name) {
        startServer()
    }
    if (command === commands.stop.name) {
        stopServer()
    }
    if (command === commands.status.name) {
        getStatus()
    }
    if (command === commands.version.name) {
        printVersions()
    }
    if (command === commands.list.name) {
        listContainers()
    }
    if (command === commands.info.name) {
        inspectContainer()
    }
    if (command === commands.logs.name) {
        viewLogs()
    }
}

async function viewLogs() {
    const name = await nameNeeded()
    const isRunning = await getContainerStatus(name)
    if (isRunning.isError) {
        console.log(isRunning.error.message)
        exit()
    }
    console.log('Spawning log viewer')
    process.on('SIGINT', () => {
        console.log(
            chalk.yellow(`\n\nServer ${name} is still running. Use '`) +
                chalk.blue(`smac stop ${name}`) +
                chalk.yellow(' to stop it.')
        )
        exit(0)
    })
    const log = spawn('docker', ['logs', '-f', name])

    log.stdout!.on('data', d => {
        const lines = colorise(d.toString())
        process.stdout.write(lines)
    })
}

async function inspectContainer() {
    const name = await nameNeeded()
    const status = await getContainerStatus(name)
    if (status.isError) {
        console.log(status.error.message)
        return exit(0)
    }
    console.log(chalk.blue(`${name}:`))
    console.log(status.value)
    const data = await docker.command(`inspect ${name}`)
    // console.log(data.object[0].State)
    console.log(chalk.blue('Container Mounts:'))
    console.log(data.object[0].Mounts)
    console.log(chalk.blue('Network:'))
    console.log(data.object[0].NetworkSettings.Ports)
    exit()
}

function listContainers() {
    docker.command('ps').then(function(data) {
        const smaServers = data.containerList
            .filter(c => c.image.indexOf('magikcraft/scriptcraft') === 0)
            .map(c => ({ name: c.names, status: c.status }))
        console.log(`${header}\n`)
        console.log(columnify(smaServers))
    })
}

function printVersions() {
    // return Promise.resolve()
    //     .then(getLocalWorldsMetadata)
    //     .then(({ version }) => {
    //         const worldsVersion = version === '0.0.0' ? 'Not found' : version
    //         const mct1Version = pluginVersion()
    //         const serverVersion = pkg.version
    //         console.log(header)
    //         console.log(`Server version: ${serverVersion}`)
    //         console.log(`Worlds Version: ${worldsVersion}`)
    //         console.log(`Plugin version: ${mct1Version}`)
    //         console.log(`\nWorlds dir: ${mct1WorldDir}`)
    //         console.log(`Plugin dir: ${mct1PluginDir}`)
    //         return true
    //     })
    //     .then(exit)
}

async function nameNeeded() {
    const name = await server.getServerName(serverTarget)
    if (name.isNothing) {
        return (exit(1) as unknown) as string
    } else {
        return name.value
    }
}

async function getContainerStatus(name: string) {
    try {
        const data = await docker.command(`inspect ${name}`)
        return new Result({
            State: data.object[0].State,
            Mounts: data.object[0].Mounts,
            ...data.object[0].NetworkSettings.Ports,
        })
    } catch (e) {
        return new ErrorResult(new Error(`Server ${name} is not running`))
    }
}

async function getStatus() {
    const name = await nameNeeded()
    const status = await getContainerStatus(name)
    if (status.isError) {
        console.log(status.error.message)
        return exit()
    }
    console.log(status.value)
}

async function startServer() {
    const name = await nameNeeded()

    // @TODO
    // installJSPluginsIfNeeded()
    // installJavaPluginsIfNeeded()
    const data = await getContainerStatus(name)
    if (!data.isError) {
        if (data.value.Status === 'running') {
            console.log('Server is already running.')
            return exit()
        }
        if (data.value.Status === 'created') {
            console.log(
                'Server has been created, but is not running. Trying waiting, or stopping it.'
            )
            console.log(
                `If that doesn't work - check if this issue has been reported at https://github.com/Magikcraft/scriptcraft-sma/issues`
            )
            return exit()
        }
        if (data.value.Status === 'exited') {
            return removeStoppedInstance(name)
        }
        if (data.value.Status === 'paused') {
            await restartPausedContainer(name)
            await getStatus()
            exit()
        }
    }
    console.log(`Starting ${name}`)
    await startNewInstance(name)
    viewLogs()
}

function restartPausedContainer(name) {
    console.log(`Unpausing ${name}`)
    return docker.command(`unpause ${name}`)
}

// function getWorldsIfNeeded() {
//     return Promise.resolve().then(() => mct1WorldsExistLocally() || getWorlds())
// }

// function installPluginIfNeeded() {
//     Promise.resolve().then(() => pluginExists() || copyPlugin())
// }

async function startNewInstance(name) {
    const tag = await server.getDockerTag()
    const port = await server.getPort()
    const bind = await server.getBindings(name)
    const cache = `--mount source=sma-server-cache,target=/server/cache`
    try {
        const dc = `run -d -p ${port}:25565 --name ${name} ${bind} ${cache} --restart always magikcraft/scriptcraft:${tag}`
        await docker.command(dc)
        console.log(
            chalk.yellow(`Server ${name} started on localhost:${port}\n`)
        )
        console.log(dc)
    } catch (e) {
        console.log('There was an error starting the server!')
        console.log(e)
        console.log(
            `\nTry stopping the server, then starting it again.\n\nIf that doesn't work - check if this issue has been reported at https://github.com/Magikcraft/scriptcraft-sma/issues`
        )
    }
}

async function stopServer() {
    const name = await nameNeeded()
    const data = await getContainerStatus(name)
    if (data.isError) {
        console.log(data.error.message)
        return exit()
    }
    if (data.value.Status === 'exited') {
        await removeStoppedInstance(name)
        exit()
    }
    console.log(`Shutting down ${name}...`)

    await stopRunningInstance(name)
    await removeStoppedInstance(name)
}

async function exit(code = 0) {
    if (code === 1) {
        console.log(
            `No SMA Server package.json found in current directory, and no name specified`
        )
    }
    await doUpdateCheck()
    process.exit()
}

async function stopRunningInstance(name) {
    await docker.command(`stop ${name}`)
}

async function removeStoppedInstance(name) {
    console.log('Removing stopped container')
    await docker.command(`rm ${name}`)
}
