import columnify from 'columnify'
import * as docker from '../lib/docker'
import { header } from '../lib/util/version'

export async function getContainerList() {
    const data = await docker.command('ps')
    return data.containerList
        .filter(
            c =>
                c.image.indexOf('magikcraft/scriptcraft') === 0 ||
                c.image.indexOf('magikcraft/nukkitcraft') === 0
        )
        .map(c => ({ name: c.names, status: c.status }))
}

export async function listContainers() {
    const smaServers = await getContainerList()
    console.log(`${header}`)
    if (smaServers.length > 0) {
        console.log(columnify(smaServers))
    } else {
        console.log('No servers running.')
    }
}
