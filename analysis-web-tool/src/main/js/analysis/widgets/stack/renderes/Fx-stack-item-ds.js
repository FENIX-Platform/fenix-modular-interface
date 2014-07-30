/*global define */

define([
    'jquery'
], function ($) {

    'use strict';

    var o = { },
        defaultOptions = {
            interaction: "click"
        },
        selectors = {
        },
        events = {
            CREATE_PANEL: "",
            ADD_ITEM: "",
            REMOVE_ITEM: ""
        };

    function DataSetRender(options) {
        $.extend(true, o, defaultOptions, options)
    }

    DataSetRender.prototype.getItem = function(){
     return $("<li><span>ITEM ITEM ITEM</span></li>");
    };

    return DataSetRender;
});