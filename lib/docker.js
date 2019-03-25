"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var docker_cli_js_1 = require("docker-cli-js");
var options = new docker_cli_js_1.Options(undefined, __dirname);
var docker = new docker_cli_js_1.Docker(options);
exports.makeMount = function (src, dst) {
    return "--mount type=bind,src=" + src + ",dst=/server/" + dst;
};
exports.command = function (cmd) { return docker.command(cmd); };
function isDockerInstalled() {
    return new Promise(function (resolve) {
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
