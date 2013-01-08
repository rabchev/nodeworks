/*jslint plusplus: true, devel: true, nomen: true, node: true, indent: 4, maxerr: 50 */
/*global require, exports, module */

var testCase  = require('nodeunit').testCase;

var connect = require('connect');
var works = require('../lib/works.js');
var http = require("http");
var port = 3119;
var appUrl = "http://localhost:" + port;
var app;

module.exports = testCase({
    "Fixture Setup": function (test) {
        "use strict";
        app = connect()
            .use('/works', works())
            .use(function (req, res) {
                res.end('Hello World');
            })
            .listen(port);
        
        test.done();
    },
    "test default path redirect": function (test) {
        "use strict";
        test.expect(2);
        http.get(appUrl + "/works", function (res) {
            res.setEncoding('utf8');
            
            test.equal(res.statusCode, 302);
            test.equal(res.headers.location, "/works/");
            test.done();
        }).on('error', function (e) {
            console.log("Got error: " + e.message);
            test.done();
        });
    },
    "test index.html": function (test) {
        "use strict";
        test.expect(3);
        http.get(appUrl + "/works/", function (res) {
            res.setEncoding('utf8');
            
            test.equal(res.statusCode, 200);
            test.equal(res.headers["content-type"], "text/html; charset=UTF-8");
            res.on("data", function (chunk) {
                var str = String(chunk);
                test.ok(str.indexOf("<script src=\"thirdparty/require.js\" data-main=\"brackets\"></script>") !== -1);
                test.done();
            });
        }).on('error', function (e) {
            console.log("Got error: " + e.message);
            test.done();
        });
    },
    "test resource file": function (test) {
        "use strict";
        test.expect(3);
        http.get(appUrl + "/works/thirdparty/require.js", function (res) {
            res.setEncoding('utf8');
            
            test.equal(res.statusCode, 200);
            test.equal(res.headers["content-type"], "application/javascript");
            res.on("data", function (chunk) {
                var str = String(chunk);
                test.ok(str.indexOf("RequireJS") !== -1);
                test.done();
            });
        }).on('error', function (e) {
            console.log("Got error: " + e.message);
            test.done();
        });
    },
    "test works 404": function (test) {
        "use strict";
        test.expect(1);
        http.get(appUrl + "/works/nonexistent.js", function (res) {
            test.equal(res.statusCode, 404);
            test.done();
        }).on('error', function (e) {
            console.log("Got error: " + e.message);
            test.done();
        });
    },
    "test non works request": function (test) {
        "use strict";
        test.expect(2);
        http.get(appUrl + "/", function (res) {
            res.setEncoding('utf8');
            
            test.equal(res.statusCode, 200);
            res.on("data", function (chunk) {
                var str = String(chunk);
                test.ok(str.indexOf("Hello World") !== -1);
                test.done();
            });
        }).on('error', function (e) {
            console.log("Got error: " + e.message);
            test.done();
        });
    },
    "Fixture Teardown": function (test) {
        "use strict";
        app.close();
        test.done();
    }
});