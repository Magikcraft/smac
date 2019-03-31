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
const ghetto_monad_1 = require("ghetto-monad");
const process_1 = require("process");
const docker = __importStar(require("../lib/docker"));
const name_1 = require("../lib/util/name");
const status_1 = require("./status");
function inspectContainer(serverTarget) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = new ghetto_monad_1.Result(serverTarget) || (yield name_1.getTargetForCommand());
        if (name.isNothing) {
            yield name_1.hintRunningContainers();
            return process_1.exit();
        }
        const target = name.value;
        const status = yield status_1.getContainerStatus(target);
        if (status.isError) {
            console.log(status.error.message);
            return process_1.exit(0);
        }
        console.log(chalk_1.default.blue(`${target}:`));
        console.log(status.value);
        const data = yield docker.command(`inspect ${target}`);
        // console.log(data.object[0].State)
        console.log(chalk_1.default.blue('Container Mounts:'));
        console.log(data.object[0].Mounts);
        console.log(chalk_1.default.blue('Network:'));
        console.log(data.object[0].NetworkSettings.Ports);
        process_1.exit();
    });
}
exports.inspectContainer = inspectContainer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zcGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluc3BlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBeUI7QUFDekIsK0NBQXFDO0FBQ3JDLHFDQUE4QjtBQUM5QixzREFBdUM7QUFDdkMsMkNBQTZFO0FBQzdFLHFDQUE2QztBQUU3QyxTQUFzQixnQkFBZ0IsQ0FBQyxZQUFZOztRQUMvQyxNQUFNLElBQUksR0FBRyxJQUFJLHFCQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLDBCQUFtQixFQUFFLENBQUMsQ0FBQTtRQUN0RSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDaEIsTUFBTSw0QkFBcUIsRUFBRSxDQUFBO1lBQzdCLE9BQU8sY0FBSSxFQUFFLENBQUE7U0FDaEI7UUFDRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO1FBQ3pCLE1BQU0sTUFBTSxHQUFHLE1BQU0sMkJBQWtCLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDL0MsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO1lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNqQyxPQUFPLGNBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUNqQjtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBSyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUN6QixNQUFNLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ3RELG9DQUFvQztRQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFBO1FBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQTtRQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2pELGNBQUksRUFBRSxDQUFBO0lBQ1YsQ0FBQztDQUFBO0FBckJELDRDQXFCQyJ9