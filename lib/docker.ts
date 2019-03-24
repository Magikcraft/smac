import { exec } from 'child_process'
import { Docker, Options } from 'docker-cli-js'

const options = new Options(undefined, __dirname)
export const docker = new Docker(options)

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
