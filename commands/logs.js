"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const stdout_1 = require("../lib/stdout");
const terminal_1 = require("../lib/terminal");
const exit_1 = require("../lib/util/exit");
const log_1 = require("../lib/util/log");
const name_1 = require("../lib/util/name");
const status_1 = require("./status");
const stop_1 = require("./stop");
let AlreadyStarted = false;
const stdout = stdout_1.CustomStd();
function viewLogs({ serverTarget, started = false, options = {}, } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let target;
        if (serverTarget) {
            target = serverTarget;
        }
        else {
            const name = yield name_1.getTargetForCommand();
            if (name.isNothing) {
                name_1.hintRunningContainers();
                return exit_1.exit();
            }
            target = name.value;
        }
        const isRunning = yield status_1.getContainerStatus(target);
        if (isRunning.isError) {
            console.log(isRunning.error.message);
            return exit_1.exit();
        }
        console.log('Spawning log viewer');
        if (!AlreadyStarted) {
            terminal_1.startTerminal(target, started);
        }
        const log = child_process_1.spawn('docker', ['logs', '-f', target]);
        let testsFailed = false;
        log.stdout.on('data', d => {
            const lines = log_1.colorise(d.toString());
            stdout.write(lines);
            if (lines.indexOf('Some Jasmine tests have failed.')) {
                testsFailed = true;
            }
            // Shut down the container and exit with a code based on the test results
            // when we were started with -t -e
            if (options && options.test && options.exit) {
                if (lines.indexOf('All tests are now complete.') != -1) {
                    if (testsFailed) {
                        stop_1.stopServer().then(() => process.exit(1));
                    }
                    else {
                        stop_1.stopServer().then(() => process.exit(0));
                    }
                }
            }
        });
        AlreadyStarted = true;
    });
}
exports.viewLogs = viewLogs;
