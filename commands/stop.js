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
function stopServer(serverTarget) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0b3AudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzREFBdUM7QUFDdkMsMkNBQXVDO0FBQ3ZDLDJDQUE2RTtBQUM3RSxxQ0FBNkM7QUFFN0MsU0FBc0IsVUFBVSxDQUFDLFlBQXFCOztRQUNsRCxJQUFJLE1BQU0sQ0FBQTtRQUNWLElBQUksWUFBWSxFQUFFO1lBQ2QsTUFBTSxHQUFHLFlBQVksQ0FBQTtTQUN4QjthQUFNO1lBQ0gsTUFBTSxJQUFJLEdBQUcsTUFBTSwwQkFBbUIsRUFBRSxDQUFBO1lBQ3hDLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDaEIsNEJBQXFCLEVBQUUsQ0FBQTtnQkFDdkIsT0FBTyxXQUFJLEVBQUUsQ0FBQTthQUNoQjtZQUNELE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO1NBQ3RCO1FBQ0QsTUFBTSxJQUFJLEdBQUcsTUFBTSwyQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUM3QyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDL0IsT0FBTyxXQUFJLEVBQUUsQ0FBQTtTQUNoQjtRQUNELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssUUFBUSxFQUFFO1lBQ2hDLE1BQU0scUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDbkMsV0FBSSxFQUFFLENBQUE7U0FDVDtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLE1BQU0sS0FBSyxDQUFDLENBQUE7UUFFekMsTUFBTSxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNqQyxNQUFNLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ25DLE9BQU8sV0FBSSxFQUFFLENBQUE7SUFDakIsQ0FBQztDQUFBO0FBMUJELGdDQTBCQztBQUVELFNBQWUsbUJBQW1CLENBQUMsSUFBWTs7UUFDM0MsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUN4QyxDQUFDO0NBQUE7QUFFRCxTQUFzQixxQkFBcUIsQ0FBQyxJQUFZOztRQUNwRCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUE7UUFDekMsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUN0QyxDQUFDO0NBQUE7QUFIRCxzREFHQyJ9