/*jslint plusplus: true, devel: true, nomen: true, vars: true, node: true, es5: true, indent: 4, maxerr: 50 */
/*global require, exports, module */

var fs              = require("fs"),
    npm             = require("npm"),
    path            = require("path"),
    npmconf         = require("npmconf"),
    _               = require("underscore"),
    nopt            = require("nopt"),
    readInstalled   = require("../../node_modules/npm/node_modules/read-installed"),
    configDefs      = npmconf.defs,
    shorthands      = configDefs.shorthands,
    types           = configDefs.types,
    works           = require("../../lib/works"),
    path            = require("path"),
    semver          = require("semver"),
    marked          = require("marked"),
    mustach         = require("../../brackets-src/src/thirdparty/mustache"),
    codeMirror      = require("../../lib/CodeMirror"),
    readmeTmpl;

_.str = require("underscore.string");
_.mixin(_.str.exports());

marked.setOptions({
    sanitize: true,
    smartLists: true,
    breaks: true,
    highlight: function (code, lang) {
        "use strict";
        
        var mode, buff;
        
        if (lang) {
            buff = "";
            codeMirror.runMode(code, lang, function (text, style) {
                if (style) {
                    buff += "<span class=\"cm-" + style + "\">" + _(text).escapeHTML() + "</span>";
                } else {
                    buff += _(text).escapeHTML();
                }
            });
            code = buff;
        }
        
        return code;
    }
});

works.registerHttpHandler({
    path    : "/modules/readme/",
    handle  : function (req, res) {
        "use strict";
        
        var name = req.url.substr(16);
        
        readInstalled(process.cwd(), function (err, rootObj) {
            var dep, model;
            
            if (err) {
                res.writeHead(500, {"Content-Type": "text/plain; charset=UTF-8"});
                res.write(err);
                res.end();
            } else {
                dep = rootObj.dependencies[name];
                if (dep) {
                    if (!readmeTmpl) {
                        readmeTmpl = fs.readFileSync(path.join(__dirname, "readme.html"), "utf8");
                    }
                    
                    model = {
                        title: "README: " + name,
                        body: marked(dep.readme)
                    };
                    
                    res.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
                    res.write(mustach.render(readmeTmpl, model));
                    res.end();
                } else {
                    res.writeHead(404, {"Content-Type": "text/plain; charset=UTF-8"});
                    res.write("Not Found");
                    res.end();
                }
            }
        });
    }
});

function surrogate(deps, recur) {
    "use strict";
    
    var list = [],
        prop,
        mod,
        surr;
    
    for (prop in deps) {
        if (deps.hasOwnProperty(prop)) {
            mod = deps[prop];
            if (typeof mod === "string") {
                list.push({
                    _id             : prop + "@" + mod,
                    name            : prop,
                    version         : mod,
                    description     : "Error: Unmet Dependency",
                    error           : "unmet-dependency"
                });
            } else {
                surr = {
                    _id             : mod._id,
                    name            : mod.name,
                    version         : mod.version,
                    description     : mod.description,
                    isExtraneous    : mod.isExtraneous,
                    depsCount       : Object.keys(mod.dependencies).length
                };
                
                if (recur) {
                    surr.deps = surrogate(mod.dependencies, recur);
                }
                list.push(surr);
            }
        }
    }
    
    return list;
}

exports.showInstalled = function (callback) {
    "use strict";
    
    readInstalled(process.cwd(), function (err, rootObj) {
        callback(err, surrogate(rootObj.dependencies));
    });
};

exports.getInstalledModule = function (id, callback) {
    "use strict";
    
    readInstalled(process.cwd(), function (err, rootObj) {
        var nv      = id.split("@"),
            name    = nv.shift(),
            dep     = rootObj.dependencies[name],
            mod     = {
                _id             : dep._id,
                name            : dep.name,
                version         : dep.version,
                description     : dep.description,
                isExtraneous    : dep.isExtraneous,
                author          : dep.author,
                repository      : dep.repository,
                readmeFilename  : dep.readmeFilename,
                bugs            : dep.bugs,
                license         : dep.license,
                homepage        : dep.homepage,
                depsCount       : Object.keys(dep.dependencies).length
            };
        
        callback(err, mod);
    });
};

exports.getDeps = function (id, callback) {
    "use strict";
    
    readInstalled(process.cwd(), function (err, rootObj) {
        var nv      = id.split("@"),
            name    = nv.shift(),
            dep     = rootObj.dependencies[name];
        
        callback(err, surrogate(dep.dependencies, true));
    });
};

works.namespaces.modules = exports;