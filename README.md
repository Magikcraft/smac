# SMA Controller - Scriptcraft Modular Architecture

Manages dockerised Minecraft servers for developing and deploying Javascript Minecraft plugins written using [Scriptcraft](https://github.com/walterhiggins/ScriptCraft) and the [Scriptcraft Modular Architecture](https://github.com/Magikcraft/scriptcraft-modular-arch).

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
