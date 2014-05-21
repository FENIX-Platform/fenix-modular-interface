/*global requirejs, $, require */

requirejs.config({
    "baseUrl": "js",
    "paths": {
        "jquery": "//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min",
        "bs" : "//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min",
        "W_Commons" : "../../widgets/js/widgets/1.0/fx_w_commons",
        "TopMenu" : "../../widgets/js/widgets/1.0/fx_topmenu",
        "SideMenu" : "../../widgets/js/widgets/1.0/fx_sidemenu"

    }
});

require(["IndexContext", "domReady!"], function(IndexContext){

    var indexContext = new IndexContext();
    indexContext.initialize();

});