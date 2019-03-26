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
const axios_1 = __importDefault(require("axios"));
const server_1 = require("./server");
function startTerminal() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });
    rl.on('line', function (line) {
        sendCommand(line);
    });
}
exports.startTerminal = startTerminal;
function sendCommand(command) {
    return __awaiter(this, void 0, void 0, function* () {
        const rest = yield server_1.server.getRestConfig();
        const url = `http://localhost:${rest.port}/remoteExecuteCommand?command=${command}&apikey=${rest.password}`;
        try {
            console.log((yield axios_1.default.get(url)).data);
        }
        catch (error) {
            console.log(`The call to ${url} failed with error: ${error}`);
            return false;
        }
    });
}
