/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, unescape, window */

define(function (require, exports, module) {
    "use strict";
    
    var CommandManager          = brackets.getModule("command/CommandManager"),
        Dialogs                 = brackets.getModule("widgets/Dialogs"),
        Strings                 = require("terminal/strings"),
        terminalWin,
        terminalPort;
    
    exports.TOOLS_TERMINAL       = "tools.terminal";
    
    function setLocation(win, url, delay) {
        if (delay) {
            window.setTimeout(function () {
                win.location = url;
            }, 1000);
        } else {
            win.location = url;
        }
    }
    
    function handleTerminal() {
        
        function openWindow(delay) {
            var loc = window.location,
                url = loc.protocol + "//" + loc.hostname + ":" + terminalPort;
            
            setLocation(terminalWin, url, delay);
        }
        
        if (!terminalWin || terminalWin.closed) {
            terminalPort = null;
            terminalWin = window.open("", "terminalWin");
            terminalWin.document.body.innerHTML = Strings.WAITING_SERVER;
        }
        
        if (terminalPort) {
            openWindow(false);
        } else {
            brackets.app.callCommand("app", "terminalStart", [], true, function (err, res) {
                var response = err || res;
                if (response.port) {
                    terminalPort = response.port;
                    openWindow(true);
                } else {
                    Dialogs.showModalDialog(
                        Dialogs.DIALOG_ID_ERROR,
                        Strings.ERROR_NODE_START_TITLE,
                        err.message
                    );
                }
            });
        }
    }
    
    CommandManager.register(Strings.CMD_TERMINAL, exports.TOOLS_TERMINAL, handleTerminal);
});