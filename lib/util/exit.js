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
const updateCheck_1 = require("../updateCheck");
function exit(code = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        if (code === 1) {
            console.log(`No name specified, and no SMA Server package.json found in current directory.`);
        }
        yield updateCheck_1.doUpdateCheck();
        process.exit();
    });
}
exports.exit = exit;
