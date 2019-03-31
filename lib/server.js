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
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs-extra"));
const ghetto_monad_1 = require("ghetto-monad");
const path = __importStar(require("path"));
const docker = __importStar(require("./docker"));
const paths_1 = require("./paths");
const worlds_1 = require("./worlds");
class Server {
    constructor() {
        this.serverConfig = this.getServerConfig();
    }
    getServerTargetFromPackageJson() {
        return __awaiter(this, void 0, void 0, function* () {
            const conf = yield this.getServerConfig();
            if (conf.isNothing) {
                return new ghetto_monad_1.Nothing();
            }
            else {
                return new ghetto_monad_1.Result(conf.value.serverName);
            }
        });
    }
    getBindings(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const worlds = yield this.getWorldMounts();
            const bindings = (yield this.getCustomBindings())
                .map(({ src, dst }) => docker.makeMount(paths_1.localPath(src), dst))
                .join(' ');
            console.log('Found bindings in config:');
            console.log(bindings);
            return `${worlds} ${bindings}`;
        });
    }
    getWorldMounts() {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for worlds in the local worlds folder
            const localMounts = this.getLocalWorldMounts();
            // Parse worldDefinitions and make mounts
            const smaMounts = yield this.getSmaWorldMounts();
            // Make them unique - prefer local
            const allMounts = {};
            localMounts.map(({ src, dst }) => {
                allMounts[dst] = { src, dst };
            });
            for (const smaMount of smaMounts) {
                // Do we need to scan these dirs?
                console.log(`Found: ${smaMount.src}`);
                const existingMount = allMounts[smaMount.dst];
                if (existingMount) {
                    if (smaMount.src !== existingMount.src) {
                        console.log(chalk_1.default.redBright(`Duplicate worlds found at ${smaMount.src} and ${existingMount.src}`));
                        console.log(chalk_1.default.yellowBright(`Using world from ${existingMount.src}`));
                    }
                }
                else {
                    allMounts[smaMount.dst] = smaMount;
                }
            }
            if (Object.keys(allMounts).length > 0) {
                console.log(`Loading the following worlds:`);
            }
            return Object.keys(allMounts)
                .map(m => {
                console.log(allMounts[m]);
                const r = docker.makeMount(allMounts[m].src, allMounts[m].dst);
                return r;
            })
                .join(' ');
        });
    }
    getLocalWorldMounts() {
        const mountData = (name, path) => ({
            src: `${path}/${name}`,
            dst: `worlds/${name}`,
        });
        const localPath = paths_1.localWorldsPath();
        console.log('Scanning local directory:', localPath);
        if (fs.existsSync(localPath)) {
            const dirs = fs.readdirSync(localPath);
            return dirs.map(name => {
                console.log('Found:', path.join(localPath, name));
                const m = mountData(name, localPath);
                return m;
            });
        }
        return [];
    }
    getSmaWorldMounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const mountData = (name, path) => ({
                src: `${path}/${name}`,
                dst: `worlds/${name}`,
            });
            console.log('Checking world definitions in package.json');
            const worldDefs = yield this.getWorldDefinitions();
            if (worldDefs.isNothing) {
                console.log('None found.');
                return [];
            }
            const worlds = worldDefs.value.map(d => new worlds_1.World(d));
            let smaMounts = [];
            for (const world of worlds) {
                const path = yield world.getPath();
                if (!path.isNothing && !path.isError) {
                    if (fs.existsSync(path.value)) {
                        const dirs = fs.readdirSync(path.value);
                        dirs.map(name => {
                            smaMounts = [...smaMounts, mountData(name, path.value)];
                        });
                        return smaMounts;
                    }
                }
            }
            if (smaMounts.length != worlds.length) {
                console.log(chalk_1.default.red('WARNING: Some worlds specified in the Worlds definition are not available.'));
            }
            return smaMounts;
        });
    }
    getDockerTag() {
        return __awaiter(this, void 0, void 0, function* () {
            const conf = yield this.getServerConfig();
            if (conf.isNothing || !conf.value.dockerTag) {
                return Server.defaultDockerTag;
            }
            else {
                return conf.value.dockerTag;
            }
        });
    }
    getPort() {
        return __awaiter(this, void 0, void 0, function* () {
            const conf = yield this.getServerConfig();
            if (conf.isNothing || !conf.value.port) {
                return Server.defaultPort;
            }
            else {
                return conf.value.port;
            }
        });
    }
    getMemoryConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const conf = yield this.getServerConfig();
            if (conf.isNothing || !conf.value.memory) {
                return Server.defaultMemory;
            }
            else {
                return conf.value.memory;
            }
        });
    }
    getRestConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const conf = yield this.getServerConfig();
            const defaultConfig = {
                port: Server.restPort,
                password: Server.restPassword,
            };
            if (conf.isNothing || !conf.value.restEndpoint) {
                return defaultConfig;
            }
            else {
                return Object.assign({}, defaultConfig, conf.value.restEndpoint);
            }
        });
    }
    getEnvironment() {
        return __awaiter(this, void 0, void 0, function* () {
            const memory = yield this.getMemoryConfig();
            const restConfig = yield this.getRestConfig();
            const env = [];
            env.push(`-e SERVERMEM=${memory}`);
            env.push(`-e MINECRAFT_REST_CONSOLE_PORT=${restConfig.port}`);
            env.push(`-e MINECRAFT_REST_CONSOLE_API_KEY=${restConfig.password}`);
            return env.join(' ');
        });
    }
    getCustomBindings() {
        return __awaiter(this, void 0, void 0, function* () {
            const conf = yield this.getServerConfig();
            if (conf.isNothing || !conf.value.bind) {
                return [];
            }
            else {
                return conf.value.bind;
            }
        });
    }
    getServerConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.serverConfig) {
                return this.serverConfig;
            }
            const cwd = process.cwd();
            const pkgPath = path.join(cwd, 'package.json');
            if (!fs.existsSync(pkgPath)) {
                return new ghetto_monad_1.Nothing();
            }
            const md = yield Promise.resolve().then(() => __importStar(require(pkgPath)));
            if (!md.smaServerConfig) {
                return new ghetto_monad_1.Nothing();
            }
            return new ghetto_monad_1.Result(md.smaServerConfig);
        });
    }
    getWorldDefinitions() {
        return __awaiter(this, void 0, void 0, function* () {
            const conf = yield this.getServerConfig();
            if (conf.isNothing || !conf.value.worlds) {
                return new ghetto_monad_1.Nothing();
            }
            else {
                return new ghetto_monad_1.Result(conf.value.worlds);
            }
        });
    }
}
Server.defaultPort = 25565;
Server.defaultDockerTag = 'latest';
Server.defaultMemory = 2048;
Server.restPort = 8086;
Server.restPassword = 'INSECURE';
exports.server = new Server();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQXlCO0FBQ3pCLDZDQUE4QjtBQUM5QiwrQ0FBcUQ7QUFDckQsMkNBQTRCO0FBQzVCLGlEQUFrQztBQUNsQyxtQ0FBb0Q7QUFDcEQscUNBQWdDO0FBRWhDLE1BQU0sTUFBTTtJQVFSO1FBQ0ksSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUE7SUFDOUMsQ0FBQztJQUVLLDhCQUE4Qjs7WUFDaEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUE7WUFDekMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNoQixPQUFPLElBQUksc0JBQU8sRUFBRSxDQUFBO2FBQ3ZCO2lCQUFNO2dCQUNILE9BQU8sSUFBSSxxQkFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUE7YUFDM0M7UUFDTCxDQUFDO0tBQUE7SUFFSyxXQUFXLENBQUMsSUFBSTs7WUFDbEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUE7WUFFMUMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO2lCQUM1QyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxpQkFBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2lCQUM1RCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUE7WUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUNyQixPQUFPLEdBQUcsTUFBTSxJ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