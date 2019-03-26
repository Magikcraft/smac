"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const extract_zip_1 = __importDefault(require("extract-zip"));
const fs = __importStar(require("fs-extra"));
const ghetto_monad_1 = require("ghetto-monad");
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const progress_1 = __importDefault(require("progress"));
const request_1 = __importDefault(require("request"));
const request_progress_1 = __importDefault(require("request-progress"));
const rimraf_1 = __importDefault(require("rimraf"));
const url_1 = __importDefault(require("url"));
const util_1 = __importDefault(require("util"));
const gitHubIssuesUrl = 'https://github.com/Magikcraft/scriptcraft-sma/issues';
function downloadZipFile(worldSpec, targetPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const tmpPath = findSuitableTempDirectory(worldSpec.name);
        if (tmpPath.isNothing) {
            return tmpPath;
        }
        const fileName = worldSpec.downloadUrl.split('/').pop();
        const downloadedFile = path_1.default.join(tmpPath.value, fileName || worldSpec.name);
        if (fs.existsSync(downloadedFile)) {
            console.log('Worlds already downloaded as', downloadedFile);
        }
        else {
            console.log(`Downloading world ${worldSpec.name}`);
            console.log('Downloading', worldSpec.downloadUrl);
            console.log('Saving to', downloadedFile);
            const download = yield requestWorldZip(getRequestOptions(worldSpec), downloadedFile);
            if (download.isNothing || download.isError) {
                return download;
            }
        }
        const source = yield extractDownload(downloadedFile);
        if (source.isError || source.isNothing) {
            return source;
        }
        const worldPath = yield copyIntoPlace(source.value, targetPath);
        return worldPath;
    });
}
exports.downloadZipFile = downloadZipFile;
function findSuitableTempDirectory(worldName) {
    var now = Date.now();
    var candidateTmpDirs = [
        process.env.npm_config_tmp,
        os_1.default.tmpdir(),
        path_1.default.join(process.cwd(), 'tmp'),
    ];
    for (var i = 0; i < candidateTmpDirs.length; i++) {
        var candidatePath = candidateTmpDirs[i];
        if (!candidatePath)
            continue;
        try {
            candidatePath = path_1.default.join(path_1.default.resolve(candidatePath), worldName);
            //@ts-ignore
            fs.mkdirsSync(candidatePath, '0777');
            // Make double sure we have 0777 permissions; some operating systems
            // default umask does not allow write by default.
            fs.chmodSync(candidatePath, '0777');
            var testFile = path_1.default.join(candidatePath, now + '.tmp');
            fs.writeFileSync(testFile, 'test');
            fs.unlinkSync(testFile);
            return new ghetto_monad_1.Result(candidatePath);
        }
        catch (e) {
            console.log(candidatePath, 'is not writable:', e.message);
        }
    }
    console.error('Can not find a writable tmp directory, please report issue ' +
        `on ${gitHubIssuesUrl} with as much ` +
        'information as possible.');
    return new ghetto_monad_1.Nothing();
}
function requestWorldZip(requestOptions, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            const writePath = filePath + '-download-' + Date.now();
            console.log('Receiving...');
            var bar = null;
            request_progress_1.default(request_1.default(requestOptions, (error, response, body) => {
                console.log('');
                if (!error && response.statusCode === 200) {
                    fs.writeFileSync(writePath, body);
                    console.log('Received ' +
                        Math.floor(body.length / 1024) +
                        'K total.');
                    fs.renameSync(writePath, filePath);
                    resolve(new ghetto_monad_1.Result(filePath));
                }
                else if (response) {
                    console.error('Error requesting archive.\n' +
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
                        gitHubIssuesUrl);
                    resolve(new ghetto_monad_1.Nothing());
                }
                else {
                    resolve(handleRequestError(error));
                }
            }))
                .on('progress', function (state) {
                try {
                    if (!bar) {
                        bar = new progress_1.default('  [:bar] :percent', {
                            total: state.size.total,
                            width: 40,
                        });
                    }
                    bar.curr = state.size.transferred;
                    bar.tick();
                }
                catch (e) {
                    // It doesn't really matter if the progress bar doesn't update.
                }
            })
                .on('error', handleRequestError);
        });
    });
}
function getRequestOptions(worldSpec) {
    let strictSSL = !!process.env.npm_config_strict_ssl;
    if (process.version == 'v0.10.34') {
        console.log('Node v0.10.34 detected, turning off strict ssl due to https://github.com/joyent/node/issues/8894');
        strictSSL = false;
    }
    const options = {
        uri: worldSpec.downloadUrl,
        encoding: null,
        followRedirect: true,
        headers: {},
        strictSSL: strictSSL,
    };
    const proxyUrl = process.env.npm_config_https_proxy ||
        process.env.npm_config_http_proxy ||
        process.env.npm_config_proxy;
    if (proxyUrl) {
        // Print using proxy
        var proxy = url_1.default.parse(proxyUrl);
        if (proxy.auth) {
            // Mask password
            proxy.auth = proxy.auth.replace(/:.*$/, ':******');
        }
        console.log('Using proxy ' + url_1.default.format(proxy));
        // Enable proxy
        options.proxy = proxyUrl;
    }
    // Use the user-agent string from the npm config
    options.headers['User-Agent'] = process.env.npm_config_user_agent;
    // Use certificate authority settings from npm
    let ca = process.env.npm_config_ca;
    if (!ca && process.env.npm_config_cafile) {
        try {
            ca = fs
                .readFileSync(process.env.npm_config_cafile, {
                encoding: 'utf8',
            })
                .split(/\n(?=-----BEGIN CERTIFICATE-----)/g);
            // Comments at the beginning of the file result in the first
            // item not containing a certificate - in this case the
            // download will fail
            if (ca.length > 0 && !/-----BEGIN CERTIFICATE-----/.test(ca[0])) {
                ca.shift();
            }
        }
        catch (e) {
            console.error('Could not read cafile', process.env.npm_config_cafile, e);
        }
    }
    if (ca) {
        console.log('Using npmconf ca');
        options.agentOptions = {
            ca: ca,
        };
        options.ca = ca;
    }
    return options;
}
exports.getRequestOptions = getRequestOptions;
function extractDownload(filePath) {
    return new Promise((resolve, reject) => {
        // extract to a unique directory in case multiple processes are
        // installing and extracting at once
        const extractedPath = filePath + '-extract-' + Date.now();
        var options = { cwd: extractedPath };
        // @ts-ignore
        fs.mkdirsSync(extractedPath, '0777');
        // Make double sure we have 0777 permissions; some operating systems
        // default umask does not allow write by default.
        fs.chmodSync(extractedPath, '0777');
        if (filePath.substr(-4) === '.zip') {
            console.log('Extracting zip contents');
            extract_zip_1.default(path_1.default.resolve(filePath), { dir: extractedPath }, function (err) {
                if (err) {
                    console.error('Error extracting zip');
                    resolve(new ghetto_monad_1.ErrorResult(err));
                }
                else {
                    resolve(new ghetto_monad_1.Result(extractedPath));
                }
            });
        }
    });
}
exports.extractDownload = extractDownload;
function handleRequestError(error) {
    if (error &&
        error.stack &&
        error.stack.indexOf('SELF_SIGNED_CERT_IN_CHAIN') != -1) {
        console.error('Error making request, SELF_SIGNED_CERT_IN_CHAIN. ' +
            'Please read https://github.com/Medium/phantomjs#i-am-behind-a-corporate-proxy-that-uses-self-signed-ssl-certificates-to-intercept-encrypted-traffic');
        return new ghetto_monad_1.ErrorResult(new Error('SSL Error during download'));
    }
    else if (error) {
        console.error('Error making request.\n' +
            error.stack +
            '\n\n' +
            `Please report this full log at ${gitHubIssuesUrl}`);
        return new ghetto_monad_1.ErrorResult(new Error());
    }
    else {
        console.error('Something unexpected happened, please report this full ' +
            `log at ${gitHubIssuesUrl}`);
        return new ghetto_monad_1.ErrorResult(new Error());
    }
}
function copyIntoPlace(extractedPath, targetPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const rm = util_1.default.promisify(rimraf_1.default);
        console.log('Removing', targetPath);
        try {
            yield rm(targetPath);
            // Look for the extracted directory, so we can rename it.
            console.log(`Copying extracted worlds to ${targetPath}`);
            yield fs.move(extractedPath, targetPath, {
                overwrite: true,
            });
        }
        catch (error) {
            console.log('Error copying ' + extractedPath + ' to ' + targetPath);
            console.log(error);
            return new ghetto_monad_1.ErrorResult(error);
        }
        console.log('Copied worlds to ' + targetPath);
        return new ghetto_monad_1.Result(targetPath);
    });
}
