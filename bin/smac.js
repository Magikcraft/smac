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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNtYWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBRXBELHNEQUF1QztBQUN2Qyx1REFBbUQ7QUFDbkQsc0RBQXVDO0FBQ3ZDLDJDQUF1QztBQUV2QyxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFO0lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQ1Asc0VBQXNFLENBQ3pFLENBQUE7SUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0NBQ2xCO0FBRUQsb0NBQW9DO0FBQ3BDLE1BQU0sZUFBZSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQ2xFLE1BQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQyxlQUFlLEVBQUU7SUFDakQsa0JBQWtCLEVBQUUsSUFBSTtDQUMzQixDQUFDLENBQUE7QUFDRixNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQTtBQUV2QywwQ0FBMEM7QUFDMUMsMkJBQTJCO0FBRTNCLDhDQUE4QztBQUM5QyxJQUFJLFdBQVcsQ0FBQyxPQUFPLEtBQUssdUJBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO0lBQy9DLE1BQU0sZ0JBQWdCLEdBQUcsdUJBQVUsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUE7SUFDMUQsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUVoRSw4Q0FBOEM7SUFDOUMsNEJBQTRCO0lBQzVCLFFBQVEsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUE7Q0FDckM7S0FBTTtJQUNILE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFFL0IsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLHVCQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDbEMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFBO1FBQ3BCLFdBQUksRUFBRSxDQUFBO0tBQ1Q7O1FBQU0sY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0NBQ2pDO0FBQ0QsU0FBZ0IsY0FBYyxDQUFDLE9BQWUsRUFBRSxNQUFlO0lBQzNELElBQUksT0FBTyxLQUFLLHVCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtRQUNsQyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUE7S0FDeEI7SUFDRCxJQUFJLE9BQU8sS0FBSyx1QkFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7UUFDcEMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFBO0tBQ3ZCO0lBQ0QsSUFBSSxPQUFPLEtBQUssdUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ2xDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtLQUM1QjtJQUNELElBQUksT0FBTyxLQUFLLHVCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtRQUNsQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUE7S0FDcEM7SUFDRCxJQUFJLE9BQU8sS0FBSyx1QkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDbEMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNULGtEQUFrRDtZQUNsRCxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUE7U0FDdEI7S0FDSjtJQUNELElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyx1QkFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ2xDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtLQUN2QjtBQUNMLENBQUM7QUF0QkQsd0NBc0JDIn0=