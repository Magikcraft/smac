import fs from 'fs-extra'
import { Nothing, Result } from 'ghetto-monad'
import { worldsPath } from './paths'

export async function getInstalledWorlds() {
    const worldDir = worldsPath()
    if (!fs.existsSync(worldDir)) {
        return new Nothing()
    }
    return new Result(fs.readdirSync(worldDir))
}

export async function hasWorlds() {
    return !(await getInstalledWorlds()).isNothing
}
