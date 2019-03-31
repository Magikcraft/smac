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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmxvYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkb3dubG9hZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhEQUFvQztBQUNwQyw2Q0FBOEI7QUFDOUIsK0NBQTJEO0FBQzNELDRDQUFtQjtBQUNuQixnREFBdUI7QUFDdkIsd0RBQStCO0FBQy9CLHNEQUE2QjtBQUM3Qix3RUFBOEM7QUFDOUMsb0RBQXlCO0FBQ3pCLDhDQUFxQjtBQUNyQixnREFBdUI7QUFHdkIsTUFBTSxlQUFlLEdBQUcsc0RBQXNELENBQUE7QUFFOUUsU0FBc0IsZUFBZSxDQUNqQyxTQUEwQixFQUMxQixVQUFrQjs7UUFFbEIsTUFBTSxPQUFPLEdBQUcseUJBQXlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3pELElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUNuQixPQUFPLE9BQU8sQ0FBQTtTQUNqQjtRQUNELE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ3ZELE1BQU0sY0FBYyxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzNFLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLGNBQWMsQ0FBQyxDQUFBO1NBQzlEO2FBQU07WUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtZQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDakQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsY0FB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