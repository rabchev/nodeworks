/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, unescape, window */

define(function (require, exports, module) {
    "use strict";
    
    var Menus           = brackets.getModule("command/Menus"),
        Commands        = require("modules/commands"),
        menu            = Menus.getMenu(Menus.AppMenuBar.PROJECT_MENU);
    
    menu.addMenuItem(Commands.PROJECT_MODULES, "Alt-Shift-M", Menus.AFTER, "project.live");
});