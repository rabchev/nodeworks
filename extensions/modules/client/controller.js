/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, unescape, window, Mustache */

define(function (require, exports, module) {
    "use strict";
    
    var Strings         = require("modules/strings"),
        labels          = {
            addRepo     : Strings.LBL_ADD_REPO,
            installed   : Strings.LBL_INSTALLED,
            npm         : Strings.LBL_NPM
        },
        currRepo,
        editor,
        root;
    
    function setCurrRepo(repo) {
        if (currRepo !== repo) {
            if (currRepo) {
                $("#" + currRepo).removeClass("md-selected");
            }
            
            currRepo = repo;
            $("#" + currRepo).addClass("md-selected");
        }
    }
    
    function addRepo() {
        alert("Not implemented yet.");
    }
    
    function showInstalled() {
        setCurrRepo("installed");
        
        brackets.app.callCommand("modules", "showInstalled", [], true, function (err, res) {
            if (err) {
                alert(err.message);
            } else {
             
                alert(res.message);
            }
        });
    }
    
    function showNPM() {
        setCurrRepo("npm");
        alert("Not implemented yet.");
    }
    
    module.exports = exports = function (edtr) {
        editor  = edtr;
        root    = $(editor.getRootElement());
        
        if ($("#modules-css").length === 0) {
            $("head").append(
                $("<link id='modules-css' rel='stylesheet' href='extensions.svc/modules/client/main.css' type='text/css' media='screen' />")
            );
        }
        root.addClass("md-root");
        root.html(Mustache.render(require("text!modules/main.html"), { labels: labels }));
        
        $("#installed").on("click", showInstalled);
        $("#npm").on("click", showNPM);
        $("#addRepo").on("click", addRepo);
        
        setCurrRepo("installed");
        
        // Cleanup on close
        $(editor).on("closing", function () {
            $("#modules-css").remove();
        });
    };
    
});