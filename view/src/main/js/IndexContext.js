/*global define, window */

define(["TopMenu", "SideMenu"], function( Fx_TopMenu, Fx_SideMenu ) {

    function IndexContext(){}

    IndexContext.prototype.initialize = function() {

        var topMenu = new Fx_TopMenu();
        topMenu.initialize(
            {
                container : document.getElementById("topMenu"),
                useSessionCache : false
            });

        var sideMenu = new Fx_SideMenu();
        sideMenu.initialize(
            {
                container : document.getElementById("sideMenu"),
                css: "http://localhost:8080/widgets/css/widgets/1.0/fx_sidemenu.css"
            });

        //TODO to move within controller instance
        //topMenu.render();
        sideMenu.render();

    };

    return IndexContext;

});