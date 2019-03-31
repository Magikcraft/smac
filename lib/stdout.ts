import { StdoutController } from 'custom.stdout'
import { Writable } from 'stream'
const stdout = new StdoutController(process.stdout)

export const CustomStd = (name?: string) =>
    Object.assign(
        new Writable({
            write(chunk, encoding, callback) {
                // console.log(
                //     { name },
                //     chunk.toString(),
                //     { encoding },
                //     { callback }
                // )
                stdout.out(chunk.toString(), name)
                callback()
            },
        })
    )
