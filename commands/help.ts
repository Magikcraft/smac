import columnify from 'columnify'
import { commandMap } from '../lib/commandMap.'
import { header, version } from '../lib/util/version'

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
