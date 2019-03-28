import * as fs from 'fs-extra'
import prompt from 'prompt'
import { smaPath } from './paths'

export async function checkEula() {
    const eulaPath = smaPath('eula.json')
    if (!fs.existsSync(eulaPath)) {
        return promptEula(eulaPath)
    } else {
        try {
            const { accepted } = fs.readJSONSync(eulaPath)
            return accepted
        } catch (e) {
            return false
        }
    }
    return false
}

async function promptEula(eulaPath) {
    return new Promise(resolve => {
        console.log('You must accept the Minecraft EULA to proceed.')
        console.log(
            ' The full text is available at https://account.mojang.com/documents/minecraft_eula'
        )
        const schema = {
            properties: {
                accept: {
                    description: 'Accept the Minecraft EULA (Y/n)',
                    default: 'Y',
                    type: 'string',
                    conform: v =>
                        v.length === 1 && ['y', 'n'].includes(v.toLowerCase()),
                    required: true,
                },
            },
        }
        prompt.message = ''
        prompt.start()
        prompt.get(schema, function(err, result) {
            if (result.accept.toLowerCase() === 'y') {
                console.log('Accepted Minecraft EULA')
                fs.writeJSONSync(eulaPath, { accepted: true })
                return resolve(true)
            } else return resolve(false)
        })
    })
}
