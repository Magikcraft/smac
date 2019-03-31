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
function getContainerStatus(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield docker.command(`inspect ${name}`);
            return new ghetto_monad_1.Result(Object.assign({ State: data.object[0].State, Mounts: data.object[0].Mounts }, data.object[0].NetworkSettings.Ports));
        }
        catch (e) {
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
        console.log(name);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RhdHVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0NBQWtEO0FBQ2xELHNEQUF1QztBQUN2QywyQ0FBdUM7QUFDdkMsMkNBSXlCO0FBRXpCLFNBQXNCLGtCQUFrQixDQUFDLElBQVk7O1FBQ2pELElBQUk7WUFDQSxNQUFNLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQyxDQUFBO1lBQ3BELE9BQU8sSUFBSSxxQkFBTSxpQkFDYixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQzNCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUN6QyxDQUFBO1NBQ0w7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLE9BQU8sSUFBSSwwQkFBVyxDQUFDLElBQUksS0FBSyxDQUFDLFVBQVUsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUE7U0FDckU7SUFDTCxDQUFDO0NBQUE7QUFYRCxnREFXQztBQUVELFNBQXNCLFNBQVM7O1FBQzNCLE1BQU0sSUFBSSxHQUFHLE1BQU0sMEJBQW1CLEVBQUUsQ0FBQTtRQUN4QyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDaEIsTUFBTSw0QkFBcUIsRUFBRSxDQUFBO1lBQzdCLE9BQU8sV0FBSSxDQUFBO1NBQ2Q7UUFDRCxNQUFNLElBQUksR0FBRyxnQkFBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxDQUFDLEtBQUssaUJBQWlCLENBQUMsQ0FBQTtZQUNsRCxNQUFNLDRCQUFxQixFQUFFLENBQUE7WUFDN0IsT0FBTyxXQUFJLENBQUE7U0FDZDtRQUNELE1BQU0sSUFBSSxHQUFHLE1BQU0sa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2pELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUMvQixPQUFPLFdBQUksRUFBRSxDQUFBO1NBQ2hCO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDM0IsQ0FBQztDQUFBO0FBbkJELDhCQW1CQyJ9