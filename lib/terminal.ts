import ansiEscapes from 'ansi-escapes'
import axios from 'axios'
import prompt from 'prompt'
import { startServer, stopServer } from '../commands'
import { commandMap as commands } from '../commands/commandMap.'
import { server } from './server'
import { exit } from './util/exit'

export function startTerminal(serverTarget: string, started = false) {
    const schema = {
        properties: {
            command: {
                description: 'Command >',
                default: '',
                type: 'string',
                required: true,
            },
        },
    }
    prompt.message = ''
    prompt.start()
    prompt.get(schema, function(err, result) {
        console.log(result)
        if (result && result.command) {
            const command = result.command
            const isSmacCommand = command.indexOf('smac ') === 0
            if (isSmacCommand) {
                return processSmacCommand(
                    command.split('smac ')[1],
                    serverTarget,
                    started
                )
            } else sendCommand(command)
        }
        startTerminal(serverTarget, started)
    })
}

export function _startTerminal(serverTarget: string, started = false) {
    const readline = require('readline')
    let line
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    })
    if (process.stdin.isTTY) {
        process.stdin.setRawMode!(true)
    }

    readline.emitKeypressEvents(process.stdin, rl)
    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            exit(serverTarget)
        } else if (key.name === 'left') {
            process.stdout.write(
                ansiEscapes.cursorBackward() + ansiEscapes.cursorLeft
            )
        } else if (key.name === 'right') {
            process.stdout.write(ansiEscapes.cursorForward())
        } else if (key.name === 'return') {
            const isSmacCommand = line.indexOf('smac ') === 0
            if (isSmacCommand) {
                return processSmacCommand(
                    line.split('smac ')[1],
                    serverTarget,
                    started
                )
            } else sendCommand(line)
        } else {
            process.stdout.write(str)
            line += str
        }
        // console.log(key)
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
        return exit()
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
