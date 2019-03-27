import columnify from 'columnify'
import { header, version } from '../lib/util/version'
import { commandMap } from './commandMap.'

export function printHelp() {
    console.log(header)
    console.log(`Version ${version}`)
    console.log('\nUsage:')
    console.log('smac <command>')
    console.log('\nAvailable commands:')

    const commandList = Object.keys(commandMap).map(c => ({
        command: [c],
        description: commandMap[c].description,
    }))

    console.log(columnify(commandList))
}
