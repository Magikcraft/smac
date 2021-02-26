# SMA Controller - Scriptcraft Modular Architecture

Manages dockerised Minecraft servers for developing and deploying Javascript Minecraft plugins written using [Scriptcraft](https://github.com/walterhiggins/ScriptCraft) and the [Scriptcraft Modular Architecture](https://github.com/Magikcraft/scriptcraft-modular-arch).

## Note for users on Windows

See this [issue comment](https://github.com/Magikcraft/smac/issues/7#issuecomment-785122292) to enable this to work on Windows.

## Install

```bash
npm i -g smac
```

## Run

```bash
smac
```

```
➜ smac
Version 0.0.4

Usage:
smac <command>

Available commands:
COMMAND DESCRIPTION
start   Start a server
stop    Stop a server
status  Get the status of a server
version Output version information
list    List running SMA servers
inspect Inspect a running server
```

## Terminal

When the logs are streaming - either from the `start` command or the `logs` command - you have an interactive terminal that pipes your commands to the server.

This is slightly different from typing directly at the server console of a running server. What you type here is sent to the server over HTTP and executed asynchronously as the Console Sender.

You can execute arbitrary javascript using the `js` command, for example:

```
js refresh()
```

There are two additional commands that the terminal supports:

-   `smac` - smac stop is supported to allow you to stop the server from the terminal.
-   `ts` - execute arbitrary TypeScript. The code that follows this command is transpiled to ES5 and sent to the server with `js`.
    For example:

```
ts [1,2,3].map(i => i+1)
```

Is transpiled to:

```javascript
;[1, 2, 3].map(function(i) {
    return i + 1
})
```

Resulting in:

```
? > (ts [1,2,3].map(i => i+1)) [05:57:40 INFO]: [MinecraftRESTConsole] server remote executes js [1, 2, 3].map(function (i) { return i + 1; });
```

## Generate config

Use the [sma-server Yeoman generator](https://github.com/Magikcraft/generator-sma-server) to generate a configuration.

The configuration is a `package.json` file with a `smaServerConfig` key. This key contains the metadata to configure the server at run-time.

## Custom bindings

You can custom bind directories in an `smaServerConfig`. This is useful when you are working on a package and want to mount it into the server.

Here is an example configuration that I use to work on the MCT1 plugin. I custom bind the mct1 worlds from their local repo checkout.

I have the `@magikcraft/op-all` plugin installed to give myself op on the server automatically, and I bind the local checkout of the MCT1 plugin into the server to test my changes as I make them.

Note: `npm link` is a standard way to work on a local check-out of a package, however, this doesn't work by default on a Mac with docker.

Please see [this issue](https://github.com/Magikcraft/scriptcraft-sma/issues/1) about using `npm link` with SMA on Mac OS. You must change your Docker preferences for it to work.

Using a custom bind is a way to do this without having to configure Docker.

I have this subkey in my server's `package.json`:

```json
"smaServerConfig": {
  "dockerTag": "latest",
  "port": "25565",
  "serverName": "mct1-dev",
  "bind": [
    {
      "src": "../mct1-worlds",
      "dst": "worlds"
    },
    {
        "src": "../mct1",
        "dst": "scriptcraft-plugins/@magikcraft/mct1"
    }
  ]
}
```

## Development

To dev on this utility, run:

```bash
npm i
npm link
npm run dev
```

This will link your checkout to the global `smac` command, and start a compiling watcher that transpiles changes and updates the linked binary.
