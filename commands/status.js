"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ghetto_monad_1 = require("ghetto-monad");
const docker = __importStar(require("../lib/docker"));
const exit_1 = require("../lib/util/exit");
const name_1 = require("../lib/util/name");
const list_1 = require("./list");
function getContainerStatus(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield docker.command(`inspect ${name}`);
            return new ghetto_monad_1.Result(Object.assign({ Name: name, State: data.object[0].State, Mounts: data.object[0].Mounts }, data.object[0].NetworkSettings.Ports));
        }
        catch (e) {
            const running = yield list_1.getContainerList();
            if (running.length === 1) {
                return getContainerStatus(running[0].name);
            }
            return new ghetto_monad_1.ErrorResult(new Error(`Server ${name} is not running`));
        }
    });
}
exports.getContainerStatus = getContainerStatus;
function getStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        const name = yield name_1.getTargetForCommand();
        if (name.isNothing) {
            yield name_1.hintRunningContainers();
            return exit_1.exit;
        }
        const isUp = name_1.isRunning(name.value);
        if (!isUp) {
            console.log(`Server ${name.value} is not running`);
            yield name_1.hintRunningContainers();
            return exit_1.exit;
        }
        const data = yield getContainerStatus(name.value);
        if (data.isError) {
            console.log(data.error.message);
            return exit_1.exit();
        }
        console.log(data.value);
    });
}
exports.getStatus = getStatus;
