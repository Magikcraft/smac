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
const chalk_1 = __importDefault(require("chalk"));
const ghetto_monad_1 = require("ghetto-monad");
const docker = __importStar(require("../lib/docker"));
const eula_1 = require("../lib/eula");
const paths_1 = require("../lib/paths");
const server_1 = require("../lib/server");
const exit_1 = require("../lib/util/exit");
const name_1 = require("../lib/util/name");
const logs_1 = require("./logs");
const status_1 = require("./status");
const stop_1 = require("./stop");
function startServer(options) {
    return __awaiter(this, void 0, void 0, function* () {
        let target;
        if (options.profile) {
            target = options.profile;
        }
        else {
            console.log(options);
            const filename = options.file;
            server_1.server.filename = filename;
            const name = yield name_1.getTargetForCommand({
                includeRunningContainer: false,
                options,
            });
            if (name.isNothing) {
                console.log('No name provided, and no package.json with a server name found.');
                return exit_1.exit();
            }
            target = name.value;
        }
        // @TODO
        // installJSPluginsIfNeeded()
        // installJavaPluginsIfNeeded()
        const data = yield status_1.getContainerStatus(target);
        if (!data.isError) {
            if (data.value.State.Status === 'running') {
                console.log(`${target} is already running.`);
                return exit_1.exit();
            }
            if (data.value.State.Status === 'created') {
                console.log(`${target} has been created, but is not running. Trying waiting, or stopping it.`);
                console.log(`If that doesn't work - check if this issue has been reported at https://github.com/Magikcraft/scriptcraft-sma/issues`);
                return exit_1.exit();
            }
            if (data.value.State.Status === 'exited') {
                return stop_1.removeStoppedInstance(target);
            }
            if (data.value.State.Status === 'paused') {
                yield restartPausedContainer(target);
                yield status_1.getStatus();
                exit_1.exit();
            }
        }
        console.log(`Starting ${target}`);
        const result = yield startNewInstance(target, options);
        if (!result.isError) {
            logs_1.viewLogs({ serverTarget: target, started: true, options });
        }
    });
}
exports.startServer = startServer;
function restartPausedContainer(name) {
    console.log(`Unpausing ${name}`);
    return docker.command(`unpause ${name}`);
}
function startNewInstance(name, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const eulaAccepted = yield eula_1.checkEula();
        if (!eulaAccepted) {
            console.log('Cannot continue without accepting the Minecraft EULA.');
            exit_1.exit();
            return new ghetto_monad_1.ErrorResult(new Error('Did not accept Minecraft EULA'));
        }
        console.log('Minecraft EULA accepted');
        const serverType = yield server_1.server.getServerType();
        const tag = yield server_1.server.getDockerTag();
        const port = yield server_1.server.getExposedPort();
        let containerPort = yield server_1.server.getContainerPort();
        const bind = yield server_1.server.getBindings(name);
        const env = yield server_1.server.getEnvironment();
        const rest = yield server_1.server.getRestConfig();
        const cache = `--mount source=sma-server-cache,target=${paths_1.dockerServerRoot}/cache`;
        const eula = `-e MINECRAFT_EULA_ACCEPTED=${eulaAccepted}`;
        const testMode = options.test || (yield server_1.server.getTestMode()) ? `-e TEST_MODE=true` : '';
        const dockerImage = yield server_1.server.getDockerImage();
        console.log(`Starting ${serverType} server on port ${port}...`);
        if (serverType === 'nukkit') {
            containerPort += '/udp';
        }
        try {
            const dc = `run -d -t -p ${port}:${containerPort} -p ${rest.port}:${rest.port} --name ${name} ${env} ${eula} ${bind} ${cache} ${testMode} --restart always  ${dockerImage}:${tag}`;
            yield docker.command(dc);
            console.log(chalk_1.default.yellow(`Server ${name} started on localhost:${port}\n`));
            logOutCommand(dc);
            return new ghetto_monad_1.Result(true);
        }
        catch (e) {
            console.log('There was an error starting the server!');
            console.log(e
                .toString()
                .split('--')
                .join('\n\t--'));
            console.log(`\nTry stopping the server, then starting it again.\n\nIf that doesn't work - check if this issue has been reported at https://github.com/Magikcraft/scriptcraft-sma/issues`);
            return new ghetto_monad_1.ErrorResult(new Error());
        }
    });
}
function logOutCommand(dc) {
    console.log('Start command:');
    const startCommand = dc.split('--');
    const final = startCommand.pop() || '';
    const initialLines = startCommand.map(s => `${s} \\`).join('\n\t--');
    const finalLine = final ? `\n\t --${final}` : '';
    console.log(chalk_1.default.gray(`${initialLines}${finalLine}`));
}
