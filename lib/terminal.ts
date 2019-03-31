import axios from 'axios'
import * as inquirer from 'inquirer'
import { processCommand } from '../bin/smac'
import { server } from './server'
import { SignalRef } from './SignalRef'
import { CustomStd } from './stdout'
import { exit } from './util/exit'
import { CommandPrompt } from './util/inquirer-command-prompt'

let previousLine: string = ''

const promptStdout = CustomStd('prompt') // Not working with inquirer and command history, yet

const prompt = inquirer.createPromptModule({
    output: process.stdout, //promptStdout,
})
const commandPromptWithHistory = prompt.registerPrompt(
    'command',
    CommandPrompt as any
)

export async function startTerminal(serverTarget: string, started = false) {
    // Workaround for https://github.com/SBoudrias/Inquirer.js/issues/293#issuecomment-422890996
    new SignalRef('SIGINT', async () => await exit(serverTarget))
    while (true) {
        await inquire(serverTarget, started)
    }
}

async function inquire(serverTarget, started) {
    const answers = await prompt<{ cmd: string }>([
        {
            type: 'command',
            name: 'cmd',
            message: '>',
            // optional
            autoCompletion: ['js', 'smac', 'mv', 'help', 'smac stop'],
            context: 0,
            short: false,
            default: previousLine,
        },
    ] as any)
    if (answers && answers.cmd) {
        const command = answers.cmd
        const isSmacCommand =
            command.indexOf('smac ') === 0 ||
            (command.indexOf('smac') === 0 && command.length === 4)
        if (isSmacCommand) {
            processCommand(command.split('smac ')[1], serverTarget)
        } else sendCommand(command)
        previousLine = command
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
