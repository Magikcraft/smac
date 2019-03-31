"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const columnify_1 = __importDefault(require("columnify"));
const version_1 = require("../lib/util/version");
const commandMap_1 = require("./commandMap");
function printHelp() {
    console.log(version_1.header);
    console.log(`Version ${version_1.version}`);
    console.log('\nUsage:');
    console.log('smac <command>');
    console.log('\nAvailable commands:');
    const commandList = Object.keys(commandMap_1.commandMap).map(c => ({
        command: [c],
        description: commandMap_1.commandMap[c].description,
    }));
    console.log(columnify_1.default(commandList));
}
exports.printHelp = printHelp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhlbHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwREFBaUM7QUFDakMsaURBQXFEO0FBQ3JELDZDQUF5QztBQUV6QyxTQUFnQixTQUFTO0lBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQU0sQ0FBQyxDQUFBO0lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxpQkFBTyxFQUFFLENBQUMsQ0FBQTtJQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtJQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUE7SUFFcEMsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyx1QkFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsRCxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDWixXQUFXLEVBQUUsdUJBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXO0tBQ3pDLENBQUMsQ0FBQyxDQUFBO0lBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7QUFDdkMsQ0FBQztBQWJELDhCQWFDIn0=