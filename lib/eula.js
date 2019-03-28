"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const prompt_1 = __importDefault(require("prompt"));
const paths_1 = require("./paths");
function checkEula() {
    return __awaiter(this, void 0, void 0, function* () {
        const eulaPath = paths_1.smaPath('eula.json');
        if (!fs.existsSync(eulaPath)) {
            return promptEula(eulaPath);
        }
        else {
            try {
                const { accepted } = fs.readJSONSync(eulaPath);
                return accepted;
            }
            catch (e) {
                return false;
            }
        }
        return false;
    });
}
exports.checkEula = checkEula;
function promptEula(eulaPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            console.log('You must accept the Minecraft EULA to proceed.');
            console.log(' The full text is available at https://account.mojang.com/documents/minecraft_eula');
            const schema = {
                properties: {
                    accept: {
                        description: 'Accept the Minecraft EULA (Y/n)',
                        default: 'Y',
                        type: 'string',
                        conform: v => v.length === 1 && ['y', 'n'].includes(v.toLowerCase()),
                        required: true,
                    },
                },
            };
            prompt_1.default.message = '';
            prompt_1.default.start();
            prompt_1.default.get(schema, function (err, result) {
                if (result.accept.toLowerCase() === 'y') {
                    console.log('Accepted Minecraft EULA');
                    fs.writeJSONSync(eulaPath, { accepted: true });
                    return resolve(true);
                }
                else
                    return resolve(false);
            });
        });
    });
}
