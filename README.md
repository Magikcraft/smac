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
