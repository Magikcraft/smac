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
const docker = __importStar(require("../lib/docker"));
const server_1 = require("../lib/server");
const exit_1 = require("../lib/util/exit");
const name_1 = require("../lib/util/name");
const status_1 = require("./status");
function stopServer(options) {
    return __awaiter(this, void 0, void 0, function* () {
        let target;
        if (options.file) {
            server_1.server.filename = options.file;
            target = yield server_1.server.getName();
        }
        else if (options.profile) {
            target = options.profile;
        }
        else {
            const name = yield name_1.getTargetForCommand();
            if (name.isNothing) {
                name_1.hintRunningContainers();
                return exit_1.exit();
            }
            target = name.value;
        }
        const data = yield status_1.getContainerStatus(target);
        if (data.isError) {
            console.log(data.error.message);
            return exit_1.exit();
        }
        if (data.value.Status === 'exited') {
            yield removeStoppedInstance(target);
            exit_1.exit();
        }
        console.log(`Shutting down ${target}...`);
        yield stopRunningInstance(target);
        yield removeStoppedInstance(target);
        return exit_1.exit();
    });
}
exports.stopServer = stopServer;
function stopRunningInstance(name) {
    return __awaiter(this, void 0, void 0, function* () {
        yield docker.command(`stop ${name}`);
    });
}
function removeStoppedInstance(name) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Removing stopped container');
        yield docker.command(`rm ${name}`);
    });
}
exports.removeStoppedInstance = removeStoppedInstance;
