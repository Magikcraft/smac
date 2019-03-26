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
const ghetto_monad_1 = require("ghetto-monad");
const list_1 = require("../../commands/list");
const status_1 = require("../../commands/status");
const server_1 = require("../../lib/server");
function isRunning(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield status_1.getContainerStatus(name);
        if (data.isError) {
            return false;
        }
        return true;
    });
}
exports.isRunning = isRunning;
function hintRunningContainers() {
    return __awaiter(this, void 0, void 0, function* () {
        const running = yield list_1.getContainerList();
        if (running.length > 0) {
            console.log('These servers are running: ', running);
        }
        else {
            console.log('There are no running servers.');
        }
    });
}
exports.hintRunningContainers = hintRunningContainers;
function getTargetForCommand({ includeRunningContainer = true, } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const serverTarget = process.argv[3];
        if (serverTarget) {
            return new ghetto_monad_1.Result(serverTarget);
        }
        const name = yield server_1.server.getServerTargetFromPackageJson();
        if (!name.isNothing) {
            return name;
        }
        if (includeRunningContainer) {
            const running = yield list_1.getContainerList();
            if (running.length === 1) {
                console.log(running[0].name);
                return new ghetto_monad_1.Result(running[0].name);
            }
            else {
                return new ghetto_monad_1.Nothing();
            }
        }
        else {
            return new ghetto_monad_1.Nothing();
        }
    });
}
exports.getTargetForCommand = getTargetForCommand;
