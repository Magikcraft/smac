"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const docker_cli_js_1 = require("docker-cli-js");
const options = new docker_cli_js_1.Options(undefined, __dirname);
const docker = new docker_cli_js_1.Docker(options);
exports.makeMount = (src, dst) => `--mount type=bind,src=${src},dst=/server/${dst}`;
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
