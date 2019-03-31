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
const updateCheck_1 = require("../updateCheck");
function exit(target) {
    return __awaiter(this, void 0, void 0, function* () {
        if (target) {
            console.log(chalk_1.default.yellow(`\n\nServer ${target} is still running. Use '`) +
                chalk_1.default.blue(`smac stop ${target}'`) +
                chalk_1.default.yellow(' to stop it.'));
            console.log('');
        }
        yield updateCheck_1.doUpdateCheck();
        process.exit(0);
    });
}
exports.exit = exit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV4aXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLGtEQUF5QjtBQUN6QixnREFBOEM7QUFFOUMsU0FBc0IsSUFBSSxDQUFDLE1BQWU7O1FBQ3RDLElBQUksTUFBTSxFQUFFO1lBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FDUCxlQUFLLENBQUMsTUFBTSxDQUFDLGNBQWMsTUFBTSwwQkFBMEIsQ0FBQztnQkFDeEQsZUFBSyxDQUFDLElBQUksQ0FBQyxhQUFhLE1BQU0sR0FBRyxDQUFDO2dCQUNsQyxlQUFLLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUNuQyxDQUFBO1lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtTQUNsQjtRQUNELE1BQU0sMkJBQWEsRUFBRSxDQUFBO1FBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkIsQ0FBQztDQUFBO0FBWkQsb0JBWUMifQ==