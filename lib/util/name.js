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
function getTargetForCommand({ includeRunningContainer = true, options = {}, } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const serverTarget = options.profile;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmFtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5hbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLCtDQUE4QztBQUM5Qyw4Q0FBc0Q7QUFDdEQsa0RBQTBEO0FBQzFELDZDQUF5QztBQUV6QyxTQUFzQixTQUFTLENBQUMsSUFBSTs7UUFDaEMsTUFBTSxJQUFJLEdBQUcsTUFBTSwyQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMzQyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDZCxPQUFPLEtBQUssQ0FBQTtTQUNmO1FBQ0QsT0FBTyxJQUFJLENBQUE7SUFDZixDQUFDO0NBQUE7QUFORCw4QkFNQztBQUVELFNBQXNCLHFCQUFxQjs7UUFDdkMsTUFBTSxPQUFPLEdBQUcsTUFBTSx1QkFBZ0IsRUFBRSxDQUFBO1FBQ3hDLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSxPQUFPLENBQUMsQ0FBQTtTQUN0RDthQUFNO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO1NBQy9DO0lBQ0wsQ0FBQztDQUFBO0FBUEQsc0RBT0M7QUFDRCxTQUFzQixtQkFBbUIsQ0FBQyxFQUN0Qyx1QkFBdUIsR0FBRyxJQUFJLEVBQzlCLE9BQU8sR0FBRyxFQUFTLEdBQ3RCLEdBQUcsRUFBRTs7UUFDRixNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFBO1FBQ3BDLElBQUksWUFBWSxFQUFFO1lBQ2QsT0FBTyxJQUFJLHFCQUFNLENBQUMsWUFBWSxDQUFDLENBQUE7U0FDbEM7UUFDRCxNQUFNLElBQUksR0FBRyxNQUFNLGVBQU0sQ0FBQyw4QkFBOEIsRUFBRSxDQUFBO1FBQzFELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxDQUFBO1NBQ2Q7UUFDRCxJQUFJLHVCQUF1QixFQUFFO1lBQ3pCLE1BQU0sT0FBTyxHQUFHLE1BQU0sdUJBQWdCLEVBQUUsQ0FBQTtZQUN4QyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUN0QixPQUFPLElBQUkscUJBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7YUFDckM7aUJBQU07Z0JBQ0gsT0FBTyxJQUFJLHNCQUFPLEVBQUUsQ0FBQTthQUN2QjtTQUNKO2FBQU07WUFDSCxPQUFPLElBQUksc0JBQU8sRUFBRSxDQUFBO1NBQ3ZCO0lBQ0wsQ0FBQztDQUFBO0FBdEJELGtEQXNCQyJ9