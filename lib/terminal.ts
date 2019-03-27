import axios from 'axios'
import { startServer, stopServer } from '../commands'
import { commandMap as commands } from '../commands/commandMap.'
import { server } from './server'
import { exit } from './util/exit'

export function startTerminal(serverTarget: string, started = false) {
    const readline = require('readline')
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    })

    rl.on('line', function(line) {
        const isSmacCommand = line.indexOf('smac ') === 0
        if (isSmacCommand) {
            return processSmacCommand(
                line.split('smac ')[1],
                serverTarget,
                started
            )
        } else sendCommand(line)
    })
}

async function processSmacCommand(
    command: string,
    target: string,
    started: boolean
) {
    if (command === commands.stop.name) {
        await stopServer(target)
        return exit(0)
    }
    /* Need to handle `smac logs` from a different dir
        So, write a JSON config when starting
    */
    if (command === commands.restart.name) {
        await stopServer(target)
        if (started) {
            await startServer(target)
        } else {
            console.log(
                'Cannot reliably restart server from log command. Restart it manually.'
            )
            exit()
        }
    }
}

async function sendCommand(command: string) {
    const rest = await server.getRestConfig()
    const url = `http://localhost:${
        rest.port
    }/remoteExecuteCommand?command=${command}&apikey=${rest.password}`
    try {
        axios.get(url)
    } catch (error) {
        console.log(`The call to ${url} failed with error: ${error}`)
        return false
    }
}
