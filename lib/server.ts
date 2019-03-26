import chalk from 'chalk'
import * as fs from 'fs-extra'
import { Maybe, Nothing, Result } from 'ghetto-monad'
import * as path from 'path'
import * as docker from './docker'
import { localPath, localWorldsPath, pluginsPath } from './paths'
import { World } from './worlds'

class Server {
    static defaultPort = 25565
    static defaultDockerTag = 'latest'
    serverConfig: Promise<Maybe<Result<SMAServerConfig>>>

    constructor() {
        this.serverConfig = this.getServerConfig()
    }

    async getServerName(serverTarget?: string) {
        if (serverTarget) {
            return new Result(serverTarget)
        }
        const conf = await this.getServerConfig()
        if (conf.isNothing) {
            return conf
        } else {
            return new Result(conf.value.serverName)
        }
    }

    async getBindings(name) {
        const worlds = await this.getWorldMounts()
        const nodeModules = fs.existsSync(pluginsPath())
            ? docker.makeMount(pluginsPath(), 'scriptcraft-plugins')
            : ''
        const bindings = (await this.getCustomBindings())
            .map(({ src, dst }) => docker.makeMount(localPath(src), dst))
            .join(' ')
        console.log('Found bindings in config:')
        console.log(bindings)
        return `${worlds} ${nodeModules} ${bindings}`
    }

    private async getWorldMounts() {
        // Check for worlds in the local worlds folder
        const localMounts = this.getLocalWorldMounts()

        // Parse worldDefinitions and make mounts
        const smaMounts = await this.getSmaWorldMounts()

        // Make them unique - prefer local
        const allMounts = {} as {
            [index: string]: { src: string; dst: string }
        }
        localMounts.map(({ src, dst }) => {
            allMounts[dst] = { src, dst }
        })
        for (const smaMount of smaMounts) {
            // Do we need to scan these dirs?
            console.log(`Found: ${smaMount.src}`)
            const existingMount = allMounts[smaMount.dst]
            if (existingMount) {
                if (smaMount.src !== existingMount.src) {
                    console.log(
                        chalk.redBright(
                            `Duplicate worlds found at ${smaMount.src} and ${
                                existingMount.src
                            }`
                        )
                    )
                    console.log(
                        chalk.yellowBright(
                            `Using world from ${existingMount.src}`
                        )
                    )
                }
            } else {
                allMounts[smaMount.dst] = smaMount
            }
        }
        if (Object.keys(allMounts).length > 0) {
            console.log(`Loading the following worlds:`)
        }
        return Object.keys(allMounts)
            .map(m => {
                console.log(allMounts[m])
                const r = docker.makeMount(allMounts[m].src, allMounts[m].dst)
                return r
            })
            .join(' ')
    }

    private getLocalWorldMounts() {
        const mountData = (name, path) => ({
            src: `${path}/${name}`,
            dst: `worlds/${name}`,
        })
        const localPath = localWorldsPath()
        console.log('Scanning local directory:', localPath)
        if (fs.existsSync(localPath)) {
            const dirs = fs.readdirSync(localPath)
            return dirs.map(name => {
                console.log('Found:', path.join(localPath, name))
                const m = mountData(name, localPath)
                return m
            })
        }
        return []
    }

    private async getSmaWorldMounts() {
        const mountData = (name, path) => ({
            src: `${path}/${name}`,
            dst: `worlds/${name}`,
        })
        console.log('Checking world definitions in package.json')
        const worldDefs = await this.getWorldDefinitions()
        if (worldDefs.isNothing) {
            console.log('None found.')
            return []
        }
        const worlds = worldDefs.value.map(d => new World(d))
        let smaMounts = [] as { src: string; dst: string }[]
        for (const world of worlds) {
            const path = await world.getPath()
            if (!path.isNothing && !path.isError) {
                if (fs.existsSync(path.value)) {
                    const dirs = fs.readdirSync(path.value)
                    dirs.map(name => {
                        smaMounts = [...smaMounts, mountData(name, path.value)]
                    })
                    return smaMounts
                }
            }
        }
        if (smaMounts.length != worlds.length) {
            console.log(
                chalk.red(
                    'WARNING: Some worlds specified in the Worlds definition are not available.'
                )
            )
        }
        return smaMounts
    }

    async getDockerTag() {
        const conf = await this.getServerConfig()
        if (conf.isNothing || !conf.value.dockerTag) {
            return Server.defaultDockerTag
        } else {
            return conf.value.dockerTag
        }
    }

    async getPort() {
        const conf = await this.getServerConfig()
        if (conf.isNothing || !conf.value.port) {
            return Server.defaultPort
        } else {
            return conf.value.port
        }
    }

    private async getCustomBindings() {
        const conf = await this.getServerConfig()
        if (conf.isNothing || !conf.value.bind) {
            return []
        } else {
            return conf.value.bind
        }
    }

    private async getServerConfig() {
        if (this.serverConfig) {
            return this.serverConfig
        }
        const cwd = process.cwd()
        const pkgPath = path.join(cwd, 'package.json')
        if (!fs.existsSync(pkgPath)) {
            console.log(`No package.json found at ${pkgPath}`)
            return new Nothing()
        }
        const md = await import(pkgPath)
        if (!md.smaServerConfig) {
            console.log('No smaServerConfig key found in package.json')
            return new Nothing()
        }
        return new Result<SMAServerConfig>(md.smaServerConfig)
    }

    private async getWorldDefinitions() {
        const conf = await this.getServerConfig()
        if (conf.isNothing || !conf.value.worlds) {
            return new Nothing()
        } else {
            return new Result(conf.value.worlds)
        }
    }
}

export const server = new Server()

export interface SMAServerConfig {
    dockerTag: string
    port: string
    serverName: string
    worlds: WorldDefinition[]
    javaPlugins: string[]
    bind: { src: string; dst: string }[]
}

export interface WorldDefinition {
    version: string
    name: string
    downloadUrl: string
}
