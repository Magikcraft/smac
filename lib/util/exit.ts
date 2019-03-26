import { doUpdateCheck } from '../updateCheck'

export async function exit(code = 0) {
    if (code === 1) {
        console.log(
            `No name specified, and no SMA Server package.json found in current directory.`
        )
    }
    await doUpdateCheck()
    process.exit()
}
