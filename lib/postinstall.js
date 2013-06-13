/*jslint plusplus: true, devel: true, nomen: true, vars: true, node: true, indent: 4, maxerr: 50 */
/*global require, exports, module */

var fs          = require("fs"),
    path        = require("path"),
    dir         = path.join(__dirname, "..", "brackets-src", "src", "extensibility", "node");

fs.rename(path.join(dir, "_package.json"), path.join(dir, "package.json"), function (err) {
    "use strict";
    
    if (err) {
        throw err;
    }
});

fs.rename(path.join(dir, "_node_modules"), path.join(dir, "node_modules"), function (err) {
    "use strict";
    
    if (err) {
        throw err;
    }
});