#!/usr/bin/env node
import * as commands from '../commands'
import { commandMap } from '../lib/commandMap.'
import * as docker from '../lib/docker'
import { exit } from '../lib/util/exit'

if (!docker.isDockerInstalled) {
    console.log(
        'Docker not found. Please install Docker from https://www.docker.com.'
    )
    process.exit(1)
}

const command = process.argv[2]

if (!command || !commandMap[command]) {
    commands.printHelp()
    exit()
}

processCommand(command)

function processCommand(command) {
    if (command === commandMap.start.name) {
        commands.startServer()
    }
    if (command === commandMap.stop.name) {
        commands.stopServer()
    }
    if (command === commandMap.status.name) {
        commands.getStatus()
    }
    if (command === commandMap.list.name) {
        commands.listContainers()
    }
    if (command === commandMap.info.name) {
        commands.inspectContainer()
    }
    if (command === commandMap.logs.name) {
        commands.viewLogs()
    }
}
