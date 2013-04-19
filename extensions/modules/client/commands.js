/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, unescape, window */

define(function (require, exports, module) {
    "use strict";
    
    var CommandManager          = brackets.getModule("command/CommandManager"),
        Dialogs                 = brackets.getModule("widgets/Dialogs"),
        Strings                 = require("modules/strings"),
        terminalWin,
        terminalPort;
    
    exports.PROJECT_MODULES       = "project.modules";
        
    function handleModules() {
        var DocumentManager     = brackets.getModule("document/DocumentManager"),
            NativeFileSystem    = brackets.getModule("file/NativeFileSystem").NativeFileSystem,
            fileEntry           = new NativeFileSystem.FileEntry("form://extensions.svc/modules/client/controler.js");
            
        fileEntry.name = Strings.WINDOW_TITLE;
        
        DocumentManager.setCurrentDocument(new DocumentManager.Document(fileEntry, null, ""));
    }
    
    CommandManager.register(Strings.CMD_MODULES, exports.PROJECT_MODULES, handleModules);
});