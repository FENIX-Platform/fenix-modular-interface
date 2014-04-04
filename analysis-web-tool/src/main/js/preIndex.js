requirejs.config({
    "baseUrl": "js",
    "paths": {
        "jquery": "//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min"
    }
});

require(["jquery"], function($){

    $(document).ready(function() {

        require([ "PreIndexContext" ], function( PreIndexContext ) {

            console.log("PreIndex initialization.")

            // Create a new IndexContext and initialize it which will create and
            // start a HelloWorldController
            var preIndexContext = new PreIndexContext();
            preIndexContext.initialize();
        });

    });

});