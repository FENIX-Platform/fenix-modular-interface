/*global define, window */

define([ "jquery"], function ($) {

    function PreIndexContext() {
    }

    PreIndexContext.prototype.initialize = function () {

        $("#btn").on("click", function () {

            var key = "myKey",
                value = "myValue";

            window.localStorage.setItem(key, value);

            if (window.localStorage.getItem(key) === value) {

                console.log("sessionStore: data successfully saved.");
                console.log("key: " + key + " - value: " + value);
                console.log(">> redirecting to Analysis web tool")

                window.setTimeout(function () {
                    location.pathname = "analysis/index.html";
                }, 2000);

            }

        })

    };

    return PreIndexContext;

});