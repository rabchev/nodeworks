/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, unescape, window, document, Mustache */

define(function (require, exports, module) {
    "use strict";
    
    var Dialogs             = brackets.getModule("widgets/Dialogs"),
        ExtensionManager    = brackets.getModule("utils/ExtensionLoader"),
        output              = ExtensionManager.getRequireContextForExtension("output-panel")("main"),
        Strings             = require("modules/strings"),
        Templates           = $(require("text!modules/templates.html")),
        labels              = {
            addRepo             : Strings.LBL_ADD_REPO,
            installed           : Strings.LBL_INSTALLED,
            npm                 : Strings.LBL_NPM
        },
        detLabels           = {
            addRemove           : Strings.LBL_UNINSTALL,
            readMe              : Strings.LBL_VIEW_README,
            viewDeps            : Strings.LBL_VIEW_DEPS,
            description         : Strings.LBL_DESCRIPTION,
            version             : Strings.LBL_VERSION,
            license             : Strings.LBL_LICENSE,
            author              : Strings.LBL_AUTHOR,
            contribs            : Strings.LBL_CONTRIBS,
            repository          : Strings.LBL_REPOSITORY,
            bugs                : Strings.LBL_BUGS,
            name                : Strings.LBL_NAME,
            email               : Strings.LBL_EMAIL,
            url                 : Strings.LBL_URL,
            type                : Strings.LBL_TYPE,
            homepage            : Strings.LBL_HOMEPAGE
        },
        extName             = "Modules",
        currRepo,
        editor,
        root,
        midCol,
        rightCol,
        currMod;
            
    function setCurrRepo(repo) {
        if (currRepo !== repo) {
            midCol.empty();
            rightCol.empty();
            
            if (currRepo) {
                $("#" + currRepo).removeClass("md-selected");
            }
            
            currRepo = repo;
            $("#" + currRepo).addClass("md-selected");
        }
    }
    
    function setCurrListItem(item) {
        if (currMod !== item) {
            rightCol.empty();
            
            if (currMod) {
                $(document.getElementById(currMod)).removeClass("md-selected");
            }
            
            currMod = item;
            $(document.getElementById(currMod)).addClass("md-selected");
        }
    }
    
    function addRepo() {
        alert("Not implemented yet.");
    }
    
    function showDetailes(id) {
        setCurrListItem(id);
        
        var tmpl    = Templates.find("#md-details-tmpl");
        
        brackets.app.callCommand("modules", "getInstalledModule", [id], true, function (err, res) {
            var el;
            
            if (res) {
                res.labels = detLabels;
                if (typeof res.license === "string") {
                    res.license = { type: res.license };
                }
                if (typeof res.bugs === "string") {
                    res.bugs = { url: res.bugs };
                }
                
                rightCol.html(Mustache.render(tmpl.html(), res));
                
                if (res.readmeFilename) {
                    el = rightCol.find("#md-readMe");
                    el.click(function () {
                        window.open("modules/readme/" + res.name, res.name);
                    });
                }
                
                if (res.depsCount) {
                    el = rightCol.find("#md-deps");
                    el.click(function () {
                        brackets.app.callCommand("modules", "getDeps", [id], true, function (err, res) {
                            if (err) {
                                throw err;
                            }
                            
                            var tmpl    = Templates.find("#md-deps-dialog").html(),
                                part    = {
                                    part: Templates.find("#md-deps-dialog-part").html()
                                },
                                mod     = {
                                    deps    : res,
                                    labels  : {
                                        title   : Strings.VIEW_DEPS_TITLE,
                                        close   : Strings.CMD_CLOSE
                                    }
                                };
                            
                            Dialogs.showModalDialogUsingTemplate(Mustache.render(tmpl, mod, part));
                        });
                    });
                }
                
                el = rightCol.find("#md-addRemove");
                if (res.isExtraneous) {
                    el.text(Strings.LBL_INSTALL);
                    el.click(function () {
                    
                    });
                } else {
                    el.text(Strings.LBL_UNINSTALL);
                    el.click(function () {
                        output.log(extName, "Uninstalled Successfully.");
                    });
                }
            }
            
            if (err) {
                output.log(extName, err.message);
            }
        });
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
                
                var listItems   = $(".md-list-itm"),
                    click       = function (el) {
                        showDetailes(el.currentTarget.id);
                    },
                    i;
                
                for (i = 0; i < listItems.length; i++) {
                    $(listItems[i]).on("click", click);
                }
                
                if (res.length > 0) {
                    showDetailes(res[0]._id);
                }
            }
            
            if (err) {
                output.log(extName, err.message);
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
        rightCol = $("#md-right-col");
        
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