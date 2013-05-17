/*jslint plusplus: true, devel: true, nomen: true, vars: true, node: true, es5: true, indent: 4, maxerr: 50 */
/*global require, exports, module */

var npm             = require("npm"),
    npmconf         = require("npmconf"),
    nopt            = require("nopt"),
    readInstalled   = require("../../node_modules/npm/node_modules/read-installed"),
    configDefs      = npmconf.defs,
    shorthands      = configDefs.shorthands,
    types           = configDefs.types,
    works           = require("../../lib/works"),
    path            = require("path"),
    semver          = require("semver");

exports.showInstalled = function (callback) {
    "use strict";
    
    readInstalled(process.cwd(), function (err, rootObj) {
        var list = [],
            deps = rootObj.dependencies,
            prop,
            mod;
        
        for (prop in deps) {
            if (deps.hasOwnProperty(prop)) {
                mod = deps[prop];
                list.push({
                    _id             : mod._id,
                    name            : mod.name,
                    version         : mod.version,
                    description     : mod.description,
                    isExtraneous    : mod.isExtraneous
                });
            }
        }
        callback(err, list);
    });
};

exports.getInstalledModule = function (id, callback) {
    "use strict";
    
    readInstalled(process.cwd(), function (err, rootObj) {
        var nv      = id.split("@"),
            name    = nv.shift(),
            ver     = semver.validRange(nv.join("@")) || "",
            dep     = rootObj.dependencies[name],
            mod     = {
                _id             : dep._id,
                name            : dep.name,
                version         : dep.version,
                description     : dep.description,
                isExtraneous    : dep.isExtraneous,
                author          : dep.author,
                repository      : dep.repository,
                readme          : dep.readme,
                bugs            : dep.bugs,
                license         : dep.license,
                homepage        : dep.homepage
            };
        
        callback(err, mod);
    });
};

works.namespaces.modules = exports;