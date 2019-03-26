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
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const update_check_1 = __importDefault(require("update-check"));
const pkg = require('../package');
exports.version = pkg.version;
function doUpdateCheck() {
    return __awaiter(this, void 0, void 0, function* () {
        let update = null;
        try {
            update = yield update_check_1.default(pkg);
        }
        catch (err) {
            // console.error(`Failed to check for updates: ${err}`)
        }
        if (update) {
            console.log(chalk_1.default.yellow(`\nAn updated version is available. The latest version is ${update.latest}. Please update!`));
            console.log(chalk_1.default.blue('\nnpm i -g smac\n'));
        }
    });
}
exports.doUpdateCheck = doUpdateCheck;
