import * as fs from 'fs-extra'
import { Nothing, Result } from 'ghetto-monad'
import { downloadZipFile } from './download'
import { localWorldPath, smaWorldPath } from './paths'
import { WorldDefinition } from './server'

export class World {
    worldSpec: WorldDefinition
    constructor(worldSpec: WorldDefinition) {
        this.worldSpec = worldSpec
    }

    async getPath() {
        const worldExistsLocally = targetPath => fs.existsSync(targetPath)
        const worldDir = `${this.worldSpec.name}/${this.worldSpec.version}`
        const localPath = localWorldPath(worldDir)
        const smaPath = smaWorldPath(worldDir)
        if (worldExistsLocally(localPath)) {
            return new Result(localPath)
        }
        if (worldExistsLocally(smaPath)) {
            return new Result(smaPath)
        }
        if (!this.worldSpec.downloadUrl) {
            console.log(
                `World ${this.worldSpec.name} version ${
                    this.worldSpec.version
                } not found locally, and no downloadUrl specified.`
            )
            console.log('Searched in:')
            console.log(`${localPath}`)
            console.log(`${smaPath}`)
            return new Nothing()
        }
        return downloadZipFile(this.worldSpec, smaPath)
    }
}
