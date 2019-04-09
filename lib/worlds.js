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
const ghetto_monad_1 = require("ghetto-monad");
const sillyname_1 = __importDefault(require("sillyname"));
const download_1 = require("./download");
const paths_1 = require("./paths");
class World {
    constructor(worldSpec) {
        this.worldSpec = worldSpec;
        this.worldSpec.name =
            this.worldSpec.name ||
                sillyname_1.default()
                    .split(' ')
                    .join();
        this.worldSpec.version = this.worldSpec.version || '1.0.0';
        console.log(this.worldSpec);
    }
    getPath() {
        return __awaiter(this, void 0, void 0, function* () {
            const worldExistsLocally = targetPath => fs.existsSync(targetPath);
            const worldDir = `${this.worldSpec.name}/${this.worldSpec.version}`;
            const localPath = paths_1.localWorldPath(worldDir);
            const smaPath = paths_1.smaWorldPath(worldDir);
            if (worldExistsLocally(localPath)) {
                return new ghetto_monad_1.Result(localPath);
            }
            if (worldExistsLocally(smaPath)) {
                return new ghetto_monad_1.Result(smaPath);
            }
            if (!this.worldSpec.downloadUrl) {
                console.log(`World ${this.worldSpec.name} version ${this.worldSpec.version} not found locally, and no downloadUrl specified.`);
                console.log('Searched in:');
                console.log(`${localPath}`);
                console.log(`${smaPath}`);
                return new ghetto_monad_1.Nothing();
            }
            console.log(`Downloading ${this.worldSpec.name}`);
            return download_1.downloadZipFile(this.worldSpec, smaPath);
        });
    }
}
exports.World = World;
