/*jslint plusplus: true, devel: true, nomen: true, vars: true, node: true, es5: true, indent: 4, maxerr: 50 */
/*global require, exports, module */

var path        = require("path"),
    modes       = exports.modes = {},
    mimeModes   = exports.mimeModes = {},
    gfmModes    = exports.gfmModes = {},
    gfmMap      = require("./gfm-to-codemirror.json");

function splitLines(string) {
    "use strict";
    
    return string.split(/\r?\n|\r/);
}

function StringStream(string) {
    "use strict";
    
    this.pos = this.start = 0;
    this.string = string;
}

StringStream.prototype = {
    eol: function () {
        "use strict";
    
        return this.pos >= this.string.length;
    },
    sol: function () {
        "use strict";
    
        return this.pos === 0;
    },
    peek: function () {
        "use strict";
    
        return this.string.charAt(this.pos) || null;
    },
    next: function () {
        "use strict";
    
        if (this.pos < this.string.length) {
            return this.string.charAt(this.pos++);
        }
    },
    eat: function (match) {
        "use strict";
    
        var ch = this.string.charAt(this.pos),
            ok;
        
        if (typeof match === "string") {
            ok = ch === match;
        } else {
            ok = ch && (match.test ? match.test(ch) : match(ch));
        }
        
        if (ok) {
            ++this.pos;
            return ch;
        }
    },
    eatWhile: function (match) {
        "use strict";
    
        var start   = this.pos,
            eat     = this.eat(match);
        
        while (eat) {
            eat = this.eat(match);
        }
        return this.pos > start;
    },
    eatSpace: function () {
        "use strict";
    
        var start = this.pos;
        while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) {
            ++this.pos;
        }
        return this.pos > start;
    },
    skipToEnd: function () {
        "use strict";
    
        this.pos = this.string.length;
    },
    skipTo: function (ch) {
        "use strict";
    
        var found = this.string.indexOf(ch, this.pos);
        if (found > -1) {
            this.pos = found;
            return true;
        }
    },
    backUp: function (n) {
        "use strict";
    
        this.pos -= n;
    },
    column: function () {
        "use strict";
    
        return this.start;
    },
    indentation: function () {
        "use strict";
    
        return 0;
    },
    match: function (pattern, consume, caseInsensitive) {
        "use strict";
    
        if (typeof pattern === "string") {
            var cased = function (str) {
                return caseInsensitive ? str.toLowerCase() : str;
            };
            
            if (cased(this.string).indexOf(cased(pattern), this.pos) === this.pos) {
                if (consume !== false) {
                    this.pos += pattern.length;
                }
                return true;
            }
        } else {
            var match = this.string.slice(this.pos).match(pattern);
            
            if (match && consume !== false) {
                this.pos += match[0].length;
            }
            return match;
        }
    },
    current: function () {
        "use strict";
    
        return this.string.slice(this.start, this.pos);
    }
};

exports.StringStream = StringStream;

exports.startState = function (mode, a1, a2) {
    "use strict";
    
    return mode.startState ? mode.startState(a1, a2) : true;
};

exports.defineMode = function (name, mode) {
    "use strict";
    
    modes[name] = mode;
};

exports.defineMIME = function (mime, spec) {
    "use strict";
    
    mimeModes[mime] = spec;
};

function getModeInfo(lang) {
    "use strict";
    
    if (gfmModes.hasOwnProperty(lang)) {
        return gfmModes[lang];
    }
    
    var mime, mode, itm, i;
    
    if (gfmMap.hasOwnProperty(lang)) {
        mime = gfmMap[lang];
        for (i = 0; i < exports.modeInfo.length; i++) {
            itm = exports.modeInfo[i];
            if (itm.mime === mime) {
                mode = itm;
                break;
            }
        }
    } else {
        for (i = 0; i < exports.modeInfo.length; i++) {
            itm = exports.modeInfo[i];
            if (itm.mode === lang || itm.mime === lang) {
                mode = itm;
                break;
            }
        }
    }
    
    if (mode) {
        if (mode.mode && mode.mode !== "null") {
            require(path.join(__dirname,
                              "..",
                              "brackets-src",
                              "src",
                              "thirdparty",
                              "CodeMirror2",
                              "mode",
                              mode.mode,
                              mode.mode));
        } else {
            mode.mode = "plain";
        }
    } else {
        mode = null;
    }
    
    gfmModes[lang] = mode;
    return mode;
}

exports.getMode = function (options, spec, silent) {
    "use strict";
    
    var info, mname, config, mfactory;
    
    if (typeof spec === "string" && mimeModes.hasOwnProperty(spec)) {
        spec = mimeModes[spec];
    }
    
    if (typeof spec === "string") {
        config = {};
        mname = spec;
    } else if (spec !== null) {
        config = spec;
        mname = spec.name;
    }
    
    if (mname) {
        if (!modes.hasOwnProperty(mname)) {
            info = getModeInfo(mname);
            if (info) {
                mname = info.mode;
            } else {
                mname = null;
            }
        }
        if (mname) {
            mfactory = modes[mname];
            if (mfactory) {
                return mfactory(options, config);
            }
        }
    }
    
    if (silent) {
        return null;
    }
    
    throw new Error("Unknown mode: " + spec);
};

exports.runMode = function (string, modespec, callback) {
    "use strict";
    
    var mode = exports.getMode({indentUnit: 2}, modespec, true),
        lines,
        state,
        stream,
        i,
        e;
    
    if (mode) {
        lines = splitLines(string);
        state = exports.startState(mode);
        
        for (i = 0, e = lines.length; i < e; ++i) {
            if (i) {
                callback("\n");
            }
            stream = new exports.StringStream(lines[i]);
            while (!stream.eol()) {
                var style = mode.token(stream, state);
                callback(stream.current(), style, i, stream.start);
                stream.start = stream.pos;
            }
        }
    }
};

modes.plain = function () {
    "use strict";
    
    return {
        token: function (stream) {
            stream.skipToEnd();
        }
    };
};

global.CodeMirror = exports;
require("../brackets-src/src/thirdparty/CodeMirror2/mode/meta");
