/*global requirejs, $, require */

requirejs.config({
    "baseUrl": "js",
    "paths": {
        "jquery": "//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min",
        "bs" : "//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min",
        "history-js" : "lib/jquery.history",
        "mbExtruder" : "lib/mbExtruder",
        "controller" : "controllers/1.0/tool-controller"
    }
});

require(["jquery"], function($){

    $(document).ready(function() {

        require([ "IndexContext" ], function( IndexContext ) {

            console.log("IndexContext initialization.")

            var indexContext = new IndexContext();
            indexContext.initialize();

        });

    });

});