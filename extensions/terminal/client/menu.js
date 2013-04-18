/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, unescape, window */

define(function (require, exports, module, commands) {
    "use strict";
    
    var Menus           = brackets.getModule("command/Menus"),
        Commands        = require("terminal/commands"),
        menu            = Menus.getMenu(Menus.AppMenuBar.TOOLS_MENU);
    
    menu.addMenuItem(Commands.TOOLS_TERMINAL, null, Menus.BEFORE, "tools.options");
});