"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const custom_stdout_1 = require("custom.stdout");
const stream_1 = require("stream");
const stdout = new custom_stdout_1.StdoutController(process.stdout);
exports.CustomStd = (name) => Object.assign(new stream_1.Writable({
    write(chunk, encoding, callback) {
        // console.log(
        //     { name },
        //     chunk.toString(),
        //     { encoding },
        //     { callback }
        // )
        stdout.out(chunk.toString(), name);
        callback();
    },
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Rkb3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3Rkb3V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQWdEO0FBQ2hELG1DQUFpQztBQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLGdDQUFnQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUV0QyxRQUFBLFNBQVMsR0FBRyxDQUFDLElBQWEsRUFBRSxFQUFFLENBQ3ZDLE1BQU0sQ0FBQyxNQUFNLENBQ1QsSUFBSSxpQkFBUSxDQUFDO0lBQ1QsS0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUTtRQUMzQixlQUFlO1FBQ2YsZ0JBQWdCO1FBQ2hCLHdCQUF3QjtRQUN4QixvQkFBb0I7UUFDcEIsbUJBQW1CO1FBQ25CLElBQUk7UUFDSixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNsQyxRQUFRLEVBQUUsQ0FBQTtJQUNkLENBQUM7Q0FDSixDQUFDLENBQ0wsQ0FBQSJ9