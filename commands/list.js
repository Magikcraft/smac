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
const columnify_1 = __importDefault(require("columnify"));
const docker = __importStar(require("../lib/docker"));
const version_1 = require("../lib/util/version");
function getContainerList() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield docker.command('ps');
        return data.containerList
            .filter(c => c.image.indexOf('magikcraft/scriptcraft') === 0)
            .map(c => ({ name: c.names, status: c.status }));
    });
}
exports.getContainerList = getContainerList;
function listContainers() {
    return __awaiter(this, void 0, void 0, function* () {
        const smaServers = yield getContainerList();
        console.log(`${version_1.header}`);
        if (smaServers.length > 0) {
            console.log(columnify_1.default(smaServers));
        }
        else {
            console.log('No servers running.');
        }
    });
}
exports.listContainers = listContainers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwREFBaUM7QUFDakMsc0RBQXVDO0FBQ3ZDLGlEQUE0QztBQUU1QyxTQUFzQixnQkFBZ0I7O1FBQ2xDLE1BQU0sSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUN2QyxPQUFPLElBQUksQ0FBQyxhQUFhO2FBQ3BCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzVELEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUN4RCxDQUFDO0NBQUE7QUFMRCw0Q0FLQztBQUVELFNBQXNCLGNBQWM7O1FBQ2hDLE1BQU0sVUFBVSxHQUFHLE1BQU0sZ0JBQWdCLEVBQUUsQ0FBQTtRQUMzQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsZ0JBQU0sRUFBRSxDQUFDLENBQUE7UUFDeEIsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQTtTQUNyQzthQUFNO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO1NBQ3JDO0lBQ0wsQ0FBQztDQUFBO0FBUkQsd0NBUUMifQ==