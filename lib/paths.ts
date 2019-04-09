import { homedir } from 'os'
import * as path from 'path'

export const dockerServerRoot = `/_server_`

const home = homedir()

const cwd = process.cwd()

export const smaPath = p => path.join(home, '.sma', p)

export const localPath = p => path.join(cwd, p)

export const localWorldsPath = () => localPath('worlds')

export const smaWorldsPath = () => smaPath('worlds')

export const localWorldPath = p => path.join(localWorldsPath(), p)
export const smaWorldPath = p => path.join(smaWorldsPath(), p)

export const pluginsPath = () => localPath('node_modules')
