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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXVsYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV1bGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBOEI7QUFDOUIsb0RBQTJCO0FBQzNCLG1DQUFpQztBQUVqQyxTQUFzQixTQUFTOztRQUMzQixNQUFNLFFBQVEsR0FBRyxlQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDckMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDMUIsT0FBTyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7U0FDOUI7YUFBTTtZQUNILElBQUk7Z0JBQ0EsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUE7Z0JBQzlDLE9BQU8sUUFBUSxDQUFBO2FBQ2xCO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1IsT0FBTyxLQUFLLENBQUE7YUFDZjtTQUNKO1FBQ0QsT0FBTyxLQUFLLENBQUE7SUFDaEIsQ0FBQztDQUFBO0FBYkQsOEJBYUM7QUFFRCxTQUFlLFVBQVUsQ0FBQyxRQUFROztRQUM5QixPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0RBQWdELENBQUMsQ0FBQTtZQUM3RCxPQUFPLENBQUMsR0FBRyxDQUNQLG9GQUFvRixDQUN2RixDQUFBO1lBQ0QsTUFBTSxNQUFNLEdBQUc7Z0JBQ1gsVUFBVSxFQUFFO29CQUNSLE1BQU0sRUFBRTt3QkFDSixXQUFXLEVBQUUsaUNBQWlDO3dCQUM5QyxPQUFPLEVBQUUsR0FBRzt3QkFDWixJQUFJLEVBQUUsUUFBUTt3QkFDZCxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FDVCxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUMxRCxRQUFRLEVBQUUsSUFBSTtxQkFDakI7aUJBQ0o7YUFDSixDQUFBO1lBQ0QsZ0JBQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFBO1lBQ25CLGdCQUFNLENBQUMsS0FBSyxFQUFFLENBQUE7WUFDZCxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBUyxHQUFHLEVBQUUsTUFBTTtnQkFDbkMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxLQUFLLEdBQUcsRUFBRTtvQkFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO29CQUN0QyxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO29CQUM5QyxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtpQkFDdkI7O29CQUFNLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ2hDLENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0NBQUEifQ==