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
const smac_1 = require("../bin/smac");
const server_1 = require("./server");
const SignalRef_1 = require("./SignalRef");
const stdout_1 = require("./stdout");
const exit_1 = require("./util/exit");
const inquirer_command_prompt_1 = require("./util/inquirer-command-prompt");
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
                autoCompletion: ['js', 'smac', 'mv', 'help', 'smac stop'],
                context: 0,
                short: false,
                default: previousLine,
            },
        ]);
        if (answers && answers.cmd) {
            const command = answers.cmd;
            const isSmacCommand = command.indexOf('smac ') === 0 ||
                (command.indexOf('smac') === 0 && command.length === 4);
            if (isSmacCommand) {
                smac_1.processCommand(command.split('smac ')[1], serverTarget);
            }
            else
                sendCommand(command);
            previousLine = command;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVybWluYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZXJtaW5hbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGtEQUF5QjtBQUN6QixtREFBb0M7QUFDcEMsc0NBQTRDO0FBQzVDLHFDQUFpQztBQUNqQywyQ0FBdUM7QUFDdkMscUNBQW9DO0FBQ3BDLHNDQUFrQztBQUNsQyw0RUFBOEQ7QUFFOUQsSUFBSSxZQUFZLEdBQVcsRUFBRSxDQUFBO0FBRTdCLE1BQU0sWUFBWSxHQUFHLGtCQUFTLENBQUMsUUFBUSxDQUFDLENBQUEsQ0FBQyxxREFBcUQ7QUFFOUYsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGtCQUFrQixDQUFDO0lBQ3ZDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtDQUN6QixDQUFDLENBQUE7QUFDRixNQUFNLHdCQUF3QixHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQ2xELFNBQVMsRUFDVCx1Q0FBb0IsQ0FDdkIsQ0FBQTtBQUVELFNBQXNCLGFBQWEsQ0FBQyxZQUFvQixFQUFFLE9BQU8sR0FBRyxLQUFLOztRQUNyRSw0RkFBNEY7UUFDNUYsSUFBSSxxQkFBUyxDQUFDLFFBQVEsRUFBRSxHQUFTLEVBQUUsZ0RBQUMsT0FBQSxNQUFNLFdBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQSxHQUFBLENBQUMsQ0FBQTtRQUM3RCxPQUFPLElBQUksRUFBRTtZQUNULE1BQU0sT0FBTyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQTtTQUN2QztJQUNMLENBQUM7Q0FBQTtBQU5ELHNDQU1DO0FBRUQsU0FBZSxPQUFPLENBQUMsWUFBWSxFQUFFLE9BQU87O1FBQ3hDLE1BQU0sT0FBTyxHQUFHLE1BQU0sTUFBTSxDQUFrQjtZQUMxQztnQkFDSSxJQUFJLEVBQUUsU0FBUztnQkFDZixJQUFJLEVBQUUsS0FBSztnQkFDWCxPQUFPLEVBQUUsR0FBRztnQkFDWixXQUFXO2dCQUNYLGNBQWMsRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUM7Z0JBQ3pELE9BQU8sRUFBRSxDQUFDO2dCQUNWLEtBQUssRUFBRSxLQUFLO2dCQUNaLE9BQU8sRUFBRSxZQUFZO2FBQ3hCO1NBQ0csQ0FBQyxDQUFBO1FBQ1QsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtZQUN4QixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFBO1lBQzNCLE1BQU0sYUFBYSxHQUNmLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztnQkFDOUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFBO1lBQzNELElBQUksYUFBYSxFQUFFO2dCQUNmLHFCQUFjLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQTthQUMxRDs7Z0JBQU0sV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzNCLFlBQVksR0FBRyxPQUFPLENBQUE7U0FDekI7SUFDTCxDQUFDO0NBQUE7QUFFRCxTQUFlLFdBQVcsQ0FBQyxPQUFlOztRQUN0QyxNQUFNLElBQUksR0FBRyxNQUFNLGVBQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUN6QyxNQUFNLEdBQUcsR0FBRyxvQkFDUixJQUFJLENBQUMsSUFDVCxpQ0FBaUMsT0FBTyxXQUFXLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUNsRSxJQUFJO1lBQ0EsZUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUNqQjtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEdBQUcsdUJBQXVCLEtBQUssRUFBRSxDQUFDLENBQUE7WUFDN0QsT0FBTyxLQUFLLENBQUE7U0FDZjtJQUNMLENBQUM7Q0FBQSJ9