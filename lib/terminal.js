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
const ansi_escapes_1 = __importDefault(require("ansi-escapes"));
const axios_1 = __importDefault(require("axios"));
const prompt_1 = __importDefault(require("prompt"));
const commands_1 = require("../commands");
const commandMap_1 = require("../commands/commandMap.");
const server_1 = require("./server");
const exit_1 = require("./util/exit");
function startTerminal(serverTarget, started = false) {
    const schema = {
        properties: {
            command: {
                description: 'Command >',
                default: '',
                type: 'string',
                required: true,
            },
        },
    };
    prompt_1.default.message = '';
    prompt_1.default.start();
    prompt_1.default.get(schema, function (err, result) {
        console.log(result);
        if (result && result.command) {
            const command = result.command;
            const isSmacCommand = command.indexOf('smac ') === 0;
            if (isSmacCommand) {
                return processSmacCommand(command.split('smac ')[1], serverTarget, started);
            }
            else
                sendCommand(command);
        }
        startTerminal(serverTarget, started);
    });
}
exports.startTerminal = startTerminal;
function _startTerminal(serverTarget, started = false) {
    const readline = require('readline');
    let line;
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }
    readline.emitKeypressEvents(process.stdin, rl);
    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            exit_1.exit(serverTarget);
        }
        else if (key.name === 'left') {
            process.stdout.write(ansi_escapes_1.default.cursorBackward() + ansi_escapes_1.default.cursorLeft);
        }
        else if (key.name === 'right') {
            process.stdout.write(ansi_escapes_1.default.cursorForward());
        }
        else if (key.name === 'return') {
            const isSmacCommand = line.indexOf('smac ') === 0;
            if (isSmacCommand) {
                return processSmacCommand(line.split('smac ')[1], serverTarget, started);
            }
            else
                sendCommand(line);
        }
        else {
            process.stdout.write(str);
            line += str;
        }
        // console.log(key)
    });
    rl.on('line', function (line) {
        const isSmacCommand = line.indexOf('smac ') === 0;
        if (isSmacCommand) {
            return processSmacCommand(line.split('smac ')[1], serverTarget, started);
        }
        else
            sendCommand(line);
    });
}
exports._startTerminal = _startTerminal;
function processSmacCommand(command, target, started) {
    return __awaiter(this, void 0, void 0, function* () {
        if (command === commandMap_1.commandMap.stop.name) {
            yield commands_1.stopServer(target);
            return exit_1.exit();
        }
        /* Need to handle `smac logs` from a different dir
            So, write a JSON config when starting
        */
        if (command === commandMap_1.commandMap.restart.name) {
            yield commands_1.stopServer(target);
            if (started) {
                yield commands_1.startServer(target);
            }
            else {
                console.log('Cannot reliably restart server from log command. Restart it manually.');
                exit_1.exit();
            }
        }
    });
}
function sendCommand(command) {
    return __awaiter(this, void 0, void 0, function* () {
        const rest = yield server_1.server.getRestConfig();
        const url = `http://localhost:${rest.port}/remoteExecuteCommand?command=${command}&apikey=${rest.password}`;
        try {
            axios_1.default.get(url);
        }
        catch (error) {
            console.log(`The call to ${url} failed with error: ${error}`);
            return false;
        }
    });
}
