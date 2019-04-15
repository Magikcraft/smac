import axios from 'axios'
import * as inquirer from 'inquirer'
import * as ts from 'typescript'
import { TypeScriptSimple } from 'typescript-simple'
import { processCommand } from '../bin/smac'
import { server } from './server'
import { SignalRef } from './SignalRef'
import { CustomStd } from './stdout'
import { exit } from './util/exit'
import { CommandPrompt } from './util/inquirer-command-prompt'

let tsMode = false

const tss = new TypeScriptSimple(
    {
        module: ts.ModuleKind.CommonJS,
        noImplicitAny: false,
        //target: 1, //ts.ScriptTarget.ES5,
        removeComments: true,
        // typeRoots: [],
    },
    false
)
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
            message: tsMode ? 'TS >' : '>',
            // optional
            autoCompletion: [
                'js ',
                'ts ',
                'ts on',
                'ts off',
                'smac',
                'mv',
                'help',
                'smac stop',
            ],
            context: 0,
            short: false,
            default: previousLine,
        },
    ] as any)
    if (answers && answers.cmd) {
        const command = (answers.cmd || '').trimLeft()
        if (command == 'ts on') {
            tsMode = true
        } else if (command == 'ts off') {
            tsMode = false
        } else {
            const isTSCommand =
                (tsMode || command.indexOf(`ts `) === 0) &&
                command !== 'smac stop'
            const isSmacCommand =
                command.indexOf('smac ') === 0 ||
                (command.indexOf('smac') === 0 && command.length === 4)
            if (isTSCommand) {
                const ts =
                    command.indexOf(`ts `) === 0
                        ? command.split('ts ')[1]
                        : command
                sendTSCommand(ts)
            } else if (isSmacCommand) {
                processCommand(command.split('smac ')[1], serverTarget)
            } else sendCommand(command)
            previousLine = command
        }
    }
}

async function sendTSCommand(spell: string) {
    try {
        const js = tss.compile(spell)
        console.log(js)
        sendCommand(`js ${js}`)
    } catch (e) {
        console.log(e.message)
    }
}

async function sendCommand(command: string) {
    const rest = await server.getRestConfig()
    const url = `http://localhost:${
        rest.port
    }/remoteExecuteCommand?command=${encodeURIComponent(command)}&apikey=${
        rest.password
    }`
    try {
        await axios.get(url)
    } catch (error) {
        console.log(`The call to ${url} failed with error: ${error}`)
        return false
    }
}
