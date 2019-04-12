#!/usr/bin/env node
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const commandLineArgs = require('command-line-args');
const fs = __importStar(require("fs-extra"));
const commands = __importStar(require("../commands"));
const commandMap_1 = require("../commands/commandMap");
const docker = __importStar(require("../lib/docker"));
const paths_1 = require("../lib/paths");
const exit_1 = require("../lib/util/exit");
if (!fs.existsSync(paths_1.smaPath('./')))
    fs.mkdirpSync(paths_1.smaPath('./'));
if (!docker.isDockerInstalled) {
    console.log('Docker not found. Please install Docker from https://www.docker.com.');
    process.exit(1);
}
/* first - parse the main command */
const mainDefinitions = [{ name: 'command', defaultOption: true }];
const mainOptions = commandLineArgs(mainDefinitions, {
    stopAtFirstUnknown: true,
});
const argv = mainOptions._unknown || [];
// console.log('mainOptions\n===========')
// console.log(mainOptions)
/* second - parse the start command options */
if (mainOptions.command === commandMap_1.commandMap.start.name) {
    const startDefinitions = commandMap_1.commandMap.start.startDefinitions;
    const startOptions = commandLineArgs(startDefinitions, { argv });
    // console.log('\nstartOptions\n============')
    // console.log(startOptions)
    commands.startServer(startOptions);
}
else {
    const command = process.argv[2];
    if (!command || !commandMap_1.commandMap[command]) {
        commands.printHelp();
        exit_1.exit();
    }
    else
        processCommand(command);
}
function processCommand(command, target) {
    if (command === commandMap_1.commandMap.stop.name) {
        commands.stopServer(process.argv[3]);
    }
    if (command === commandMap_1.commandMap.status.name) {
        commands.getStatus();
    }
    if (command === commandMap_1.commandMap.list.name) {
        commands.listContainers();
    }
    if (command === commandMap_1.commandMap.info.name) {
        commands.inspectContainer(target);
    }
    if (command === commandMap_1.commandMap.logs.name) {
        if (!target) {
            // do not allow to be run from log viewer terminal
            commands.viewLogs();
        }
    }
    if (!command || !commandMap_1.commandMap[command]) {
        commands.printHelp();
    }
}
exports.processCommand = processCommand;
