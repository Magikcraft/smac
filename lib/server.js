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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs-extra"));
var ghetto_monad_1 = require("ghetto-monad");
var path = __importStar(require("path"));
var ServerConfig;
function getServerName(serverTarget) {
    return __awaiter(this, void 0, void 0, function () {
        var conf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (serverTarget) {
                        return [2 /*return*/, new ghetto_monad_1.Result(serverTarget)];
                    }
                    return [4 /*yield*/, getServerConfig()];
                case 1:
                    conf = _a.sent();
                    if (conf.isNothing) {
                        return [2 /*return*/, conf];
                    }
                    else {
                        return [2 /*return*/, new ghetto_monad_1.Result(conf.value.serverName)];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.getServerName = getServerName;
function getDockerTag() {
    return __awaiter(this, void 0, void 0, function () {
        var conf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getServerConfig()];
                case 1:
                    conf = _a.sent();
                    if (conf.isNothing || !conf.value.dockerTag) {
                        return [2 /*return*/, 'latest'];
                    }
                    else {
                        return [2 /*return*/, conf.value.dockerTag];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.getDockerTag = getDockerTag;
function getPort() {
    return __awaiter(this, void 0, void 0, function () {
        var conf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getServerConfig()];
                case 1:
                    conf = _a.sent();
                    if (conf.isNothing || !conf.value.port) {
                        return [2 /*return*/, '25565'];
                    }
                    else {
                        return [2 /*return*/, conf.value.port];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.getPort = getPort;
function getCustomBindings() {
    return __awaiter(this, void 0, void 0, function () {
        var conf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getServerConfig()];
                case 1:
                    conf = _a.sent();
                    if (conf.isNothing || !conf.value.bind) {
                        return [2 /*return*/, []];
                    }
                    else {
                        return [2 /*return*/, conf.value.bind];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.getCustomBindings = getCustomBindings;
function getServerConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var cwd, pkgPath, md;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (ServerConfig) {
                        return [2 /*return*/, ServerConfig];
                    }
                    cwd = process.cwd();
                    pkgPath = path.join(cwd, 'package.json');
                    if (!fs.existsSync(pkgPath)) {
                        console.log("No package.json found at " + pkgPath);
                        ServerConfig = new ghetto_monad_1.Nothing();
                        return [2 /*return*/, ServerConfig];
                    }
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(pkgPath)); })];
                case 1:
                    md = _a.sent();
                    if (!md.smaServerConfig) {
                        console.log('No smaServerConfig key found in package.json');
                        ServerConfig = new ghetto_monad_1.Nothing();
                        return [2 /*return*/, ServerConfig];
                    }
                    ServerConfig = new ghetto_monad_1.Result(md.smaServerConfig);
                    return [2 /*return*/, ServerConfig];
            }
        });
    });
}
exports.getServerConfig = getServerConfig;
