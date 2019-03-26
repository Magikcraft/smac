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
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const terminal_1 = require("../lib/terminal");
const exit_1 = require("../lib/util/exit");
const log_1 = require("../lib/util/log");
const name_1 = require("../lib/util/name");
const status_1 = require("./status");
function viewLogs() {
    return __awaiter(this, void 0, void 0, function* () {
        const name = yield name_1.getTargetForCommand();
        if (name.isNothing) {
            name_1.hintRunningContainers();
            return exit_1.exit();
        }
        const isRunning = yield status_1.getContainerStatus(name.value);
        if (isRunning.isError) {
            console.log(isRunning.error.message);
            exit_1.exit();
        }
        console.log('Spawning log viewer');
        process.on('SIGINT', () => {
            console.log(chalk_1.default.yellow(`\n\nServer ${name.value} is still running. Use '`) +
                chalk_1.default.blue(`smac stop ${name.value}`) +
                chalk_1.default.yellow(' to stop it.'));
            exit_1.exit(0);
        });
        const log = child_process_1.spawn('docker', ['logs', '-f', name.value]);
        log.stdout.on('data', d => {
            const lines = log_1.colorise(d.toString());
            process.stdout.write(lines);
        });
        terminal_1.startTerminal();
    });
}
exports.viewLogs = viewLogs;