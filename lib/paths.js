"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var cwd = process.cwd();
exports.localPath = function (p) { return path.join(cwd, p); };
exports.worldsPath = function () { return exports.localPath('worlds'); };
exports.pluginsPath = function () { return exports.localPath('node_modules'); };
