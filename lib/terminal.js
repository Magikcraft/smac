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
const axios_1 = __importDefault(require("axios"));
const inquirer = __importStar(require("inquirer"));
const ts = __importStar(require("typescript"));
const typescript_simple_1 = require("typescript-simple");
const smac_1 = require("../bin/smac");
const server_1 = require("./server");
const SignalRef_1 = require("./SignalRef");
const stdout_1 = require("./stdout");
const exit_1 = require("./util/exit");
const inquirer_command_prompt_1 = require("./util/inquirer-command-prompt");
let tsMode = false;
const tss = new typescript_simple_1.TypeScriptSimple({
    module: ts.ModuleKind.CommonJS,
    noImplicitAny: false,
    //target: 1, //ts.ScriptTarget.ES5,
    removeComments: true,
}, false);
let previousLine = '';
const promptStdout = stdout_1.CustomStd('prompt'); // Not working with inquirer and command history, yet
const prompt = inquirer.createPromptModule({
    output: process.stdout,
});
const commandPromptWithHistory = prompt.registerPrompt('command', inquirer_command_prompt_1.CommandPrompt);
function startTerminal(serverTarget, started = false) {
    return __awaiter(this, void 0, void 0, function* () {
        // Workaround for https://github.com/SBoudrias/Inquirer.js/issues/293#issuecomment-422890996
        new SignalRef_1.SignalRef('SIGINT', () => __awaiter(this, void 0, void 0, function* () { return yield exit_1.exit(serverTarget); }));
        while (true) {
            yield inquire(serverTarget, started);
        }
    });
}
exports.startTerminal = startTerminal;
function inquire(serverTarget, started) {
    return __awaiter(this, void 0, void 0, function* () {
        const answers = yield prompt([
            {
                type: 'command',
                name: 'cmd',
                message: tsMode ? 'TS >' : '>',
                // optional
                autoCompletion: [
                    'js ',
                    'ts ',
                    'ts on',
                    'ts off',
                    'smac',
                    'mv',
                    'help',
                    'smac stop',
                ],
                context: 0,
                short: false,
                default: previousLine,
            },
        ]);
        if (answers && answers.cmd) {
            const command = (answers.cmd || '').trimLeft();
            if (command == 'ts on') {
                tsMode = true;
            }
            else if (command == 'ts off') {
                tsMode = false;
            }
            else {
                const isTSCommand = tsMode || command.indexOf(`ts `) === 0;
                const isSmacCommand = command.indexOf('smac ') === 0 ||
                    (command.indexOf('smac') === 0 && command.length === 4);
                if (isTSCommand) {
                    const ts = command.indexOf(`ts `) === 0
                        ? command.split('ts ')[1]
                        : command;
                    sendTSCommand(ts);
                }
                else if (isSmacCommand) {
                    smac_1.processCommand(command.split('smac ')[1], serverTarget);
                }
                else
                    sendCommand(command);
                previousLine = command;
            }
        }
    });
}
function sendTSCommand(spell) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const js = tss.compile(spell);
            console.log(js);
            sendCommand(`js ${js}`);
        }
        catch (e) {
            console.log(e.message);
        }
    });
}
function sendCommand(command) {
    return __awaiter(this, void 0, void 0, function* () {
        const rest = yield server_1.server.getRestConfig();
        const url = `http://localhost:${rest.port}/remoteExecuteCommand?command=${encodeURIComponent(command)}&apikey=${rest.password}`;
        try {
            yield axios_1.default.get(url);
        }
        catch (error) {
            console.log(`The call to ${url} failed with error: ${error}`);
            return false;
        }
    });
}
