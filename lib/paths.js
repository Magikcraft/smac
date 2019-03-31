"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const path = __importStar(require("path"));
exports.dockerServerRoot = `/_server_`;
const home = os_1.homedir();
const cwd = process.cwd();
exports.smaPath = p => path.join(home, '.sma', p);
exports.localPath = p => path.join(cwd, p);
exports.localWorldsPath = () => exports.localPath('worlds');
exports.smaWorldsPath = () => exports.smaPath('worlds');
exports.localWorldPath = path => `${exports.localWorldsPath()}/${path}`;
exports.smaWorldPath = path => `${exports.smaWorldsPath()}/${path}`;
exports.pluginsPath = () => exports.localPath('node_modules');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwYXRocy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSwyQkFBNEI7QUFDNUIsMkNBQTRCO0FBRWYsUUFBQSxnQkFBZ0IsR0FBRyxXQUFXLENBQUE7QUFFM0MsTUFBTSxJQUFJLEdBQUcsWUFBTyxFQUFFLENBQUE7QUFFdEIsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBRVosUUFBQSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFFekMsUUFBQSxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUVsQyxRQUFBLGVBQWUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxpQkFBUyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBRTNDLFFBQUEsYUFBYSxHQUFHLEdBQUcsRUFBRSxDQUFDLGVBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUV2QyxRQUFBLGNBQWMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsdUJBQWUsRUFBRSxJQUFJLElBQUksRUFBRSxDQUFBO0FBQ3ZELFFBQUEsWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxxQkFBYSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUE7QUFFbkQsUUFBQSxXQUFXLEdBQUcsR0FBRyxFQUFFLENBQUMsaUJBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQSJ9