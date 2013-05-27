/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global exports */

exports.stripTrailingSlash = function (str) {
    "use strict";
    
    if (str.substr(-1) === "/") {
        return str.substr(0, str.length - 1);
    }
    return str;
};

exports.addTrailingSlash = function (str) {
    "use strict";
    
    if (str.substr(-1) !== "/") {
        return str + "/";
    }
    return str;
};

exports.startsWith = function (str, val) {
    "use strict";
    
    if (typeof val === "string") {
        return str.slice(0, val.length) === val;
    }
    
    var i, itm;
    for (i = 0; i < val.length; i++) {
        itm = val[i];
        if (str.slice(0, itm.length) === itm) {
            return true;
        }
    }
    return false;
};

exports.endsWith = function (str, val) {
    "use strict";
    
    if (typeof val === "string") {
        return str.slice(-val.length) === val;
    }
    
    var i, itm;
    for (i = 0; i < val.length; i++) {
        itm = val[i];
        if (str.slice(-itm.length) === itm) {
            return true;
        }
    }
    return false;
};
    