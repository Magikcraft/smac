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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNtYWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBRXBELDZDQUE4QjtBQUM5QixzREFBdUM7QUFDdkMsdURBQW1EO0FBQ25ELHNEQUF1QztBQUN2Qyx3Q0FBc0M7QUFDdEMsMkNBQXVDO0FBRXZDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7QUFFL0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRTtJQUMzQixPQUFPLENBQUMsR0FBRyxDQUNQLHNFQUFzRSxDQUN6RSxDQUFBO0lBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtDQUNsQjtBQUVELG9DQUFvQztBQUNwQyxNQUFNLGVBQWUsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUNsRSxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsZUFBZSxFQUFFO0lBQ2pELGtCQUFrQixFQUFFLElBQUk7Q0FDM0IsQ0FBQyxDQUFBO0FBQ0YsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUE7QUFFdkMsMENBQTBDO0FBQzFDLDJCQUEyQjtBQUUzQiw4Q0FBOEM7QUFDOUMsSUFBSSxXQUFXLENBQUMsT0FBTyxLQUFLLHVCQUFVLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtJQUMvQyxNQUFNLGdCQUFnQixHQUFHLHVCQUFVLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFBO0lBQzFELE1BQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7SUFFaEUsOENBQThDO0lBQzlDLDRCQUE0QjtJQUM1QixRQUFRLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFBO0NBQ3JDO0tBQU07SUFDSCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRS9CLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyx1QkFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ2xDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtRQUNwQixXQUFJLEVBQUUsQ0FBQTtLQUNUOztRQUFNLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtDQUNqQztBQUNELFNBQWdCLGNBQWMsQ0FBQyxPQUFlLEVBQUUsTUFBZTtJQUMzRCxJQUFJLE9BQU8sS0FBSyx1QkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDbEMsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFBO0tBQ3hCO0lBQ0QsSUFBSSxPQUFPLEtBQUssdUJBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO1FBQ3BDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtLQUN2QjtJQUNELElBQUksT0FBTyxLQUFLLHVCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtRQUNsQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUE7S0FDNUI7SUFDRCxJQUFJLE9BQU8sS0FBSyx1QkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDbEMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQ3BDO0lBQ0QsSUFBSSxPQUFPLEtBQUssdUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ2xDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDVCxrREFBa0Q7WUFDbEQsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFBO1NBQ3RCO0tBQ0o7SUFDRCxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsdUJBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNsQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUE7S0FDdkI7QUFDTCxDQUFDO0FBdEJELHdDQXNCQyJ9