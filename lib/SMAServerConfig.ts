import { ServerType } from './server'
export interface SMAServerConfig {
    dockerTag: string // default: 'latest'
    serverType: ServerType // default: 'bukkit'
    port: string // default: 25565
    testMode: boolean
    serverName: string
    worlds: WorldDefinition[]
    javaPlugins: string[]
    bind: {
        src: string
        dst: string
    }[]
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
