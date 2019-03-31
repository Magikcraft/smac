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
const commands = __importStar(require("../commands"));
const commandMap_1 = require("../commands/commandMap");
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
function processCommand(command, target) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNtYWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBRXBELHNEQUF1QztBQUN2Qyx1REFBbUQ7QUFDbkQsc0RBQXVDO0FBQ3ZDLDJDQUF1QztBQUV2QyxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFO0lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQ1Asc0VBQXNFLENBQ3pFLENBQUE7SUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0NBQ2xCO0FBRUQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUUvQixJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsdUJBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtJQUNsQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUE7SUFDcEIsV0FBSSxFQUFFLENBQUE7Q0FDVDtBQUVELGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUV2QixTQUFnQixjQUFjLENBQUMsT0FBZSxFQUFFLE1BQWU7SUFDM0QsSUFBSSxPQUFPLEtBQUssdUJBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO1FBQ25DLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtLQUN6QjtJQUNELElBQUksT0FBTyxLQUFLLHVCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtRQUNsQyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUE7S0FDeEI7SUFDRCxJQUFJLE9BQU8sS0FBSyx1QkFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7UUFDcEMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFBO0tBQ3ZCO0lBQ0QsSUFBSSxPQUFPLEtBQUssdUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ2xDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtLQUM1QjtJQUNELElBQUksT0FBTyxLQUFLLHVCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtRQUNsQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUE7S0FDcEM7SUFDRCxJQUFJLE9BQU8sS0FBSyx1QkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDbEMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNULGtEQUFrRDtZQUNsRCxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUE7U0FDdEI7S0FDSjtJQUNELElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyx1QkFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ2xDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtLQUN2QjtBQUNMLENBQUM7QUF6QkQsd0NBeUJDIn0=