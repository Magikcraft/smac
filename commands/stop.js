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
const exit_1 = require("../lib/util/exit");
const name_1 = require("../lib/util/name");
const status_1 = require("./status");
function stopServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const name = yield name_1.getTargetForCommand();
        if (name.isNothing) {
            name_1.hintRunningContainers();
            return exit_1.exit();
        }
        const data = yield status_1.getContainerStatus(name.value);
        if (data.isError) {
            console.log(data.error.message);
            return exit_1.exit();
        }
        if (data.value.Status === 'exited') {
            yield removeStoppedInstance(name.value);
            exit_1.exit();
        }
        console.log(`Shutting down ${name.value}...`);
        yield stopRunningInstance(name.value);
        yield removeStoppedInstance(name.value);
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
