define([
    'structure/structure',
    'text!json/conf.json'
], function( Structure, conf ){

    function Host(){}

    Host.prototype.initFenixComponent = function(){

        var callbacks = {
            "callback 1" : function(){
                console.log("Callback One")
            },
            "callback 2" : function(){
                console.log("Callback Two")
            }
        };

        new Structure().initialize(JSON.parse(conf), callbacks);
    };

    return Host;
	
});