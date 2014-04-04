/*global define */

/*
* TODO:
*  rendering of lang picker
*  search field callback
*/

define(["jquery", "W_Commons", "bs"], function ($, W_Commons) {

    var err = {
        //Resources request errors
        100 : "TOPMENU_HTML_BASE_RETRIEVING_ERR",
        101: "TOPMENU_JSON_STRUCTURE_RETRIEVING_ERR",
        // Validations erros
        200: "TOPMENU_INVALID_CONTAINER",
        201: "TOPMENU_HTML_BASE_NOT_SPECIFIED",
        202: "TOPMENU_JSON_STRUCTURE_NOT_SPECIFIED"
        },
        o = {
        widget: {
            name: "Fx_TopMenu",
            version: "1.0",
            lang: "EN"
        },
        selectors: {
            rightItems: "#fx-tm-right-items",
            leftItems: "#fx-tm-left-items",
            brand: "#fx-tm-logo-brand"
        },
        jsonKeys: {
            labels: "labels",
            left: "left",
            right: "right",
            brand: "brand",
            attrs: "attrs",
            children: "children",
            href: "href",
            src: "src",
            alt: "alt",
            placeholders : "placeholders",
            type: "type"

        },
        config: {
            htmlBase: "http://localhost:8080/widgets/html/widgets/1.0/Fx_TopMenu_frag.html",
            jsonStructure: "http://localhost:8080/widgets/json/1.0/Fx_TopMenu.json"
        },
        events: {
            initialized : "initialized.widget.fenix",
            rendered : "rendered.widget.fenix"
        },
        cache : {
            htmlBase : "fenix.interface.cache.Fx_TopMenu.htmlBase",
            jsonStructure: "fenix.interface.cache.Fx_TopMenu.jsonStructure"
        },
        useSessionCache : false
    },
    W_Commons, widgetCache = {};

    function Fx_TopMenu() {
        W_Commons = new W_Commons();
    }

    Fx_TopMenu.prototype.validateOptions = function(o) {

        //Container valid HTML node
        if ( !W_Commons.isNode(o.container)){
            W_Commons.handleError(200, err);
        }
        //Html base param
        if (!o.config.htmlBase){
            W_Commons.handleError(201, err);
        }
        //Json Structure param
        if (!o.config.jsonStructure){
            W_Commons.handleError(202, err);
        }
    };

    Fx_TopMenu.prototype.initialize = function (options) {
        var self = this;
        $.extend(o, options);

        self.validateOptions(o);
        W_Commons.raiseCustomEvent(o.container, o.events.initialized, self);

    };

    Fx_TopMenu.prototype.render = function (options) {
        var self = this;
        $.extend(o, options);

        //Set widget lang
        if (W_Commons.getLang()){
            o.widget.lang =  W_Commons.getLang();
        }

        if (o.useSessionCache){
            console.log("Fx_TopMenu: USING SESSION CACHE");

            //Retrieved cached htmlBase
            if (W_Commons.getCacheItem(o.cache.htmlBase)){

                widgetCache[o.cache.htmlBase] = $(W_Commons.getCacheItem(o.cache.htmlBase)).get(0);
            }

            //Retrieved cached jsonStructure
            if (W_Commons.getCacheItem(o.cache.jsonStructure)){

                widgetCache[o.cache.jsonStructure] = JSON.parse(W_Commons.getCacheItem(o.cache.jsonStructure));

            }
        }

        /*
         * Check if HTMl and JSON are cached otherwise retrieve them
         */
        if (widgetCache[o.cache.htmlBase] && widgetCache[o.cache.jsonStructure]) {
            console.log("Fx_TopMenu: CACHED")

            self.createMenu(widgetCache[o.cache.htmlBase], widgetCache[o.cache.jsonStructure]);

        }
        else {
            console.log("Fx_TopMenu: Retrieving htmlBase and jsonStructure");

            $.get(o.config.htmlBase, function (html) {

                //Cache retrieved htmlBase
                if (o.useSessionCache){
                    console.log("Session cache: htmlBase")
                    W_Commons.setCacheItem(o.cache.htmlBase, html);
                }
                widgetCache[o.cache.htmlBase] = html;

                $.getJSON(o.config.jsonStructure, function (json, result) {

                    //Cache retrieved htmlBase
                    if (o.useSessionCache){
                        console.log("Session cache: json")
                        W_Commons.setCacheItem(o.cache.jsonStructure, JSON.stringify(json));
                    }
                    widgetCache[o.cache.jsonStructure] = json;

                    self.createMenu(widgetCache[o.cache.htmlBase], widgetCache[o.cache.jsonStructure]);

                }).error(function () {
                    W_Commons.handleError(100, err)
                });

            }).error(function () {
                    W_Commons.handleError(101, err)
                });
        }

    };

    Fx_TopMenu.prototype.createItem = function (item, $list) {
        var $li = $("<li></li>"),
            $a = $("<a href='" + item.target + "'>" + item[o.jsonKeys.labels][o.widget.lang] + "</a>");

        //Add custom attribute to li element
        if (item.hasOwnProperty(o.jsonKeys.attrs)){
            var attrs = Object.keys(item[o.jsonKeys.attrs]);

            for (var i=0; i<attrs.length; i++){
                if (item[o.jsonKeys.attrs].hasOwnProperty(attrs[i])){
                    $li.attr(attrs[i], item[o.jsonKeys.attrs][attrs[i]]);
                }
            }
        }

        $li.append($a);

        $list.append($li);

    };

    Fx_TopMenu.prototype.createDropdown = function (item, $list) {

        var self = this;

        var $li = $('<li class="dropdown"></li>'),
            $a = $('<a href="#" class="dropdown-toggle" data-toggle="dropdown">' + item[o.jsonKeys.labels][o.widget.lang] + ' <b class="caret"></b></a>'),
            $ul = $('<ul class="dropdown-menu"></ul>');

        $li.append($a).append($ul);

        //Append dropdown children
        if (item.hasOwnProperty(o.jsonKeys.children)) {
            for (var i = 0; i < item[o.jsonKeys.children].length; i++) {
                switch (item[o.jsonKeys.children][i].type) {
                    case "item" :
                        self.createItem(item[o.jsonKeys.children][i], $ul);
                        break;
                    case "divider" :
                        self.createDivider(item[o.jsonKeys.children][i], $ul);
                        break;
                }
            }
        }

        //Add custom attribute to li element
        if (item.hasOwnProperty(o.jsonKeys.attrs)){
            var attrs = Object.keys(item[o.jsonKeys.attrs]);

            for (var i=0; i<attrs.length; i++){
                if (item[o.jsonKeys.attrs].hasOwnProperty(attrs[i])){
                    $li.attr(attrs[i], item[o.jsonKeys.attrs][attrs[i]]);
                }
            }
        }

        $list.append($li)

    };

    Fx_TopMenu.prototype.createBrand = function (item, $brand) {

        if (item.hasOwnProperty(o.jsonKeys.href)) {
            $brand.attr("href", item[o.jsonKeys.href])
        }

        var $img = $('<img src="' + item[o.jsonKeys.src] + '">');

        if (item.hasOwnProperty(o.jsonKeys.alt)) {
            $img.attr("alt", item[o.jsonKeys.alt])
        }

        $brand.append($img);

    };

    Fx_TopMenu.prototype.createLangPicker = function (item, $list) {

    };

    Fx_TopMenu.prototype.createDivider = function (item, $list) {

        $list.append('<li class="divider"></li>');

    };

    Fx_TopMenu.prototype.createSearch = function (item, $list) {

        var $form = $('<form class="navbar-form navbar-left" role="search"></form>'),
            $div = $('<div class="form-group"></div>'),
            $input = $('<input type="text" class="form-control" >');

        if (item.hasOwnProperty()) {
            $input.attr("placeholder", item[o.jsonKeys.placeholders][o.widget.lang]);
        }

        $form.append($div.append($input));
        $list.append($form);

    };

    Fx_TopMenu.prototype.selectRender = function (item, $list) {
        var self = this;

        if (item.hasOwnProperty(o.jsonKeys.type)) {
            switch (item.type) {

                case "item" :
                    self.createItem(item, $list);
                    break;
                case "dropdown" :
                    self.createDropdown(item, $list);
                    break;
                case "search" :
                    self.createSearch(item, $list);
                    break;
                case "langpicker" :
                    self.createLangPicker(item, $list);
                    break;
            }

        }

    };

    Fx_TopMenu.prototype.createMenu = function (structure, items) {
        var self = this,
            $structure = $(structure);

        //Render Brand of Fx_TopMenu
        if (items.hasOwnProperty(o.jsonKeys.brand)) {
            self.createBrand(items[o.jsonKeys.brand], $structure.find(o.selectors.brand));
        }

        //Render left side of the Fx_TopMenu
        if (items.hasOwnProperty(o.jsonKeys.left)) {
            for (var i = 0; i < items[o.jsonKeys.left].length; i++) {

                self.selectRender(items[o.jsonKeys.left][i], $structure.find(o.selectors.leftItems));
            }
        }

        //Render right side of Fx_TopMenu
        if (items.hasOwnProperty(o.jsonKeys.right)) {
            for (var i = 0; i < items[o.jsonKeys.right].length; i++) {

                self.selectRender(items[o.jsonKeys.right][i], $structure.find(o.selectors.rightItems));
            }
        }

        //Inject menu within container
        $(o.container).empty().append($structure);
        W_Commons.raiseCustomEvent(o.container, o.events.rendered, self);

    };

    return Fx_TopMenu;

});