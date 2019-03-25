import extractZip from 'extract-zip'
import * as fs from 'fs-extra'
import { ErrorResult, Nothing, Result } from 'ghetto-monad'
import os from 'os'
import path from 'path'
import progress from 'progress'
import request from 'request'
import requestProgress from 'request-progress'
import rmrf from 'rimraf'
import url from 'url'
import util from 'util'
import { WorldDefinition } from './server'

const gitHubIssuesUrl = 'https://github.com/Magikcraft/scriptcraft-sma/issues'

export async function downloadZipFile(
    worldSpec: WorldDefinition,
    targetPath: string
) {
    const tmpPath = findSuitableTempDirectory()
    if (tmpPath.isNothing) {
        return tmpPath
    }
    const fileName = worldSpec.downloadUrl.split('/').pop()
    const downloadedFile = path.join(tmpPath.value, fileName!)
    if (fs.existsSync(downloadedFile)) {
        console.log('Worlds already downloaded as', downloadedFile)
    } else {
        console.log(`Downloading world ${name}`)
        console.log('Downloading', worldSpec.downloadUrl)
        console.log('Saving to', downloadedFile)
        const download = await requestWorldZip(
            getRequestOptions(worldSpec),
            downloadedFile
        )
        if (download.isNothing || download.isError) {
            return download
        }
    }
    const source = await extractDownload(downloadedFile)
    if (source.isError || source.isNothing) {
        return source
    }
    const worldPath = await copyIntoPlace(source.value, targetPath)
    return worldPath
}

function findSuitableTempDirectory() {
    var now = Date.now()
    var candidateTmpDirs = [
        process.env.npm_config_tmp,
        os.tmpdir(),
        path.join(process.cwd(), 'tmp'),
    ]

    for (var i = 0; i < candidateTmpDirs.length; i++) {
        var candidatePath = candidateTmpDirs[i]
        if (!candidatePath) continue

        try {
            candidatePath = path.join(path.resolve(candidatePath), 'mct1')
            //@ts-ignore
            fs.mkdirsSync(candidatePath, '0777')
            // Make double sure we have 0777 permissions; some operating systems
            // default umask does not allow write by default.
            fs.chmodSync(candidatePath, '0777')
            var testFile = path.join(candidatePath, now + '.tmp')
            fs.writeFileSync(testFile, 'test')
            fs.unlinkSync(testFile)
            return new Result(candidatePath)
        } catch (e) {
            console.log(candidatePath, 'is not writable:', e.message)
        }
    }

    console.error(
        'Can not find a writable tmp directory, please report issue ' +
            `on ${gitHubIssuesUrl} with as much ` +
            'information as possible.'
    )
    return new Nothing()
}

async function requestWorldZip(
    requestOptions,
    filePath
): Promise<Result<string> | ErrorResult<Error> | Nothing> {
    return new Promise(resolve => {
        const writePath = filePath + '-download-' + Date.now()

        console.log('Receiving...')
        var bar = null as any
        requestProgress(
            request(requestOptions, (error, response, body) => {
                console.log('')
                if (!error && response.statusCode === 200) {
                    fs.writeFileSync(writePath, body)
                    console.log(
                        'Received ' +
                            Math.floor(body.length / 1024) +
                            'K total.'
                    )
                    fs.renameSync(writePath, filePath)
                    resolve(new Result(filePath))
                } else if (response) {
                    console.error(
                        'Error requesting archive.\n' +
                            'Status: ' +
                            response.statusCode +
                            '\n' +
                            'Request options: ' +
                            JSON.stringify(requestOptions, null, 2) +
                            '\n' +
                            'Response headers: ' +
                            JSON.stringify(response.headers, null, 2) +
                            '\n' +
                            'Make sure your network and proxy settings are correct.\n\n' +
                            'If you continue to have issues, please report this full log at ' +
                            gitHubIssuesUrl
                    )
                    resolve(new Nothing())
                } else {
                    resolve(handleRequestError(error))
                }
            })
        )
            .on('progress', function(state) {
                try {
                    if (!bar) {
                        bar = new progress('  [:bar] :percent', {
                            total: state.size.total,
                            width: 40,
                        })
                    }
                    bar.curr = state.size.transferred
                    bar.tick()
                } catch (e) {
                    // It doesn't really matter if the progress bar doesn't update.
                }
            })
            .on('error', handleRequestError)
    })
}

