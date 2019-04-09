import { exec } from 'child_process'
import { Docker, Options } from 'docker-cli-js'
import { dockerServerRoot } from './paths'

const options = new Options(undefined, __dirname)
const docker = new Docker(options)

export const images = {
    bukkit: 'magikcraft/scriptcraft',
    nukkit: 'magikcraft/nukkitcraft',
}
// @TODO: deal with namespaced modules
export class Binder {
    mounts: { [index: string]: string } = {}
    constructor() {}
    makeMount = (src, dst) => {
        if (this.mounts[dst]) {
            console.warn('Duplicate bind detected:')
            console.warn(`Using:`)
            console.warn({ dst: this.mounts[dst], src })
            console.log(`NOT Using:`)
            console.log({ dst, src })
            return ''
        }
        this.mounts[dst] = src
        return `--mount type=bind,src=${src},dst=${dockerServerRoot}/${dst}`
    }
}

export const command = cmd => docker.command(cmd)

export function isDockerInstalled() {
    return new Promise(resolve => {
        exec('docker', {}, function(error) {
            if (error) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}
