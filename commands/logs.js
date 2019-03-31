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
let AlreadyStarted = false;
const stdout = stdout_1.CustomStd();
function viewLogs({ serverTarget, started = false, } = {}) {
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
        log.stdout.on('data', d => {
            const lines = log_1.colorise(d.toString());
            stdout.write(lines);
        });
        AlreadyStarted = true;
    });
}
exports.viewLogs = viewLogs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLGlEQUFxQztBQUNyQywwQ0FBeUM7QUFDekMsOENBQStDO0FBQy9DLDJDQUF1QztBQUN2Qyx5Q0FBMEM7QUFDMUMsMkNBQTZFO0FBQzdFLHFDQUE2QztBQUU3QyxJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUE7QUFDMUIsTUFBTSxNQUFNLEdBQUcsa0JBQVMsRUFBRSxDQUFBO0FBQzFCLFNBQXNCLFFBQVEsQ0FBQyxFQUMzQixZQUFZLEVBQ1osT0FBTyxHQUFHLEtBQUssTUFDK0IsRUFBRTs7UUFDaEQsSUFBSSxNQUFjLENBQUE7UUFDbEIsSUFBSSxZQUFZLEVBQUU7WUFDZCxNQUFNLEdBQUcsWUFBWSxDQUFBO1NBQ3hCO2FBQU07WUFDSCxNQUFNLElBQUksR0FBRyxNQUFNLDBCQUFtQixFQUFFLENBQUE7WUFDeEMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNoQiw0QkFBcUIsRUFBRSxDQUFBO2dCQUN2QixPQUFPLFdBQUksRUFBRSxDQUFBO2FBQ2hCO1lBQ0QsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUE7U0FDdEI7UUFDRCxNQUFNLFNBQVMsR0FBRyxNQUFNLDJCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2xELElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDcEMsT0FBTyxXQUFJLEVBQUUsQ0FBQTtTQUNoQjtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQTtRQUNsQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ2pCLHdCQUFhLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1NBQ2pDO1FBQ0QsTUFBTSxHQUFHLEdBQUcscUJBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUE7UUFFbkQsR0FBRyxDQUFDLE1BQU8sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFO1lBQ3ZCLE1BQU0sS0FBSyxHQUFHLGNBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUNwQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3ZCLENBQUMsQ0FBQyxDQUFBO1FBQ0YsY0FBYyxHQUFHLElBQUksQ0FBQTtJQUN6QixDQUFDO0NBQUE7QUEvQkQsNEJBK0JDIn0=