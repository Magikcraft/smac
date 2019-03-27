"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const columnify_1 = __importDefault(require("columnify"));
const version_1 = require("../lib/util/version");
const commandMap_1 = require("./commandMap.");
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
