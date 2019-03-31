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
            const nodeModules = fs.existsSync(paths_1.pluginsPath())
                ? docker.makeMount(paths_1.pluginsPath(), 'scriptcraft-plugins')
                : '';
            const bindings = (yield this.getCustomBindings())
                .map(({ src, dst }) => docker.makeMount(paths_1.localPath(src), dst))
                .join(' ');
            console.log('Found bindings in config:');
            console.log(bindings);
            return `${worlds} ${nodeModules} ${bindings}`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQXlCO0FBQ3pCLDZDQUE4QjtBQUM5QiwrQ0FBcUQ7QUFDckQsMkNBQTRCO0FBQzVCLGlEQUFrQztBQUNsQyxtQ0FBaUU7QUFDakUscUNBQWdDO0FBRWhDLE1BQU0sTUFBTTtJQVFSO1FBQ0ksSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUE7SUFDOUMsQ0FBQztJQUVLLDhCQUE4Qjs7WUFDaEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUE7WUFDekMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNoQixPQUFPLElBQUksc0JBQU8sRUFBRSxDQUFBO2FBQ3ZCO2lCQUFNO2dCQUNILE9BQU8sSUFBSSxxQkFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUE7YUFDM0M7UUFDTCxDQUFDO0tBQUE7SUFFSyxXQUFXLENBQUMsSUFBSTs7WUFDbEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUE7WUFDMUMsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxtQkFBVyxFQUFFLENBQUM7Z0JBQzVDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLG1CQUFXLEVBQUUsRUFBRSxxQkFBcUIsQ0FBQztnQkFDeEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtZQUNSLE1BQU0sUUFBUSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztpQkFDNUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsaUJBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFH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