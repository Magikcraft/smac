#!/usr/bin/env node
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
var child_process_1 = require("child_process");
var columnify_1 = __importDefault(require("columnify"));
var ghetto_monad_1 = require("ghetto-monad");
var commands_1 = require("../lib/commands");
var docker_1 = require("../lib/docker");
var log_1 = require("../lib/log");
var paths_1 = require("../lib/paths");
var server = __importStar(require("../lib/server"));
var updateCheck_1 = require("../lib/updateCheck");
var worlds_1 = require("../lib/worlds");
if (!docker_1.isDockerInstalled) {
    console.log('Docker not found. Please install Docker from https://www.docker.com.');
    process.exit(1);
}
var header = chalk_1.default.green('\nScriptcraft SMA - by Magikcraft.io\n');
var command = process.argv[2];
var serverTarget = process.argv[3];
if (!command || !commands_1.commands[command]) {
    printHelp();
    exit();
}
processCommand(command);
function printHelp() {
    console.log(header);
    console.log("Version " + updateCheck_1.version);
    console.log('\nUsage:');
    console.log('smac <command>');
    console.log('\nAvailable commands:');
    var commandList = Object.keys(commands_1.commands).map(function (c) { return ({
        command: [c],
        description: commands_1.commands[c].description,
    }); });
    console.log(columnify_1.default(commandList));
}
function processCommand(command) {
    if (command === commands_1.commands.start.name) {
        startServer();
    }
    if (command === commands_1.commands.stop.name) {
        stopServer();
    }
    if (command === commands_1.commands.status.name) {
        getStatus();
    }
    if (command === commands_1.commands.version.name) {
        printVersions();
    }
    if (command === commands_1.commands.list.name) {
        listContainers();
    }
    if (command === commands_1.commands.info.name) {
        inspectContainer();
    }
    if (command === commands_1.commands.logs.name) {
        viewLogs();
    }
}
function viewLogs() {
    return __awaiter(this, void 0, void 0, function () {
        var name, isRunning, data, log;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, nameNeeded()];
                case 1:
                    name = _a.sent();
                    return [4 /*yield*/, getContainerStatus(name)];
                case 2:
                    isRunning = _a.sent();
                    if (isRunning.isError) {
                        console.log(isRunning.error.message);
                        exit();
                    }
                    console.log('Spawning log viewer');
                    return [4 /*yield*/, docker_1.docker.command("logs " + name)];
                case 3:
                    data = _a.sent();
                    console.log(log_1.colorise(data.raw));
                    process.on('SIGINT', function () {
                        console.log(chalk_1.default.yellow("\n\nServer " + name + " is still running. Use '") +
                            chalk_1.default.blue("smac stop " + name) +
                            chalk_1.default.yellow(' to stop it.'));
                        exit(0);
                    });
                    log = child_process_1.spawn('docker', ['logs', '-f', name]);
                    log.stdout.on('data', function (d) { return process.stdout.write(log_1.colorise(d.toString())); });
                    return [2 /*return*/];
            }
        });
    });
}
function inspectContainer() {
    return __awaiter(this, void 0, void 0, function () {
        var name, status, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, nameNeeded()];
                case 1:
                    name = _a.sent();
                    return [4 /*yield*/, getContainerStatus(name)];
                case 2:
                    status = _a.sent();
                    if (status.isError) {
                        console.log(status.error.message);
                        return [2 /*return*/, exit(0)];
                    }
                    console.log(chalk_1.default.blue(name + ":"));
                    console.log(status.value);
                    return [4 /*yield*/, docker_1.docker.command("inspect " + name)
                        // console.log(data.object[0].State)
                    ];
                case 3:
                    data = _a.sent();
                    // console.log(data.object[0].State)
                    console.log(chalk_1.default.blue('Container Mounts:'));
                    console.log(data.object[0].Mounts);
                    console.log(chalk_1.default.blue('Network:'));
                    console.log(data.object[0].NetworkSettings.Ports);
                    exit();
                    return [2 /*return*/];
            }
        });
    });
}
function listContainers() {
    docker_1.docker.command('ps').then(function (data) {
        var smaServers = data.containerList
            .filter(function (c) { return c.image.indexOf('magikcraft/scriptcraft') === 0; })
            .map(function (c) { return ({ name: c.names, status: c.status }); });
        console.log(header + "\n");
        console.log(columnify_1.default(smaServers));
    });
}
function printVersions() {
    // return Promise.resolve()
    //     .then(getLocalWorldsMetadata)
    //     .then(({ version }) => {
    //         const worldsVersion = version === '0.0.0' ? 'Not found' : version
    //         const mct1Version = pluginVersion()
    //         const serverVersion = pkg.version
    //         console.log(header)
    //         console.log(`Server version: ${serverVersion}`)
    //         console.log(`Worlds Version: ${worldsVersion}`)
    //         console.log(`Plugin version: ${mct1Version}`)
    //         console.log(`\nWorlds dir: ${mct1WorldDir}`)
    //         console.log(`Plugin dir: ${mct1PluginDir}`)
    //         return true
    //     })
    //     .then(exit)
}
function nameNeeded() {
    return __awaiter(this, void 0, void 0, function () {
        var name;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, server.getServerName(serverTarget)];
                case 1:
                    name = _a.sent();
                    if (name.isNothing) {
                        return [2 /*return*/, exit(1)];
                    }
                    else {
                        return [2 /*return*/, name.value];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getContainerStatus(name) {
    return __awaiter(this, void 0, void 0, function () {
        var data, w, worlds, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, docker_1.docker.command("inspect " + name)];
                case 1:
                    data = _a.sent();
                    return [4 /*yield*/, worlds_1.getInstalledWorlds()];
                case 2:
                    w = _a.sent();
                    worlds = w.isNothing ? [] : w.value;
                    return [2 /*return*/, new ghetto_monad_1.Result(Object.assign(data.object[0].State, {
                            worlds: worlds,
                        }))];
                case 3:
                    e_1 = _a.sent();
                    return [2 /*return*/, new ghetto_monad_1.ErrorResult(new Error("Server " + name + " is not running"))];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getStatus() {
    return __awaiter(this, void 0, void 0, function () {
        var name, status;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, nameNeeded()];
                case 1:
                    name = _a.sent();
                    return [4 /*yield*/, getContainerStatus(name)];
                case 2:
                    status = _a.sent();
                    if (status.isError) {
                        console.log(status.error.message);
                        return [2 /*return*/, exit()];
                    }
                    console.log(status.value);
                    return [2 /*return*/];
            }
        });
    });
}
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        var name, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, nameNeeded()
                    // @TODO
                    // getWorldsIfNeeded()
                    // installJSPluginsIfNeeded()
                    // installJavaPluginsIfNeeded()
                ];
                case 1:
                    name = _a.sent();
                    return [4 /*yield*/, getContainerStatus(name)];
                case 2:
                    data = _a.sent();
                    if (!!data.isError) return [3 /*break*/, 5];
                    if (data.value.Status === 'running') {
                        console.log('Server is already running.');
                        exit();
                    }
                    if (data.value.Status === 'exited') {
                        return [2 /*return*/, removeStoppedInstance(name)];
                    }
                    if (!(data.value.Status === 'paused')) return [3 /*break*/, 5];
                    return [4 /*yield*/, restartPausedContainer(name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, getStatus()];
                case 4:
                    _a.sent();
                    exit();
                    _a.label = 5;
                case 5:
                    console.log("Starting " + name);
                    return [4 /*yield*/, startNewInstance(name)];
                case 6:
                    _a.sent();
                    viewLogs();
                    return [2 /*return*/];
            }
        });
    });
}
function restartPausedContainer(name) {
    console.log("Unpausing " + name);
    return docker_1.docker.command("unpause " + name);
}
// function getWorldsIfNeeded() {
//     return Promise.resolve().then(() => mct1WorldsExistLocally() || getWorlds())
// }
// function installPluginIfNeeded() {
//     Promise.resolve().then(() => pluginExists() || copyPlugin())
// }
function startNewInstance(name) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, port, bind, cache, dc, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, server.getDockerTag()];
                case 1:
                    tag = _a.sent();
                    return [4 /*yield*/, server.getPort()];
                case 2:
                    port = _a.sent();
                    return [4 /*yield*/, getBindings(name)];
                case 3:
                    bind = _a.sent();
                    cache = "--mount source=sma-server-cache,target=/server/cache";
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    dc = "run -d -p " + port + ":25565 --name " + name + " " + bind + " " + cache + " --restart always magikcraft/scriptcraft:" + tag;
                    return [4 /*yield*/, docker_1.docker.command(dc)];
                case 5:
                    _a.sent();
                    console.log(chalk_1.default.yellow("Server " + name + " started on localhost:" + port + "\n"));
                    console.log(dc);
                    return [3 /*break*/, 7];
                case 6:
                    e_2 = _a.sent();
                    console.log('There was an error starting the server!');
                    console.log(e_2);
                    console.log("\nTry stopping the server, then starting it again.\n\nIf that doesn't work - check if this issue has been reported at https://github.com/Magikcraft/scriptcraft-sma/issues");
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function getBindings(name) {
    return __awaiter(this, void 0, void 0, function () {
        var mount, worlds, plugins, bindings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mount = function (src, dst) {
                        return "--mount type=bind,src=" + src + ",dst=/server/" + dst;
                    };
                    return [4 /*yield*/, worlds_1.hasWorlds()];
                case 1:
                    worlds = (_a.sent()) ? mount(paths_1.worldsPath(), 'worlds') : "";
                    plugins = mount(paths_1.pluginsPath(), 'scriptcraft-plugins');
                    return [4 /*yield*/, server.getCustomBindings()];
                case 2:
                    bindings = (_a.sent())
                        .map(function (_a) {
                        var src = _a.src, dst = _a.dst;
                        return mount(paths_1.localPath(src), dst);
                    })
                        .join(' ');
                    return [2 /*return*/, worlds + " " + plugins + " " + bindings];
            }
        });
    });
}
function stopServer() {
    return __awaiter(this, void 0, void 0, function () {
        var name, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, nameNeeded()];
                case 1:
                    name = _a.sent();
                    return [4 /*yield*/, getContainerStatus(name)];
                case 2:
                    data = _a.sent();
                    if (data.isError) {
                        console.log(data.error.message);
                        return [2 /*return*/, exit()];
                    }
                    if (!(data.value.Status === 'exited')) return [3 /*break*/, 4];
                    return [4 /*yield*/, removeStoppedInstance(name)];
                case 3:
                    _a.sent();
                    exit();
                    _a.label = 4;
                case 4:
                    console.log("Shutting down " + name + "...");
                    return [4 /*yield*/, stopRunningInstance(name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, removeStoppedInstance(name)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function exit(code) {
    if (code === void 0) { code = 0; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (code === 1) {
                        console.log("No SMA Server package.json found in current directory, and no name specified");
                    }
                    return [4 /*yield*/, updateCheck_1.doUpdateCheck()];
                case 1:
                    _a.sent();
                    process.exit();
                    return [2 /*return*/];
            }
        });
    });
}
function stopRunningInstance(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, docker_1.docker.command("stop " + name)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function removeStoppedInstance(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Removing stopped container');
                    return [4 /*yield*/, docker_1.docker.command("rm " + name)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
