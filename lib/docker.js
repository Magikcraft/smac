"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const docker_cli_js_1 = require("docker-cli-js");
const paths_1 = require("./paths");
const options = new docker_cli_js_1.Options(undefined, __dirname);
const docker = new docker_cli_js_1.Docker(options);
exports.images = {
    bukkit: 'magikcraft/scriptcraft',
    nukkit: 'magikcraft/nukkitcraft',
};
// @TODO: deal with namespaced modules
class Binder {
    constructor() {
        this.mounts = {};
        this.makeMount = (src, dst) => {
            if (this.mounts[dst]) {
                console.warn('Duplicate bind detected:');
                console.warn(`Using:`);
                console.warn({ dst: this.mounts[dst], src });
                console.log(`NOT Using:`);
                console.log({ dst, src });
                return '';
            }
            this.mounts[dst] = src;
            return `--mount type=bind,src=${src},dst=${paths_1.dockerServerRoot}/${dst}`;
        };
    }
}
exports.Binder = Binder;
exports.command = cmd => docker.command(cmd);
function isDockerInstalled() {
    return new Promise(resolve => {
        child_process_1.exec('docker', {}, function (error) {
            if (error) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        });
    });
}
exports.isDockerInstalled = isDockerInstalled;