export function getRequestOptions(worldSpec) {
    let strictSSL = !!process.env.npm_config_strict_ssl
    if (process.version == 'v0.10.34') {
        console.log(
            'Node v0.10.34 detected, turning off strict ssl due to https://github.com/joyent/node/issues/8894'
        )
        strictSSL = false
    }

    const options = {
        uri: worldSpec.downloadUrl,
        encoding: null, // Get response as a buffer
        followRedirect: true, // The default download path redirects to a CDN URL.
        headers: {},
        strictSSL: strictSSL,
    } as any

    const proxyUrl =
        process.env.npm_config_https_proxy ||
        process.env.npm_config_http_proxy ||
        process.env.npm_config_proxy
    if (proxyUrl) {
        // Print using proxy
        var proxy = url.parse(proxyUrl)
        if (proxy.auth) {
            // Mask password
            proxy.auth = proxy.auth.replace(/:.*$/, ':******')
        }
        console.log('Using proxy ' + url.format(proxy))

        // Enable proxy
        options.proxy = proxyUrl
    }

    // Use the user-agent string from the npm config
    options.headers['User-Agent'] = process.env.npm_config_user_agent

    // Use certificate authority settings from npm
    let ca = process.env.npm_config_ca as any
    if (!ca && process.env.npm_config_cafile) {
        try {
            ca = fs
                .readFileSync(process.env.npm_config_cafile, {
                    encoding: 'utf8',
                })
                .split(/\n(?=-----BEGIN CERTIFICATE-----)/g)

            // Comments at the beginning of the file result in the first
            // item not containing a certificate - in this case the
            // download will fail
            if (ca!.length > 0 && !/-----BEGIN CERTIFICATE-----/.test(ca[0])) {
                ca.shift()
            }
        } catch (e) {
            console.error(
                'Could not read cafile',
                process.env.npm_config_cafile,
                e
            )
        }
    }

    if (ca) {
        console.log('Using npmconf ca')
        options.agentOptions = {
            ca: ca,
        }
        options.ca = ca
    }

    return options
}

export function extractDownload(
    filePath
): Promise<ErrorResult<Error> | Result<string>> {
    return new Promise((resolve, reject) => {
        // extract to a unique directory in case multiple processes are
        // installing and extracting at once
        const extractedPath = filePath + '-extract-' + Date.now()
        var options = { cwd: extractedPath }
        // @ts-ignore
        fs.mkdirsSync(extractedPath, '0777')
        // Make double sure we have 0777 permissions; some operating systems
        // default umask does not allow write by default.
        fs.chmodSync(extractedPath, '0777')

        if (filePath.substr(-4) === '.zip') {
            console.log('Extracting zip contents')
            extractZip(path.resolve(filePath), { dir: extractedPath }, function(
                err
            ) {
                if (err) {
                    console.error('Error extracting zip')
                    resolve(new ErrorResult(err))
                } else {
                    resolve(new Result(extractedPath))
                }
            })
        }
    })
}

function handleRequestError(error) {
    if (
        error &&
        error.stack &&
        error.stack.indexOf('SELF_SIGNED_CERT_IN_CHAIN') != -1
    ) {
        console.error(
            'Error making request, SELF_SIGNED_CERT_IN_CHAIN. ' +
                'Please read https://github.com/Medium/phantomjs#i-am-behind-a-corporate-proxy-that-uses-self-signed-ssl-certificates-to-intercept-encrypted-traffic'
        )
        return new ErrorResult(new Error('SSL Error during download'))
    } else if (error) {
        console.error(
            'Error making request.\n' +
                error.stack +
                '\n\n' +
                `Please report this full log at ${gitHubIssuesUrl}`
        )
        return new ErrorResult(new Error())
    } else {
        console.error(
            'Something unexpected happened, please report this full ' +
                `log at ${gitHubIssuesUrl}`
        )
        return new ErrorResult(new Error())
    }
}

async function copyIntoPlace(extractedPath: string, targetPath: string) {
    const rm = util.promisify(rmrf)
    console.log('Removing', targetPath)
    try {
        await rm(targetPath)
        // Look for the extracted directory, so we can rename it.
        console.log(`Copying extracted worlds to ${targetPath}`)
        await fs.move(extractedPath, targetPath, {
            overwrite: true,
        })
    } catch (error) {
        console.log('Error copying ' + extractedPath + ' to ' + targetPath)
        console.log(error)
        return new ErrorResult(error)
    }
    console.log('Copied worlds to ' + targetPath)
    return new Result(targetPath)
}
