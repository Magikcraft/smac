"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var extract_zip_1 = __importDefault(require("extract-zip"));
var fs = __importStar(require("fs-extra"));
var ghetto_monad_1 = require("ghetto-monad");
var os_1 = __importDefault(require("os"));
var path_1 = __importDefault(require("path"));
var progress_1 = __importDefault(require("progress"));
var request_1 = __importDefault(require("request"));
var request_progress_1 = __importDefault(require("request-progress"));
var rimraf_1 = __importDefault(require("rimraf"));
var url_1 = __importDefault(require("url"));
var util_1 = __importDefault(require("util"));
var gitHubIssuesUrl = 'https://github.com/Magikcraft/scriptcraft-sma/issues';
function downloadZipFile(worldSpec, targetPath) {
    return __awaiter(this, void 0, void 0, function () {
        var tmpPath, fileName, downloadedFile, download, source, worldPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tmpPath = findSuitableTempDirectory(worldSpec.name);
                    if (tmpPath.isNothing) {
                        return [2 /*return*/, tmpPath];
                    }
                    fileName = worldSpec.downloadUrl.split('/').pop();
                    downloadedFile = path_1.default.join(tmpPath.value, fileName || worldSpec.name);
                    if (!fs.existsSync(downloadedFile)) return [3 /*break*/, 1];
                    console.log('Worlds already downloaded as', downloadedFile);
                    return [3 /*break*/, 3];
                case 1:
                    console.log("Downloading world " + worldSpec.name);
                    console.log('Downloading', worldSpec.downloadUrl);
                    console.log('Saving to', downloadedFile);
                    return [4 /*yield*/, requestWorldZip(getRequestOptions(worldSpec), downloadedFile)];
                case 2:
                    download = _a.sent();
                    if (download.isNothing || download.isError) {
                        return [2 /*return*/, download];
                    }
                    _a.label = 3;
                case 3: return [4 /*yield*/, extractDownload(downloadedFile)];
                case 4:
                    source = _a.sent();
                    if (source.isError || source.isNothing) {
                        return [2 /*return*/, source];
                    }
                    return [4 /*yield*/, copyIntoPlace(source.value, targetPath)];
                case 5:
                    worldPath = _a.sent();
                    return [2 /*return*/, worldPath];
            }
        });
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
        ("on " + gitHubIssuesUrl + " with as much ") +
        'information as possible.');
    return new ghetto_monad_1.Nothing();
}
function requestWorldZip(requestOptions, filePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    var writePath = filePath + '-download-' + Date.now();
                    console.log('Receiving...');
                    var bar = null;
                    request_progress_1.default(request_1.default(requestOptions, function (error, response, body) {
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
                })];
        });
    });
}
function getRequestOptions(worldSpec) {
    var strictSSL = !!process.env.npm_config_strict_ssl;
    if (process.version == 'v0.10.34') {
        console.log('Node v0.10.34 detected, turning off strict ssl due to https://github.com/joyent/node/issues/8894');
        strictSSL = false;
    }
    var options = {
        uri: worldSpec.downloadUrl,
        encoding: null,
        followRedirect: true,
        headers: {},
        strictSSL: strictSSL,
    };
    var proxyUrl = process.env.npm_config_https_proxy ||
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
    var ca = process.env.npm_config_ca;
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
    return new Promise(function (resolve, reject) {
        // extract to a unique directory in case multiple processes are
        // installing and extracting at once
        var extractedPath = filePath + '-extract-' + Date.now();
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
            ("Please report this full log at " + gitHubIssuesUrl));
        return new ghetto_monad_1.ErrorResult(new Error());
    }
    else {
        console.error('Something unexpected happened, please report this full ' +
            ("log at " + gitHubIssuesUrl));
        return new ghetto_monad_1.ErrorResult(new Error());
    }
}
function copyIntoPlace(extractedPath, targetPath) {
    return __awaiter(this, void 0, void 0, function () {
        var rm, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rm = util_1.default.promisify(rimraf_1.default);
                    console.log('Removing', targetPath);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, rm(targetPath)
                        // Look for the extracted directory, so we can rename it.
                    ];
                case 2:
                    _a.sent();
                    // Look for the extracted directory, so we can rename it.
                    console.log("Copying extracted worlds to " + targetPath);
                    return [4 /*yield*/, fs.move(extractedPath, targetPath, {
                            overwrite: true,
                        })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.log('Error copying ' + extractedPath + ' to ' + targetPath);
                    console.log(error_1);
                    return [2 /*return*/, new ghetto_monad_1.ErrorResult(error_1)];
                case 5:
                    console.log('Copied worlds to ' + targetPath);
                    return [2 /*return*/, new ghetto_monad_1.Result(targetPath)];
            }
        });
    });
}
