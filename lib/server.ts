import fs from 'fs-extra'
import { Maybe, Nothing, Result } from 'ghetto-monad'
import * as path from 'path'

export interface SMAServerConfig {
    dockerTag: string
    port: string
    serverName: string
    worlds: string[]
    javaPlugins: string[]
}

let ServerConfig: Maybe<Result<SMAServerConfig>>

export async function getServerName(serverTarget?: string) {
    if (serverTarget) {
        return new Result(serverTarget)
    }
    const conf = await getServerConfig()
    if (conf.isNothing) {
        return conf
    } else {
        return new Result(conf.value.serverName)
    }
}

export async function getDockerTag() {
    const conf = await getServerConfig()
    if (conf.isNothing || !conf.value.dockerTag) {
        return 'latest'
    } else {
        return conf.value.dockerTag
    }
}

export async function getPort() {
    const conf = await getServerConfig()
    if (conf.isNothing || !conf.value.port) {
        return '25565'
    } else {
        return conf.value.port
    }
}

export async function getServerConfig() {
    if (ServerConfig) {
        return ServerConfig
    }
    const cwd = process.cwd()
    const pkgPath = path.join(cwd, 'package.json')
    if (!fs.existsSync(pkgPath)) {
        console.log(`No package.json found at ${pkgPath}`)
        ServerConfig = new Nothing()
        return ServerConfig
    }
    const md = await import(pkgPath)
    if (!md.smaServerConfig) {
        console.log('No smaServerConfig key found in package.json')
        ServerConfig = new Nothing()
        return ServerConfig
    }
    ServerConfig = new Result<SMAServerConfig>(md.smaServerConfig)
    return ServerConfig
}
