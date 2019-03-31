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
function startServer(serverTarget) {
    return __awaiter(this, void 0, void 0, function* () {
        let target;
        if (serverTarget) {
            target = serverTarget;
        }
        else {
            const name = yield name_1.getTargetForCommand({
                includeRunningContainer: false,
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
        const result = yield startNewInstance(target);
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
function startNewInstance(name) {
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
        const testMode = `-e TEST_MODE=true`;
        try {
            const dc = `run -d -p ${port}:25565 -p ${rest.port}:${rest.port} --name ${name} ${env} ${eula} ${bind} ${cache} ${testMode} --restart always magikcraft/scriptcraft:${tag}`;
            yield docker.command(dc);
            console.log(chalk_1.default.yellow(`Server ${name} started on localhost:${port}\n`));
            console.log('Start command:');
            const startCommand = dc
                .split('--')
                .map(s => `${s} \\`)
                .join('\n\t--');
            console.log(chalk_1.default.gray(startCommand));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGFydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGtEQUF5QjtBQUN6QiwrQ0FBa0Q7QUFDbEQsc0RBQXVDO0FBQ3ZDLHNDQUF1QztBQUN2Qyx3Q0FBK0M7QUFDL0MsMENBQXNDO0FBQ3RDLDJDQUF1QztBQUN2QywyQ0FBc0Q7QUFDdEQsaUNBQWlDO0FBQ2pDLHFDQUF3RDtBQUN4RCxpQ0FBOEM7QUFFOUMsU0FBc0IsV0FBVyxDQUFDLFlBQXFCOztRQUNuRCxJQUFJLE1BQWMsQ0FBQTtRQUNsQixJQUFJLFlBQVksRUFBRTtZQUNkLE1BQU0sR0FBRyxZQUFZLENBQUE7U0FDeEI7YUFBTTtZQUNILE1BQU0sSUFBSSxHQUFHLE1BQU0sMEJBQW1CLENBQUM7Z0JBQ25DLHVCQUF1QixFQUFFLEtBQUs7YUFDakMsQ0FBQyxDQUFBO1lBQ0YsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNoQixPQUFPLENBQUMsR0FBRyxDQUNQLGlFQUFpRSxDQUNwRSxDQUFBO2dCQUNELE9BQU8sV0FBSSxFQUFFLENBQUE7YUFDaEI7WUFDRCxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQTtTQUN0QjtRQUNELFFBQVE7UUFDUiw2QkFBNkI7UUFDN0IsK0JBQStCO1FBQy9CLE1BQU0sSUFBSSxHQUFHLE1BQU0sMkJBQWtCLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDZixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7Z0JBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLHNCQUFzQixDQUFDLENBQUE7Z0JBQzVDLE9BQU8sV0FBSSxFQUFFLENBQUE7YUFDaEI7WUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1B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