/*jslint plusplus: true, devel: true, nomen: true, vars: true, node: true, es5: true, indent: 4, maxerr: 50 */
/*global require, exports, module */

var npm         = require("npm"),
    npmconf     = require("npmconf"),
    nopt        = require("nopt"),
    configDefs  = npmconf.defs,
    shorthands  = configDefs.shorthands,
    types       = configDefs.types,
    works       = require("../../lib/works"),
    path        = require("path");

exports.showInstalled = function (callback) {
    "use strict";
    
    var conf = nopt(types, shorthands);
    conf._exit = true;
    npm.load(conf, function (err) {
        if (err) {
            callback(err);
        } else {
            npm.commands.list([], function (err, res) {
                callback(err, res);
            });
        }
    });
};

works.namespaces.modules = exports;