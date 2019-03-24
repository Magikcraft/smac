# SMA Server

## Install

```bash
npm i -g scriptcraft-sma
```

## Run

```bash
scriptcraft-sma
```

```
➜ scriptcraft-sma
Version 0.0.4

Usage:
sma <command>

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

Here is an example configuration that I use to work on the MCT1 plugin.

I have the `@magikcraft/op-all` plugin installed to give myself op on the server automatically, and I use `npm link` to add the MCT1 plugin to the directory. So, in the checkout of the MCT1 plugin where I am working, I do:

```bash
npm link
```

Then in the directory with my server config, I do:

```bash
npm link @magikcraft/mct1
```

This symlinks my development check-out into the `node_modules`.

Then I have this in my server `package.json`:

```json
"smaServerConfig": {
  "dockerTag": "latest",
  "port": "25565",
  "serverName": "mct1-dev",
  "bind": [
    {
      "src": "../mct1-worlds",
      "dst": "worlds"
    }
  ]
}
```
