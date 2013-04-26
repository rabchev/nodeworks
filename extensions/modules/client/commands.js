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
        var path                = "form://extensions.svc/modules/client/controller.js",
            DocumentManager     = brackets.getModule("document/DocumentManager"),
            doc                 = DocumentManager.getOpenDocumentForPath(path);
        
        if (!doc) {
            var NativeFileSystem    = brackets.getModule("file/NativeFileSystem").NativeFileSystem,
                fileEntry           = new NativeFileSystem.FileEntry(path),
                timestamp           = new Date();
                
            fileEntry.name = Strings.WINDOW_TITLE;
            doc = new DocumentManager.Document(fileEntry, timestamp, "");
        }
        
        DocumentManager.setCurrentDocument(doc);
    }
    
    CommandManager.register(Strings.CMD_MODULES, exports.PROJECT_MODULES, handleModules);
});