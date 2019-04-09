import chalk from 'chalk'
import * as fs from 'fs-extra'
import { Maybe, Nothing, Result } from 'ghetto-monad'
import * as path from 'path'
import * as docker from './docker'
import { Binder } from './docker'
import { localPath, localWorldsPath } from './paths'
import { World } from './worlds'

type ServerType = 'bukkit' | 'nukkit'

class Server {
    static defaultServerType: ServerType = 'bukkit'
    static defaultPort = {
        bukkit: 25565,
        nukkit: 19132,
    }
    static defaultDockerTag = 'latest'
    static defaultMemory = 2048
    static restPort = 8086
    static restPassword = 'INSECURE'
    static defaultDockerImage = 'magikcraft/scriptcraft'

    private serverConfig!: Promise<Maybe<Result<SMAServerConfig>>>
    binder: docker.Binder
    filename = 'package.json'
    serverType!: ServerType

    constructor() {
        this.binder = new Binder()
    }

    async getServerTargetFromPackageJson() {
        const conf = await this.getServerConfig()
        if (conf.isNothing) {
            return new Nothing()
        } else {
            return new Result(conf.value.serverName)
        }
    }

    async getNodeModulesBinding() {
        const conf = await this.getServerConfig()
        if (conf.isNothing) {
            return new Nothing()
        } else {
            console.log(`Bind node_modules: ${conf.value.node_modules}`)
            return new Result(conf.value.node_modules)
        }
    }

    createNodeModuleBindings() {
        const modules = fs.readdirSync('node_modules')
        const nsPackage = m => {
            const isNamespacedPackage = m && m.indexOf('@') === 0
            if (isNamespacedPackage) {
                const pkgs = fs.readdirSync(`node_modules/${m}`)
                return pkgs
                    .map(p =>
                        this.binder.makeMount(
                            localPath(`node_modules/${m}/${p}`),
                            `scriptcraft-plugins/${m}/${p}`
                        )
                    )
                    .join(' ')
            }
            return this.binder.makeMount(
                localPath(`node_modules/${m}`),
                `scriptcraft-plugins/${m}`
            )
        }
        if (modules.length > 0) {
            return modules.map(nsPackage).join(' ')
        }
        return ''
    }

    async getBindings(name) {
        const worlds = await this.getWorldMounts()

        const bindings = (await this.getCustomBindings())
            .map(({ src, dst }) => this.binder.makeMount(localPath(src), dst))
            .join(' ')
        const mountNodeModules = await this.getNodeModulesBinding()
        const nodeModules =
            !mountNodeModules.isNothing && mountNodeModules.value
                ? this.createNodeModuleBindings()
                : ``
        console.log('Found bindings in config:')
        console.log(bindings)
        return `${worlds} ${bindings} ${nodeModules}`
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
                const r = this.binder.makeMount(
                    allMounts[m].src,
                    allMounts[m].dst
                )
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
        console.log(`Checking world definitions in ${this.filename}`)
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

    async getServerType() {
        const conf = await this.getServerConfig()
        if (conf.isNothing || !conf.value.serverType) {
            return Server.defaultServerType
        } else {
            return conf.value.serverType
        }
    }

    async getDockerImage() {
        const serverType = await this.getServerType()
        if (serverType === 'bukkit') {
            return docker.images.bukkit
        }
        if (serverType === 'nukkit') {
            return docker.images.nukkit
        }
        return docker.images.bukkit
    }

    async getContainerPort() {
        const serverType = await this.getServerType()
        return Server.defaultPort[serverType]
    }

    async getExposedPort() {
        const conf = await this.getServerConfig()
        if (conf.isNothing || !conf.value.port) {
            return this.getContainerPort()
        } else {
            return conf.value.port
        }
    }

    async getMemoryConfig() {
        const conf = await this.getServerConfig()
        if (conf.isNothing || !conf.value.memory) {
            return Server.defaultMemory
        } else {
            return conf.value.memory
        }
    }

    async getRestConfig(): Promise<RestConfig> {
        const conf = await this.getServerConfig()
        const defaultConfig = {
            port: Server.restPort,
            password: Server.restPassword,
        }

        if (conf.isNothing || !conf.value.restEndpoint) {
            return defaultConfig
        } else {
            return { ...defaultConfig, ...conf.value.restEndpoint }
        }
    }

    async getEnvironment() {
        const memory = await this.getMemoryConfig()
        const restConfig = await this.getRestConfig()
        const env = [] as any
        env.push(`-e SERVERMEM=${memory}`)
        env.push(`-e MINECRAFT_REST_CONSOLE_PORT=${restConfig.port}`)
        env.push(`-e MINECRAFT_REST_CONSOLE_API_KEY=${restConfig.password}`)
        return env.join(' ')
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
        const pkgPath = path.join(cwd, this.filename)
        if (!fs.existsSync(pkgPath)) {
            this.serverConfig = Promise.resolve(new Nothing())
            return new Nothing()
        }
        const md = await import(pkgPath)
        if (!md.smaServerConfig) {
            this.serverConfig = Promise.resolve(new Nothing())
            return new Nothing()
        }
        this.serverConfig = Promise.resolve(
            new Result<SMAServerConfig>(md.smaServerConfig)
        )

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
    dockerTag: string // default: 'latest'
    serverType: ServerType // default: 'bukkit'
    port: string // default: 25565
    serverName: string
    worlds: WorldDefinition[]
    javaPlugins: string[]
    bind: { src: string; dst: string }[]
    memory: number
    restEndpoint: RestConfig
    node_modules: boolean
}

export interface RestConfig {
    port: number
    password: string
}

export interface WorldDefinition {
    version: string
    name: string
    downloadUrl: string
}
