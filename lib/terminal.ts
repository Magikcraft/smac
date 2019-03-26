import axios from 'axios'
import { server } from './server'

export function startTerminal() {
    const readline = require('readline')
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    })

    rl.on('line', function(line) {
        sendCommand(line)
    })
}

async function sendCommand(command: string) {
    const rest = await server.getRestConfig()
    const url = `http://localhost:${
        rest.port
    }/remoteExecuteCommand?command=${command}&apikey=${rest.password}`
    try {
        console.log((await axios.get(url)).data)
    } catch (error) {
        console.log(`The call to ${url} failed with error: ${error}`)
        return false
    }
}
