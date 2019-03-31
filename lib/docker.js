"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const docker_cli_js_1 = require("docker-cli-js");
const paths_1 = require("./paths");
const options = new docker_cli_js_1.Options(undefined, __dirname);
const docker = new docker_cli_js_1.Docker(options);
exports.makeMount = (src, dst) => `--mount type=bind,src=${src},dst=${paths_1.dockerServerRoot}/${dst}`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9ja2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZG9ja2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQW9DO0FBQ3BDLGlEQUErQztBQUMvQyxtQ0FBMEM7QUFFMUMsTUFBTSxPQUFPLEdBQUcsSUFBSSx1QkFBTyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQTtBQUNqRCxNQUFNLE1BQU0sR0FBRyxJQUFJLHNCQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7QUFFckIsUUFBQSxTQUFTLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FDbEMseUJBQXlCLEdBQUcsUUFBUSx3QkFBZ0IsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUVwRCxRQUFBLE9BQU8sR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7QUFFakQsU0FBZ0IsaUJBQWlCO0lBQzdCLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDekIsb0JBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLFVBQVMsS0FBSztZQUM3QixJQUFJLEtBQUssRUFBRTtnQkFDUCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7YUFDakI7aUJBQU07Z0JBQ0gsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO2FBQ2hCO1FBQ0wsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDLENBQUMsQ0FBQTtBQUNOLENBQUM7QUFWRCw4Q0FVQyJ9