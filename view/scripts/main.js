requirejs.config({

    baseUrl: 'scripts/lib',

    paths : {
        host : '../host',
        json : "../../json",
        structure : '../structure'
    },
   
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        "jquery.history": {
            deps: ['jquery']
        }
    }
});

require(['host', 'domReady!'], function( Host ) {

    var host = new Host();
    host.initFenixComponent()

});