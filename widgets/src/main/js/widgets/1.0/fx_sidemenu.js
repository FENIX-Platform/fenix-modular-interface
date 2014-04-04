/*global define */

define(["jquery", "W_Commons", "bs"], function ($, W_Commons) {

    var err = {
            //Resource retrieving errors
            101: "SIDEMENU_JSON_STRUCTURE_RETRIEVING_ERR",
            200: "SIDEMENU_INVALID_CONTAINER",
            //Validations errors
            200: "SIDEMENU_INVALID_CONTAINER",
            202: "SIDEMENU_JSON_STRUCTURE_NOT_SPECIFIED"
        },
        o = {
            widget: {
                name: "Fx_SideMenu",
                version: "1.0",
                lang: "EN"
            },
            config: {
                jsonStructure: "http://localhost:8080/widgets/json/1.0/Fx_SideMenu.json",
                "attributeToRaiseOnClik" : "data-semantic",
                "labelAttributeRaisedOnClick" : "semantic"
            },
            jsonKeys:{
                items : "items",
                labels: "labels",
                href: "href",
                children: "children",
                attrs: "attrs"
            },
            events: {
                initialized : "initialized.widget.fenix",
                rendered : "rendered.widget.fenix",
                selected : "selected.widget.fenix"
            },
            cache: {
                jsonStructure: "fenix.interface.cache.Fx_SideMenu.jsonStructure"
            }
        },
        W_Commons,
        widgetCache = {};

    function Fx_SideMenu() {
        W_Commons = new W_Commons();
    }

    Fx_SideMenu.prototype.validateOptions = function(o) {

        if ( !W_Commons.isNode(o.container)){
            W_Commons.handleError(200, err);
        }
        //Json Structure param
        if (!o.config.jsonStructure){
            W_Commons.handleError(202, err);
        }
    };

    Fx_SideMenu.prototype.initialize = function (options) {
        var self = this;
        $.extend(o, options);

        //Load dynamically the css file is specified
        if (o.css){
            W_Commons.loadCss(o.css)
        }

        self.validateOptions( o );
        W_Commons.raiseCustomEvent(o.container, o.events.initialized, self);

    };

    Fx_SideMenu.prototype.render = function (options) {
        var self = this;
        $.extend(o, options);

        //Set widget lang
        if (W_Commons.getLang()){
            o.widget.lang =  W_Commons.getLang();
        }

        //Cache retrieved htmlBase
        if (o.useSessionCache){
            console.log("USING SESSION CACHE");

            //Retrieved cached jsonStructure
            if (W_Commons.getCacheItem(o.cache.jsonStructure)){

                widgetCache[o.cache.jsonStructure] = JSON.parse(W_Commons.getCacheItem(o.cache.jsonStructure));

            }
        }

        /*
         * Check if HTMl and JSON are cached otherwise retrieve them
         */
        if (widgetCache[o.cache.jsonStructure]) {
            console.log("CACHED")

            self.createMenu(widgetCache[o.cache.jsonStructure]);

        } else {
            console.log("Fx_SideMenu Retrieving jsonStructure");

            $.getJSON(o.config.jsonStructure, function (json, result) {

                //Cache retrieved htmlBase
                if (o.useSessionCache){
                    console.log("Session cache: json")
                    W_Commons.setCacheItem(o.cache.jsonStructure, JSON.stringify(json));
                }
                widgetCache[o.cache.jsonStructure] = json;

                self.createMenu(widgetCache[o.cache.jsonStructure]);

            }).error(function () {
                W_Commons.handleError(100, err)
            });
        }

    };

    Fx_SideMenu.prototype.createMenu = function ( json ) {
        var self = this;

        var $structure = $("<div class='fx-sidebar hidden-print affix-top'></div>"),
            $mainUl = $('<ul class="nav fx-sidenav"></ul>');

        if (json.hasOwnProperty(o.jsonKeys.items)){

            for(var i=0; i<json[o.jsonKeys.items].length; i++){
                self.createItem(json[o.jsonKeys.items][i], $mainUl);
            }
        }

        //Activate item
        $mainUl.find("li").on("click", {$mainUl: $mainUl}, function(e){
            var $selectedItem = $(this),
                cssClass = "active";

            $mainUl.find("li").removeClass(cssClass);
            $selectedItem.addClass(cssClass);

            if ($selectedItem.attr(o.config.attributeToRaiseOnClik)){
                var payload = { widget: self };
                payload[o.config.labelAttributeRaisedOnClick] = $selectedItem.attr(o.config.attributeToRaiseOnClik);
                W_Commons.raiseCustomEvent(o.container, o.events.selected, payload);
            }

        })

        //Inject menu within container
        $(o.container).empty().append($structure.append($mainUl));
        W_Commons.raiseCustomEvent(o.container, o.events.rendered, self);

    };

    Fx_SideMenu.prototype.createItem = function(item, $parent){
        var self = this,
            $li = $('<li></li>'),
            $a = $('<a></a>');

        //Set href if existing
        if (item.hasOwnProperty(o.jsonKeys.href)){
            $a.attr("href", item[o.jsonKeys.href]);
        };
        //Set label if existing
        if (item.hasOwnProperty(o.jsonKeys.labels)){
            $a.text(item[o.jsonKeys.labels][o.widget.lang]);
        };
        //Set custom HTML attributes
        if (item.hasOwnProperty(o.jsonKeys.attrs)){
            var attrs = Object.keys(item[o.jsonKeys.attrs]);

            for (var i=0; i<attrs.length; i++){
                if (item[o.jsonKeys.attrs].hasOwnProperty(attrs[i])){
                    $li.attr(attrs[i], item[o.jsonKeys.attrs][attrs[i]]);
                }
            }
        }

        $li.append($a);

        //Add children
        if(item.hasOwnProperty(o.jsonKeys.children)){
            var $ul= $('<ul class="nav"></ul>');

            for (var i=0; i<item[o.jsonKeys.children].length; i++){
                self.createItem(item[o.jsonKeys.children][i], $ul);
            }

            $li.append($ul);
        }

        $parent.append($li);

    };

    return Fx_SideMenu;

});