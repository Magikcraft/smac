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
