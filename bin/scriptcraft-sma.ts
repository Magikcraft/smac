#!/usr/bin/env node

import chalk from 'chalk'
import columnify from 'columnify'
import { ErrorResult, Result } from 'ghetto-monad'
import { commands } from '../lib/commands'
import { docker, isDockerInstalled } from '../lib/docker'
import { localPath, pluginsPath, worldsPath } from '../lib/paths'
import {
    getCustomBindings,
    getDockerTag,
    getPort,
    getServerName,
} from '../lib/server'
import { doUpdateCheck, version } from '../lib/updateCheck'
import { getInstalledWorlds, hasWorlds } from '../lib/worlds'

if (!isDockerInstalled) {
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
    console.log(`Version ${version}`)
    console.log('\nUsage:')
    console.log('sma <command>')
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
    if (command === commands.inspect.name) {
        inspectContainer()
    }
    if (command === commands.logs.name) {
        viewLogs()
    }
}

async function viewLogs() {
    const name = await nameNeeded()
    const data = await docker.command(`logs ${name}`)
    console.log(data.raw)
    return
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
    const name = await getServerName(serverTarget)
    if (name.isNothing) {
        return (exit(1) as unknown) as string
    } else {
        return name.value
    }
}

async function getContainerStatus(name: string) {
    try {
        const data = await docker.command(`inspect ${name}`)
        const w = await getInstalledWorlds()
        const worlds = w.isNothing ? [] : w.value
        return new Result(
            Object.assign(data.object[0].State, {
                worlds,
            })
        )
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
    // getWorldsIfNeeded()
    // installJSPluginsIfNeeded()
    // installJavaPluginsIfNeeded()
    const data = await getContainerStatus(name)
    if (!data.isError) {
        if (data.value.Status === 'running') {
            console.log('Server is already running.')
            exit()
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
    const tag = await getDockerTag()
    const port = await getPort()
    const bind = await getBindings(name)
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

async function getBindings(name) {
    const mount = (src, dst) =>
        `--mount type=bind,src=${src},dst=/server/${dst}`
    const worlds = (await hasWorlds()) ? mount(worldsPath(), 'worlds') : ``
    const plugins = mount(pluginsPath(), 'scriptcraft-plugins')
    const bindings = (await getCustomBindings())
        .map(({ src, dst }) => mount(localPath(src), dst))
        .join(' ')
    return `${worlds} ${plugins} ${bindings}`
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
