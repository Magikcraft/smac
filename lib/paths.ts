import * as path from 'path'

const cwd = process.cwd()

export const localPath = p => path.join(cwd, p)

export const worldsPath = () => localPath('worlds')

export const pluginsPath = () => localPath('node_modules')
