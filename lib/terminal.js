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
                message: '>',
                // optional
                autoCompletion: ['js ', 'ts ', 'smac', 'mv', 'help', 'smac stop'],
                context: 0,
                short: false,
                default: previousLine,
            },
        ]);
        if (answers && answers.cmd) {
            const command = answers.cmd;
            const isTSCommand = command.indexOf(`ts `) === 0;
            const isSmacCommand = command.indexOf('smac ') === 0 ||
                (command.indexOf('smac') === 0 && command.length === 4);
            if (isTSCommand) {
                sendTSCommand(command.split('ts ')[1]);
            }
            else if (isSmacCommand) {
                smac_1.processCommand(command.split('smac ')[1], serverTarget);
            }
            else
                sendCommand(command);
            previousLine = command;
        }
    });
}
function sendTSCommand(spell) {
    return __awaiter(this, void 0, void 0, function* () {
        const js = tss.compile(spell);
        console.log(js);
        sendCommand(`js ${js}`);
    });
}
function sendCommand(command) {
    return __awaiter(this, void 0, void 0, function* () {
        const rest = yield server_1.server.getRestConfig();
        const url = `http://localhost:${rest.port}/remoteExecuteCommand?command=${encodeURIComponent(command)}&apikey=${rest.password}`;
        try {
            axios_1.default.get(url);
        }
        catch (error) {
            console.log(`The call to ${url} failed with error: ${error}`);
            return false;
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVybWluYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZXJtaW5hbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGtEQUF5QjtBQUN6QixtREFBb0M7QUFDcEMsK0NBQWdDO0FBQ2hDLHlEQUFvRDtBQUNwRCxzQ0FBNEM7QUFDNUMscUNBQWlDO0FBQ2pDLDJDQUF1QztBQUN2QyxxQ0FBb0M7QUFDcEMsc0NBQWtDO0FBQ2xDLDRFQUE4RDtBQUU5RCxNQUFNLEdBQUcsR0FBRyxJQUFJLG9DQUFnQixDQUM1QjtJQUNJLE1BQU0sRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVE7SUFDOUIsYUFBYSxFQUFFLEtBQUs7SUFDcEIsbUNBQW1DO0lBQ25DLGNBQWMsRUFBRSxJQUFJO0NBRXZCLEVBQ0QsS0FBSyxDQUNSLENBQUE7QUFDRCxJQUFJLFlBQVksR0FBVyxFQUFFLENBQUE7QUFFN0IsTUFBTSxZQUFZLEdBQUcsa0JBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQSxDQUFDLHFEQUFxRDtBQUU5RixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsa0JBQWtCLENBQUM7SUFDdkMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO0NBQ3pCLENBQUMsQ0FBQTtBQUNGLE1BQU0sd0JBQXdCLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FDbEQsU0FBUyxFQUNULHVDQUFvQixDQUN2QixDQUFBO0FBRUQsU0FBc0IsYUFBYSxDQUFDLFlBQW9CLEVBQUUsT0FBTyxHQUFHLEtBQUs7O1FBQ3JFLDRGQUE0RjtRQUM1RixJQUFJLHFCQUFTLENBQUMsUUFBUSxFQUFFLEdBQVMsRUFBRSxnREFBQyxPQUFBLE1BQU0sV0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFBLEdBQUEsQ0FBQyxDQUFBO1FBQzdELE9BQU8sSUFBSSxFQUFFO1lBQ1QsTUFBTSxPQUFPLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1NBQ3ZDO0lBQ0wsQ0FBQztDQUFBO0FBTkQsc0NBTUM7QUFFRCxTQUFlLE9BQU8sQ0FBQyxZQUFZLEVBQUUsT0FBTzs7UUFDeEMsTUFBTSxPQUFPLEdBQUcsTUFBTSxNQUFNLENBQWtCO1lBQzFDO2dCQUNJLElBQUksRUFBRSxTQUFTO2dCQUNmLElBQUksRUFBRSxLQUFLO2dCQUNYLE9BQU8sRUFBRSxHQUFHO2dCQUNaLFdBQVc7Z0JBQ1gsY0FBYyxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUM7Z0JBQ2pFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLEtBQUssRUFBRSxLQUFLO2dCQUNaLE9BQU8sRUFBRSxZQUFZO2FBQ3hCO1NBQ0csQ0FBQyxDQUFBO1FBQ1QsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtZQUN4QixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFBO1lBQzNCLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ2hELE1BQU0sYUFBYSxHQUNmLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztnQkFDOUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFBO1lBQzNELElBQUksV0FBVyxFQUFFO2dCQUNiLGFBQWEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7YUFDekM7aUJBQU0sSUFBSSxhQUFhLEVBQUU7Z0JBQ3RCLHFCQUFjLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQTthQUMxRDs7Z0JBQU0sV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzNCLFlBQVksR0FBRyxPQUFPLENBQUE7U0FDekI7SUFDTCxDQUFDO0NBQUE7QUFFRCxTQUFlLGFBQWEsQ0FBQyxLQUFhOztRQUN0QyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDZixXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBQzNCLENBQUM7Q0FBQTtBQUVELFNBQWUsV0FBVyxDQUFDLE9BQWU7O1FBQ3RDLE1BQU0sSUFBSSxHQUFHLE1BQU0sZUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ3pDLE1BQU0sR0FBRyxHQUFHLG9CQUNSLElBQUksQ0FBQyxJQUNULGlDQUFpQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsV0FDeEQsSUFBSSxDQUFDLFFBQ1QsRUFBRSxDQUFBO1FBQ0YsSUFBSTtZQUNBLGVBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7U0FDakI7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxHQUFHLHVCQUF1QixLQUFLLEVBQUUsQ0FBQyxDQUFBO1lBQzdELE9BQU8sS0FBSyxDQUFBO1NBQ2Y7SUFDTCxDQUFDO0NBQUEifQ==