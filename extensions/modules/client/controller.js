/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, unescape, window */

define(function (require, exports, module) {
    "use strict";
    
    module.exports = exports = function (editor) {
        var root = editor.getRootElement();
        
        $(root).html("<h1>Hello World</h1>");
    };
    
});