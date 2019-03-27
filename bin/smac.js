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
const commands = __importStar(require("../commands"));
const commandMap_1 = require("../commands/commandMap.");
const docker = __importStar(require("../lib/docker"));
const exit_1 = require("../lib/util/exit");
if (!docker.isDockerInstalled) {
    console.log('Docker not found. Please install Docker from https://www.docker.com.');
    process.exit(1);
}
const command = process.argv[2];
if (!command || !commandMap_1.commandMap[command]) {
    commands.printHelp();
    exit_1.exit();
}
processCommand(command);
function processCommand(command) {
    if (command === commandMap_1.commandMap.start.name) {
        commands.startServer();
    }
    if (command === commandMap_1.commandMap.stop.name) {
        commands.stopServer();
    }
    if (command === commandMap_1.commandMap.status.name) {
        commands.getStatus();
    }
    if (command === commandMap_1.commandMap.list.name) {
        commands.listContainers();
    }
    if (command === commandMap_1.commandMap.info.name) {
        commands.inspectContainer();
    }
    if (command === commandMap_1.commandMap.logs.name) {
        commands.viewLogs();
    }
}
