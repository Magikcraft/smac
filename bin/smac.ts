#!/usr/bin/env node
const commandLineArgs = require('command-line-args')

import * as fs from 'fs-extra'
import * as commands from '../commands'
import { commandMap } from '../commands/commandMap'
import * as docker from '../lib/docker'
import { smaPath } from '../lib/paths'
import { exit } from '../lib/util/exit'

if (!fs.existsSync(smaPath('./'))) fs.mkdirpSync(smaPath('./'))

if (!docker.isDockerInstalled) {
    console.log(
        'Docker not found. Please install Docker from https://www.docker.com.'
    )
    process.exit(1)
}

/* first - parse the main command */
const mainDefinitions = [{ name: 'command', defaultOption: true }]
const mainOptions = commandLineArgs(mainDefinitions, {
    stopAtFirstUnknown: true,
})
const argv = mainOptions._unknown || []

// console.log('mainOptions\n===========')
// console.log(mainOptions)

/* second - parse the start command options */
if (mainOptions.command === commandMap.start.name) {
    const startDefinitions = commandMap.start.startDefinitions
    const startOptions = commandLineArgs(startDefinitions, { argv })

    // console.log('\nstartOptions\n============')
    // console.log(startOptions)
    commands.startServer(startOptions)
} else if (mainOptions.command === commandMap.stop.name) {
    const stopDefinitions = commandMap.stop.stopDefinitions
    const stopOptions = commandLineArgs(stopDefinitions, { argv })
    console.log(stopOptions)
    commands.stopServer(stopOptions)
} else {
    const command = process.argv[2]

    if (!command || !commandMap[command]) {
        commands.printHelp()
        exit()
    } else processCommand(command)
}
export function processCommand(command: string, target?: string) {
    if (command === commandMap.stop.name) {
        commands.stopServer(target || process.argv[3])
    }
    if (command === commandMap.status.name) {
        commands.getStatus()
    }
    if (command === commandMap.list.name) {
        commands.listContainers()
    }
    if (command === commandMap.info.name) {
        commands.inspectContainer(target)
    }
    if (command === commandMap.logs.name) {
        if (!target) {
            // do not allow to be run from log viewer terminal
            commands.viewLogs()
        }
    }
    if (!command || !commandMap[command]) {
        commands.printHelp()
    }
}
