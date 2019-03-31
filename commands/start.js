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
            logs_1.viewLogs({ serverTarget: target, started: true });
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
        const tag = yield server_1.server.getDockerTag();
        const port = yield server_1.server.getPort();
        const bind = yield server_1.server.getBindings(name);
        const env = yield server_1.server.getEnvironment();
        const rest = yield server_1.server.getRestConfig();
        const cache = `--mount source=sma-server-cache,target=${paths_1.dockerServerRoot}/cache`;
        const eula = `-e MINECRAFT_EULA_ACCEPTED=${eulaAccepted}`;
        const testMode = options.test ? `-e TEST_MODE=true` : '';
        try {
            const dc = `run -d -p ${port}:25565 -p ${rest.port}:${rest.port} --name ${name} ${env} ${eula} ${bind} ${cache} ${testMode} --restart always magikcraft/scriptcraft:${tag}`;
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
    const finalLine = final ? `\n\t ${final}` : '';
    console.log(chalk_1.default.gray(`${initialLines}${finalLine}`));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGFydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGtEQUF5QjtBQUN6QiwrQ0FBa0Q7QUFDbEQsc0RBQXVDO0FBQ3ZDLHNDQUF1QztBQUN2Qyx3Q0FBK0M7QUFDL0MsMENBQXNDO0FBQ3RDLDJDQUF1QztBQUN2QywyQ0FBc0Q7QUFDdEQsaUNBQWlDO0FBQ2pDLHFDQUF3RDtBQUN4RCxpQ0FBOEM7QUFFOUMsU0FBc0IsV0FBVyxDQUFDLE9BQVk7O1FBQzFDLElBQUksTUFBYyxDQUFBO1FBQ2xCLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUNqQixNQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQTtTQUMzQjthQUFNO1lBQ0gsTUFBTSxJQUFJLEdBQUcsTUFBTSwwQkFBbUIsQ0FBQztnQkFDbkMsdUJBQXVCLEVBQUUsS0FBSztnQkFDOUIsT0FBTzthQUNWLENBQUMsQ0FBQTtZQUNGLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FDUCxpRUFBaUUsQ0FDcEUsQ0FBQTtnQkFDRCxPQUFPLFdBQUksRUFBRSxDQUFBO2FBQ2hCO1lBQ0QsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUE7U0FDdEI7UUFDRCxRQUFRO1FBQ1IsNkJBQTZCO1FBQzdCLCtCQUErQjtRQUMvQixNQUFNLElBQUksR0FBRyxNQUFNLDJCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQzdDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2YsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO2dCQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxzQkFBc0IsQ0FBQyxDQUFBO2dCQUM1QyxPQUFPLFdBQUksRUFBRSxDQUFBO2FBQ2hCO1lBQ0QsSUFBSSxJ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