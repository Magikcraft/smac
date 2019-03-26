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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const process_1 = require("process");
const docker = __importStar(require("../lib/docker"));
const name_1 = require("../lib/util/name");
const status_1 = require("./status");
function inspectContainer() {
    return __awaiter(this, void 0, void 0, function* () {
        let name = yield name_1.getTargetForCommand();
        if (name.isNothing) {
            yield name_1.hintRunningContainers();
            return process_1.exit();
        }
        const status = yield status_1.getContainerStatus(name.value);
        if (status.isError) {
            console.log(status.error.message);
            return process_1.exit(0);
        }
        console.log(chalk_1.default.blue(`${name.value}:`));
        console.log(status.value);
        const data = yield docker.command(`inspect ${name.value}`);
        // console.log(data.object[0].State)
        console.log(chalk_1.default.blue('Container Mounts:'));
        console.log(data.object[0].Mounts);
        console.log(chalk_1.default.blue('Network:'));
        console.log(data.object[0].NetworkSettings.Ports);
        process_1.exit();
    });
}
exports.inspectContainer = inspectContainer;
