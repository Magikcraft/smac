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
var chalk_1 = __importDefault(require("chalk"));
var fs = __importStar(require("fs-extra"));
var ghetto_monad_1 = require("ghetto-monad");
var path = __importStar(require("path"));
var docker = __importStar(require("./docker"));
var paths_1 = require("./paths");
var worlds_1 = require("./worlds");
var Server = /** @class */ (function () {
    function Server() {
        this.serverConfig = this.getServerConfig();
    }
    Server.prototype.getServerName = function (serverTarget) {
        return __awaiter(this, void 0, void 0, function () {
            var conf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (serverTarget) {
                            return [2 /*return*/, new ghetto_monad_1.Result(serverTarget)];
                        }
                        return [4 /*yield*/, this.getServerConfig()];
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
    };
    Server.prototype.getBindings = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var worlds, plugins, bindings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWorldMounts()];
                    case 1:
                        worlds = _a.sent();
                        plugins = docker.makeMount(paths_1.pluginsPath(), 'scriptcraft-plugins');
                        return [4 /*yield*/, this.getCustomBindings()];
                    case 2:
                        bindings = (_a.sent())
                            .map(function (_a) {
                            var src = _a.src, dst = _a.dst;
                            return docker.makeMount(paths_1.localPath(src), dst);
                        })
                            .join(' ');
                        return [2 /*return*/, worlds + " " + plugins + " " + bindings];
                }
            });
        });
    };
    Server.prototype.getWorldMounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var localMounts, smaMounts, allMounts, _i, smaMounts_1, smaMount, existingMount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        localMounts = this.getLocalWorldMounts();
                        return [4 /*yield*/, this.getSmaWorldMounts()
                            // Make them unique - prefer local
                        ];
                    case 1:
                        smaMounts = _a.sent();
                        allMounts = {};
                        localMounts.map(function (_a) {
                            var src = _a.src, dst = _a.dst;
                            allMounts[dst] = { src: src, dst: dst };
                        });
                        for (_i = 0, smaMounts_1 = smaMounts; _i < smaMounts_1.length; _i++) {
                            smaMount = smaMounts_1[_i];
                            // Do we need to scan these dirs?
                            console.log("Found: " + smaMount.src);
                            existingMount = allMounts[smaMount.dst];
                            if (existingMount) {
                                if (smaMount.src !== existingMount.src) {
                                    console.log(chalk_1.default.redBright("Duplicate worlds found at " + smaMount.src + " and " + existingMount.src));
                                    console.log(chalk_1.default.yellowBright("Using world from " + existingMount.src));
                                }
                            }
                            else {
                                allMounts[smaMount.dst] = smaMount;
                            }
                        }
                        if (Object.keys(allMounts).length > 0) {
                            console.log("Loading the following worlds:");
                        }
                        return [2 /*return*/, Object.keys(allMounts)
                                .map(function (m) {
                                console.log(allMounts[m]);
                                var r = docker.makeMount(allMounts[m].src, allMounts[m].dst);
                                return r;
                            })
                                .join(' ')];
                }
            });
        });
    };
    Server.prototype.getLocalWorldMounts = function () {
        var mountData = function (name, path) { return ({
            src: path + "/" + name,
            dst: "worlds/" + name,
        }); };
        var localPath = paths_1.localWorldsPath();
        console.log('Scanning local directory:', localPath);
        if (fs.existsSync(localPath)) {
            var dirs = fs.readdirSync(localPath);
            return dirs.map(function (name) {
                console.log('Found:', path.join(localPath, name));
                var m = mountData(name, localPath);
                return m;
            });
        }
        return [];
    };
    Server.prototype.getSmaWorldMounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mountData, worldDefs, worlds, smaMounts, _loop_1, _i, worlds_2, world, state_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mountData = function (name, path) { return ({
                            src: path + "/" + name,
                            dst: "worlds/" + name,
                        }); };
                        console.log('Checking world definitions in package.json');
                        return [4 /*yield*/, this.getWorldDefinitions()];
                    case 1:
                        worldDefs = _a.sent();
                        if (worldDefs.isNothing) {
                            console.log('None found.');
                            return [2 /*return*/, []];
                        }
                        worlds = worldDefs.value.map(function (d) { return new worlds_1.World(d); });
                        smaMounts = [];
                        _loop_1 = function (world) {
                            var path_1, dirs;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, world.getPath()];
                                    case 1:
                                        path_1 = _a.sent();
                                        if (!path_1.isNothing && !path_1.isError) {
                                            if (fs.existsSync(path_1.value)) {
                                                dirs = fs.readdirSync(path_1.value);
                                                dirs.map(function (name) {
                                                    smaMounts = smaMounts.concat([mountData(name, path_1.value)]);
                                                });
                                                return [2 /*return*/, { value: smaMounts }];
                                            }
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, worlds_2 = worlds;
                        _a.label = 2;
                    case 2:
                        if (!(_i < worlds_2.length)) return [3 /*break*/, 5];
                        world = worlds_2[_i];
                        return [5 /*yield**/, _loop_1(world)];
                    case 3:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        if (smaMounts.length != worlds.length) {
                            console.log(chalk_1.default.red('WARNING: Some worlds specified in the Worlds definition are not available.'));
                        }
                        return [2 /*return*/, smaMounts];
                }
            });
        });
    };
    Server.prototype.getDockerTag = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getServerConfig()];
                    case 1:
                        conf = _a.sent();
                        if (conf.isNothing || !conf.value.dockerTag) {
                            return [2 /*return*/, Server.defaultDockerTag];
                        }
                        else {
                            return [2 /*return*/, conf.value.dockerTag];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Server.prototype.getPort = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getServerConfig()];
                    case 1:
                        conf = _a.sent();
                        if (conf.isNothing || !conf.value.port) {
                            return [2 /*return*/, Server.defaultPort];
                        }
                        else {
                            return [2 /*return*/, conf.value.port];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Server.prototype.getCustomBindings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getServerConfig()];
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
    };
    Server.prototype.getServerConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cwd, pkgPath, md;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.serverConfig) {
                            return [2 /*return*/, this.serverConfig];
                        }
                        cwd = process.cwd();
                        pkgPath = path.join(cwd, 'package.json');
                        if (!fs.existsSync(pkgPath)) {
                            console.log("No package.json found at " + pkgPath);
                            return [2 /*return*/, new ghetto_monad_1.Nothing()];
                        }
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(pkgPath)); })];
                    case 1:
                        md = _a.sent();
                        if (!md.smaServerConfig) {
                            console.log('No smaServerConfig key found in package.json');
                            return [2 /*return*/, new ghetto_monad_1.Nothing()];
                        }
                        return [2 /*return*/, new ghetto_monad_1.Result(md.smaServerConfig)];
                }
            });
        });
    };
    Server.prototype.getWorldDefinitions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getServerConfig()];
                    case 1:
                        conf = _a.sent();
                        if (conf.isNothing || !conf.value.worlds) {
                            return [2 /*return*/, new ghetto_monad_1.Nothing()];
                        }
                        else {
                            return [2 /*return*/, new ghetto_monad_1.Result(conf.value.worlds)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Server.defaultPort = 25565;
    Server.defaultDockerTag = 'latest';
    return Server;
}());
exports.server = new Server();
