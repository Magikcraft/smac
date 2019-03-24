'use strict'
exports.__esModule = true
var path = require('path')
var cwd = process.cwd()
exports.localPath = function(p) {
    return path.join(cwd, p)
}
exports.worldsPath = function() {
    return exports.localPath('worlds')
}
exports.pluginsPath = function() {
    return exports.localPath('node_modules')
}
