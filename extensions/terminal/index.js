/*jslint plusplus: true, devel: true, nomen: true, vars: true, node: true, es5: true, indent: 4, maxerr: 50 */
/*global require, exports, module */

var app         = require("../../lib/app"),
    path        = require("path"),
    cmdLine = "node " + path.join(__dirname, "..", "..", "node_modules", "web-terminal", "bin", "run");

app.terminalStart = function (callback) {
    "use strict";
    
    app.startHttpServer(cmdLine, callback);
};