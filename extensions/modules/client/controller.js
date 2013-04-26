/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, unescape, window */

define(function (require, exports, module) {
    "use strict";
    
    module.exports = exports = function (editor) {
        var root = $(editor.getRootElement());
        
        if ($("#modules-css").length === 0) {
            $("head").append(
                $("<link id='modules-css' rel='stylesheet' href='extensions.svc/modules/client/main.css' type='text/css' media='screen' />")
            );
        }
        root.addClass("md-root");
        root.html(require("text!modules/main.html"));
        
        // Cleanup on close
        $(editor).on("closing", function () {
            $("#modules-css").remove();
        });
    };
    
});