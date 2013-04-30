/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, unescape, window, Mustache */

define(function (require, exports, module) {
    "use strict";
    
    var Strings         = require("modules/strings"),
        Templates       = $(require("text!modules/templates.html")),
        labels          = {
            addRepo     : Strings.LBL_ADD_REPO,
            installed   : Strings.LBL_INSTALLED,
            npm         : Strings.LBL_NPM
        },
        currRepo,
        editor,
        root,
        midCol,
        rightCol;
    
    function setCurrRepo(repo) {
        midCol.empty();
        rightCol.empty();
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
            if (res) {
                res.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });
                var tmpl = Templates.find("#md-list-tmpl");
                midCol.html(Mustache.render(tmpl.html(), { modules: res }));
            }
            
            if (err) {
                // TODO: print error or warning message
            }
        });
    }
    
    function showNPM() {
        setCurrRepo("npm");
        
        
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
        
        midCol = $("#md-mid-col");
        rightCol = $("#md-right-col")
        
        $("#installed").on("click", showInstalled);
        $("#npm").on("click", showNPM);
        $("#addRepo").on("click", addRepo);
        
        showInstalled();
        
        // Cleanup on close
        $(editor).on("closing", function () {
            $("#modules-css").remove();
        });
    };
    
});