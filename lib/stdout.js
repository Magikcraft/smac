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
